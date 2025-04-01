import React, { useState, useEffect } from "react";
import Windows from './Windows.tsx'

const PC = ({handleClose}) => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(()=>{
    if (window.location.hash.includes('33chan')) {
      setLoggedIn(true)
    }
  }, [])

  if (!loggedIn)
  return (
    <div id="pc">
      <div id="loading-screen">
      <div></div>
        <img id="winblows-logo" src="/winblows logo.png"></img>
        <div style={{textAlign: 'center'}}>
        <img style={{width: '120px', borderRadius: '50%'}} src="/mamimi.png"></img>
        <br />
        Dan
        <br />
        
        <div>
            <input style={{
            backgroundColor: "lightblue",
            fontWeight: 'bold',
            marginTop: '20px',
            width: '160px'
          }} value="Login" type="button" onClick={()=>setLoggedIn(true)}></input>
        </div>
        </div>
        <div></div>
        <div></div>
      </div>
    </div>
  )

  return <div id="pc">
    <Windows handleClose={handleClose} />
  </div>
}

export default PC;