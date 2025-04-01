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
            <span style={{
              margin: "0px",
              color: "black",
              fontFamily: "monospace",
              fontSize:"large"
            }}>
              $ ls -l /var/web/public/
            </span>
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <pre style={{padding: "0px"}}>
            <span><a href='#' onClick={_=>{handleClose2();handleShow()}}>mimikyu/</a>   directory  8MB</span><br />
            <span><a href='#' onClick={_=>alert('only mimikyu')}>code/</a>      directory  1GB</span><br />
            <span><span style={{color:"gray", textDecoration: "line-through"}}>.dotfiles</span>  denied     2KB</span><br />
            <span><a href='#' onClick={_=>alert('only mimikyu')}>wired.txt</a>  text       28B</span><br />
          </pre>
          <hr style={{width: "75px"}}/>
          <div style={{fontSize:"small"}}>
          <p>I've lost things to the Wired.</p>
          <p>Collectibles trapped in a frozen Neopets account. 
          Sats stacked in a seized VPS. Cheers to some State Dept human blob living 
          fat from that little act of wealth redistribution.</p>
          <p>No complaints. With so many people lost, to cry over <i>stuff</i> would lack respect for true pain.
          </p>
          <p onClick={()=>setMuted(!muted)} id="music-link">
            {muted ? "(unmute)" : "(mute)"}
          </p>
          </div>
        </Modal.Body>
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
    </div>
  );
}

export default App;
