import './App.css';
import Terminal from './Terminal';
import Pokeroom from './pokeroom.tsx';
import { useRef, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const inputRef = useRef(null);
  const [focusInput, setFocusInput] = useState(0);
  useEffect(() => {
    inputRef.current?.focus();
  }, [focusInput]);

  const [show, setShow] = useState(false);
  const [muted, setMuted] = useState(false)
  const [show2, setShow2] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  useEffect(() => {
    console.log(window.location.hash)
    if (window.location.hash.includes('33chan')) {
      setShow(true);
      setHasEntered(true);
    }
  }, [])


  return (
    <div className="App">
      {show2 && (
        <div className="modal-video-background">
            <video muted={muted} autoPlay loop>
                <source src="/you're gonna carry that weight.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )}
        <Modal show={show2} onHide={handleClose2} onExited={()=>setFocusInput(focusInput+1)}>
        <Modal.Header closeButton>
          <Modal.Title>
            I didn't come here to die...
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span onClick={()=>setMuted(!muted)} id="music-link">
            {muted ? "(unmute)" : "(mute)"}
          </span>
          <p>I've lost things in the Wired.</p>
          <p>Collectibles trapped in a frozen Neopets account. 
          Sats stacked in a seized VPS. Cheers to some State Dept human blob living 
          fat from that little act of wealth redistribution.</p>
          <p>I don't complain. With so many people lost, to cry over <i>things</i> feels like a lack of respect for suffering.
          </p>
          <i>- Eduardo Galeano (kind of)</i></Modal.Body>
      </Modal>
      <Modal
        size="lg"
        centered
        backdrop="static"
        show={show}
        onHide={handleClose}
        onExited={()=>setFocusInput(focusInput+1)}
      >
        <Modal.Body>
        <div style={{display: (hasEntered) ? "block" : "none" }}>
            <Pokeroom handleClose={handleClose} />
          </div>
          <center>
            <img style={{display: (!hasEntered) ? "block" : "none" }} src="/mimi.png"></img>
          </center>
          {/* {(hasEntered) ? () : (
          )} */}
          
        </Modal.Body>
        <Modal.Footer className="justify-content-around">
        {(hasEntered) ? (<span className="me-2">Arrow keys to navigate</span>) : ""}
        <Button variant="secondary" onClick={()=>{handleClose();setHasEntered(false)}}>
            {(!hasEntered) ? "No thanks" : (
              "Leave"
            )}
          </Button>
          
            {(!hasEntered) ? <Button variant="primary" onClick={()=>{setHasEntered(true); setFocusInput(focusInput+1)}}>Enter</Button> : ""}
          
        </Modal.Footer>
      </Modal>
      <header className="App-header">
        <div id="sigil-container">
          {
            // note: do something with this lmao
          }
          <a target="_blank" href="#" onClick={e=>{e.preventDefault();handleShow2()}}>
            <video width="270" muted autoPlay loop playsInline>
              <source src="/sigil.webm" type="video/webm" />
            </video>
          </a>
        </div>
        <p id='quote'>
          <i>One day, you will be old enough to start reading fairytales again.</i><br />
          <div style={{paddingTop: '8px'}}>- C.S. Lewis</div>
        </p>
      </header>
      <center><hr style={{width: '500px', marginBottom: '40px', marginTop: '10px'}} /></center>
      <Terminal inputRef={inputRef} />
      <div className="pulse-ring">
        <a href="#" onClick={handleShow}><img id="pokeball" src="/pokeball.png"></img></a>
        <div className="circle pulse green"></div>
      </div>
    </div>
  );
}

export default App;
