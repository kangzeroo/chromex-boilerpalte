/*global chrome*/

import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => {

  useEffect(() => {
    console.log("Initiating chrome.runtime channel on react... ")
  }, [])

  const closeReactExtension = () => {
    console.log('Attempting to minimize extension')
    chrome.storage.sync.set({visibility: 'miminized'}, function() {
      console.log('visibility is minimized');
    })
  }

  const switchPosition = (side) => {
    chrome.storage.sync.set({position: side}, function() {
      console.log(`position is: ${side}`);
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          onClick={() => switchPosition('left')}
        >
          Left
        </a>
        <a
          className="App-link"
          onClick={() => switchPosition('right')}
        >
          Right
        </a>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          onClick={() => closeReactExtension()}
        >
          Close Extension
        </a>
      </header>
    </div>
  );
}

export default App;
