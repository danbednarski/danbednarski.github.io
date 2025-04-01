import { useState, useEffect, useRef } from 'react';
import files from './files';

const display = (text, output, setOutput, setReadyForInput) => {

  if (text.length > 0) {
    if (text.startsWith('<')) {
      const tagClosingIndex = text.indexOf('>');
      setOutput(output + text.slice(0, tagClosingIndex))
      setTimeout(() => {
        display(
          text.slice(tagClosingIndex),
          output+text.slice(0, tagClosingIndex),
          setOutput,
          setReadyForInput
        );
      }, 28)
    } else {
      setOutput(output+text[0]);
      setTimeout(()=>{
        display(text.slice(1), output+text[0], setOutput, setReadyForInput)
      }, 28)
    }
  } else {
    setReadyForInput(true);
  }
}

const Terminal = ({inputRef}) => {
  const [currentUser, setCurrentUser] = useState('guest')
  const promptText = `${currentUser}@dan.su:~ $ `;
  const init = `
  Welcome to <a target="_blank" href="https://github.com/i-need-to-make-this-an-npm-package">D-WOS Ⓐ</a  > (Dani's Web OS)<br />
  Enter <b   >help</b  > to see available commands<p  />
  `;
  const helpMessage = `
  who - basic info about me.<br />
  ls &nbsp;- list files<br />
  cat - read files. Eg, cat .somefile.txt<br />
  su  &nbsp;- switch users. Eg, su dan
  `; //todo: if they do cat somefile.txt, they get the secret to access the real hackme
  const whoAmIMessage = `
    Dani.<p  />
    Sabreur, <a target="_blank" href="https://git.lain.church/darighost">rogue dev</a  >, quirked up white boi.<p  />
  `;
  const [output, setOutput] = useState("")
  const [readyForInput, setReadyForInput] = useState(false);
  const [prompt, setPrompt] = useState(promptText);

  useEffect(() => {
    display(init, output, setOutput, setReadyForInput)
  }, [])


  useEffect(() => {
    terminalEndRef.current.scrollIntoView({block: 'end'})
  }, [output])

  const terminalEndRef = useRef(null);

  return (
    <div>
      <div ref={terminalEndRef} id="terminal" dangerouslySetInnerHTML={{__html: `<div>${output}</div>`}}></div>
      {(readyForInput) ? (<form spellCheck="false" onSubmit={e=>{
        setPrompt(promptText);
        setReadyForInput(false);

        const [_prompt, _dollarSign, command, argument] = prompt.split(/\s+/)

        switch (command) {
          case 'help':
            display(helpMessage, output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
            break;
          case 'ps':
            display("Here I should display other services running on the server (HNchan, and others)", output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
            break;
          case 'ls':
            display(Object.keys(files).filter(e=>!e.startsWith('.')).map(e=>`${files[e].permissions} ${e}`).join('<br />'), output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
            break;
          case 'whoami':
            display(whoAmIMessage, output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
            break;
          case 'cat':
            if (Object.keys(files).includes(argument)) {
              if (argument === 'HACKME') {
                if (prompt.startsWith('dan')) {
                  display(files[argument].contents, output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
                } else {
                  display('Permission denied.', output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
                }
              } else {
                display(files[argument].contents, output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
              }
            } else {
              display('The file you entered does not exist', output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
            }
            break;
          case 'su':
            setCurrentUser('dan');
            setPrompt('dan@dan.su:~ $ ')
            display('<p  />', output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
            break;
          default:
            display('Unknown command.', output + '<p />' + prompt + '<p />', setOutput, setReadyForInput);
        }

        e.preventDefault();
        return false;
      }}><input autoComplete="off" autoFocus ref={inputRef} onChange={e=>{
        if (e.key === 'Enter') {
          alert('omg')
        }
        else if (e.target.value.length >= promptText.length) setPrompt(e.target.value)
      }} id="prompt" value={prompt} type="text" /></form>) : ""}
    </div>
  )
}

export default Terminal;