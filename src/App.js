/*global chrome*/

import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';

const generateMockChinese = (inputText) => {
  const mockChinese = `
    谷歌翻译允许您探索不熟悉的土地，以不同的语言进行交流
    并建立原本不可能的联系。谷歌翻译移动应用程序中我最喜
    欢的功能之一是即时相机翻译，它允许您通过将相机镜头对
    准外国文本来以您的语言查看世界。与我们最近在镜头中推
    出的实时翻译功能类似，这是了解周围环境的直观方式`.split("")
  return inputText.split(" ").map(word => _.sample(mockChinese))
}

const App = () => {

  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  useEffect(() => {
    console.log("Initiating chrome.runtime channel on react... ")
    console.log(window.parent)
    window.addEventListener("message", (e) => {
      console.log(`react got a message! `, e)
      console.log(e.data.message)
      if (e.data.type === "highlighted") {
        if (e.data.message) {
          setInput(e.data.message)
          const chingchong = generateMockChinese(e.data.message.trim())
          console.log("Generated mock chinese " + chingchong)
          setOutput(chingchong)
        }
      }
    }, false)
    window.parent.postMessage({ type: "handshake", message: "React says hello" }, "*")
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
            </div>
            <a
              className="App-link"
              onClick={() => closeReactExtension()}
            >
              close
            </a>
        </nav>
        
        <div style={{ width: '100%', height: 'auto', padding: '30px' }}>
          <img src={logo} className="App-logo" alt="logo" />
        </div>

        <div style={{ width: '100%' }}>
          <h1>{output}</h1>
          <p>
            {input}
          </p>
        </div>
        
      </header>
    </div>
  );
}

export default App;
