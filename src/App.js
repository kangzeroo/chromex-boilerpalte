/*global chrome*/

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { translateText, readText } from './api.js'

const App = () => {

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [phonetics, setPhonetics] = useState([])
  const [audio, setAudio] = useState("")
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [voicePenEnabled, setVoicePenEnabled] = useState(true)

  useEffect(() => {
    // demo comms with parent
    window.parent.postMessage({ type: "handshake", message: "React says hello" }, "*")
    // listen to "message" event and subscribe to its events
    const highlightEvents = fromEvent(window, "message").pipe(debounceTime(100))
    highlightEvents.subscribe((e) => {
      if (e.data.type === "highlighted") {
        if (e.data.message) {
          // console.log("-------- TEXT ---------", e.data.message)
          const token = localStorage.getItem('oauth-key') || ""
          setInput(e.data.message)
          readText(e.data.message, token, voicePenEnabled).then(({ text, pronounciation, audio }) => {
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
    const mainAudio = document.getElementById("main-audio")
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
  }, [])

  useEffect(() => {
    // start autoplay
    const mainAudio = document.getElementById("main-audio")
    mainAudio.oncanplaythrough = async () => {
      try {
        mainAudio.playbackRate = playbackSpeed;
        await mainAudio.play()
      } catch (e) {
        console.log(e)
      }
    }
  }, [playbackSpeed])

  const closeReactExtension = () => {
    chrome.storage.sync.set({visibility: 'miminized'}, function() {
    })
  }

  const switchPosition = (side) => {
    chrome.storage.sync.set({position: side}, function() {
    })
  }

  const updatePlaybackSpeed = (e) => {
    const speed = e.target.value
    const mainAudio = document.getElementById("main-audio")
    setPlaybackSpeed(speed)
    mainAudio.playbackRate = speed;
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
        <input id="playback-speed" type="number" onChange={e => updatePlaybackSpeed(e)} min={0.1} max={4} />
        <div style={{ width: '100%', height: 'auto', padding: '30px' }}>
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <div style={{ width: '100%' }}>
          <h5>{output}</h5>
        </div>
        <audio id="main-audio" placeholder="OAuth Playground Google Access Token" controls src={`data:audio/ogg;base64,${audio}`} style={{ zIndex: "999999999999999999999" }} />
      </header>
    </div>
  );
}

export default App;
