import useKeypress from 'react-use-keypress';
import React, { useEffect, useState } from 'react';
import PC from './PC.tsx'
import './App.css'

function Pokeroom({ handleClose }) {
  const height = 450;
  const width = 450;
  const playerWidth = 48;
  const playerHeight = 60;
  const [playerHistory, setPlayerHistory]: any = useState([['left', [252, 140]], ['left', [264, 140]]].reverse());

  const [openPC, setOpenPC] = useState(false)
  const [stepping, setStepping] = useState(false)
  const [companionPosition, setCompanionPosition] = useState([260, 140]);
  const [playerPosition, setPlayerPosition] = useState([220, 140]);
  const [playerFacing, setPlayerFacing] = useState('down')
  const [companionFacing, setCompanionFacing] = useState('down')
  const [speechBubbleIndex, setSpeechBubbleIndex] = useState(0)
  const [showSpeechBubble, setShowSpeechBubble] = useState(true)

  const speechMessages = [
    "Hi, I'm Mimikyu!",
    "Use arrow keys to move around.",
    "Access the computer and furniter by walking up to them.",
    "Exit by pressing escape!"
  ]

  // Helper function to check if player is near the desk
  const isNearDesk = (x: number, y: number) => {
    const deskLeft = 200;  // desk position
    const deskWidth = 150;  // desk width

    // Player position (x) is the LEFT edge of the sprite
    // Player sprite is 48px wide, so right edge is at x + 48
    // Desk spans from 150 to 240 (150 + 90)
    // We want to trigger when player overlaps with desk area
    return y <= 0 && x >= deskLeft + 30 && x <= deskLeft + deskWidth + 20;
  }

  useEffect(() => {
    setPlayerHistory(playerHistory.concat([[playerFacing, playerPosition]]))
  }, [playerPosition])

  useEffect(() => {
    if (playerPosition[1] < -80) {
      handleClose()
    }
    if (playerHistory.length % 3 === 0) {
      setStepping(true);
    } else {
      setStepping(false);
    }
  }, [playerPosition])

  useKeypress(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'], (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        if (playerFacing !== 'left')
          setPlayerFacing('left')
        if (isNearDesk(playerPosition[0], playerPosition[1])) {
          setOpenPC(true)
          break
        }

        if ((playerPosition[0] - 12) >= -15)
          setPlayerPosition([playerPosition[0] - 12, playerPosition[1]]);
        break;
      case 'ArrowRight':
        if (playerFacing !== 'right')
          setPlayerFacing('right')
        if (isNearDesk(playerPosition[0], playerPosition[1])) {
          setOpenPC(true)
          break
        }
        if ((playerPosition[0] + 12) <= (width - playerWidth))
          setPlayerPosition([playerPosition[0] + 12, playerPosition[1]]);
        break;
      case 'ArrowUp':
        if (playerFacing !== 'up')
          setPlayerFacing('up')
        if (isNearDesk(playerPosition[0], playerPosition[1])) {
          setOpenPC(true)
          break
        }
        if (playerPosition[0] > 25 && playerPosition[0] < 120) {
          // Door area - allow passage
          setPlayerPosition([playerPosition[0], playerPosition[1] - 12]);
        } else if ((playerPosition[1]) > -40)
          setPlayerPosition([playerPosition[0], playerPosition[1] - 12]);
        // get blocked by desk...
        break;
      case 'ArrowDown':
        if (playerFacing !== 'down')
          setPlayerFacing('down')
        if ((playerPosition[1] + 12) <= (height - playerHeight))
          setPlayerPosition([playerPosition[0], playerPosition[1] + 12]);
        break;
    }

    if (playerHistory.length >= 5) {
      if (playerHistory.length === 7) {
        setCompanionFacing(playerHistory.slice(-4)[0][0])
      } else {
        setCompanionFacing(playerHistory.slice(-5)[0][0])
      }
      setCompanionPosition(playerHistory.slice(-5)[0][1])
    }
  });

  useEffect(() => {
    if (window.location.hash.includes('33chan')) {
      setOpenPC(true)
    }
  }, [])

  // Speech bubble transition effect
  useEffect(() => {
    if (speechBubbleIndex < speechMessages.length - 1) {
      const timer = setTimeout(() => {
        setSpeechBubbleIndex(speechBubbleIndex + 1)
      }, 3000)
      return () => clearTimeout(timer)
    } else if (speechBubbleIndex === speechMessages.length - 1) {
      const timer = setTimeout(() => {
        setShowSpeechBubble(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [speechBubbleIndex])

  if (openPC) {
    return <PC handleClose={() => setOpenPC(false)} />
  }

  return (
    <div id="page" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      <div style={{
        position: 'relative',
        border: "10px solid black",
        height: `${height}px`,
        width: `${width}px`,
        backgroundColor: 'beige'
      }} id="screen">
        <img
          id="player"
          style={{
            zIndex: 100000,
            position: "relative",
            left: `${playerPosition[0]}px`,
            top: `${playerPosition[1]}px`,
            width: '78px',
            height: '85px'
          }} src={
            (!stepping)
              ? `${playerFacing}_still.png`
              : `${playerFacing}_step.png`}>
        </img>
        <img style={{
          zIndex: 10001,
          position: "relative",
          left: `${companionPosition[0] - 72}px`,
          top: `${companionPosition[1] - 4}px`,
          width: '68px',
          height: '68px'
        }} src={`companion_${companionFacing}.png`}>
        </img>
        {showSpeechBubble && (
          <div style={{
            zIndex: 100002,
            position: "absolute",
            left: `${companionPosition[0] + 20}px`,
            top: `${companionPosition[1] - 60}px`,
            backgroundColor: 'white',
            border: '2px solid black',
            borderRadius: '10px',
            padding: '10px 15px',
            maxWidth: '250px',
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '2px 2px 5px rgba(0,0,0,0.3)'
          }}>
            {speechMessages[speechBubbleIndex]}
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '20px',
              width: '0',
              height: '0',
              borderLeft: '10px solid transparent',
              borderRight: '10px solid transparent',
              borderTop: '10px solid white',
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-13px',
              left: '18px',
              width: '0',
              height: '0',
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid black',
              zIndex: -1
            }}></div>
          </div>
        )}
        <img style={{
          position: "relative",
          left: `150px`,
          top: `-45px`,
          width: '90px',
        }} src={`desk.png`}></img>
      </div>
    </div>

  );
}

export default Pokeroom;
