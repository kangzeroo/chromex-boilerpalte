/*global chrome*/

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { translateText } from './api.js'

const App = () => {

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [phonetics, setPhonetics] = useState([])
  const [audio, setAudio] = useState("")

  useEffect(() => {
    // demo comms with parent
    window.parent.postMessage({ type: "handshake", message: "React says hello" }, "*")
    // grab reference for future use
    const mainAudio = document.getElementById("main-audio")
    // listen to "message" event and subscribe to its events
    const highlightEvents = fromEvent(window, "message").pipe(debounceTime(100))
    highlightEvents.subscribe((e) => {
      if (e.data.type === "highlighted") {
        if (e.data.message) {
          // console.log("-------- TEXT ---------", e.data.message)
          const token = localStorage.getItem('oauth-key') || ""
          setInput(e.data.message)
          translateText(e.data.message, token).then(({ text, pronounciation, audio }) => {
            setOutput(text)
            setPhonetics(pronounciation)
            setAudio(audio)
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    })

    // pause audio on spacebar
    window.document.addEventListener("keydown", function(e) {
        if (e.code === "Space") {
          if (!mainAudio.paused) {
            try {
              mainAudio.pause()
            } catch (e) {
              console.log(e)
            }
          }
        }
    })

    // start autoplay
    mainAudio.oncanplaythrough = async () => {
      try {
        await mainAudio.play()
      } catch (e) {
        console.log(e)
      }
    }
  }, [])

  const closeReactExtension = () => {
    chrome.storage.sync.set({visibility: 'miminized'}, function() {
    })
  }

  const switchPosition = (side) => {
    chrome.storage.sync.set({position: side}, function() {
    })
  }

  return (
    <div className="App">
      <header className="App-header" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
        <nav style={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div>
            <a
              className="App-link"
              onClick={() => switchPosition('left')}
            >
              Left
            </a>
            &nbsp; &nbsp;
            <a
              className="App-link"
              onClick={() => switchPosition('right')}
            >
              Right
            </a>
            <a href="https://developers.google.com/oauthplayground/" target="_blank" style={{ color: 'white' }}>&nbsp; &nbsp; OAuth</a>
            </div>
            <a
              className="App-link"
              onClick={() => closeReactExtension()}
            >
              close
            </a>
        </nav>
        <input id="oauth-key" type="text" onChange={(e) => localStorage.setItem('oauth-key', e.target.value)} style={{ width: '100%', padding: '5px' }} />
        <div style={{ width: '100%', height: 'auto', padding: '30px' }}>
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <div style={{ width: '100%' }}>
          <h1>{output}</h1>
          <div>{phonetics.map(x => (<p>{x}</p>))}</div>
          <p>
            {input}
          </p>
        </div>
        <audio id="main-audio" placeholder="OAuth Playground Google Access Token" controls src={`data:audio/ogg;base64,${audio}`} style={{ zIndex: "999999999999999999999" }} />
      </header>
    </div>
  );
}

export default App;
