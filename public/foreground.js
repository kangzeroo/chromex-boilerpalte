console.log('Starting the foreground script...')

// Injects React into the activeTab's HTML
// document.body.style.width = '800px';
const initPanelLoad = () => {
    // create the root element and insert iframe
    var reactAppRoot = document.createElement('div');
    reactAppRoot.innerHTML = `<div id="reactAppRoot" style="position:fixed;top:0;right:0;height:100%;z-index:99999;width:350px;"><iframe id="chinglish-chromex-iframe" style="width:100%;height:100%;"></iframe></div>`;
    document.body.insertAdjacentElement('afterbegin', reactAppRoot)
    const iframe = document.getElementById("chinglish-chromex-iframe");
    iframe.src = chrome.extension.getURL("index.html");
    iframe.frameBorder = 0;
    // create the messaging broker between iframe & window
    window.addEventListener("message", (e) => {
    }, false)
    iframe.contentWindow.postMessage({ type: "handshake", message: "Hello from foreground.js" }, "*")
    // create the quick toggle button but by default keep it hidden
    var toggleButton = document.createElement('div')
    toggleButton.innerHTML = `<div id="chinglish-chromex-toggle-button" style="position: fixed; bottom: 0px; right: 0px; padding: 10px; display: none; z-index:99999; width: 100px; height: 50px; background-color: black; color: white; font-weight:bold; cursor: pointer; border: 3px solid white;">OPEN CHINGLISH</div>`
    toggleButton.onclick = function() {
        chrome.storage.sync.set({visibility: 'maximized'}, function() {
            // console.log('visibility is maximized');
        })
    }
    document.body.insertAdjacentElement('afterbegin', toggleButton)
    // check storage for settings on visibility and position
    chrome.storage.sync.get(['position','visibility'], function({ position, visibility }) {
        handlePositionChange(position)
        handleVisibilityChange(visibility)
    });
}
initPanelLoad()

const handlePositionChange = (position) => {
    if (position === 'right') {
        document.getElementById("reactAppRoot").style.left = '';
        document.getElementById("reactAppRoot").style.right = '0';
        document.getElementById("chinglish-chromex-toggle-button").style.left = '';
        document.getElementById("chinglish-chromex-toggle-button").style.right = '0';
    } else if (position === 'left') {
        document.getElementById("reactAppRoot").style.left = '0';
        document.getElementById("reactAppRoot").style.right = '';
        document.getElementById("chinglish-chromex-toggle-button").style.left = '0';
        document.getElementById("chinglish-chromex-toggle-button").style.right = '';
    }
}

const handleVisibilityChange = (visibility) => {
    if (visibility === 'maximized') {
        document.getElementById("reactAppRoot").style.display = '';
        document.getElementById("chinglish-chromex-toggle-button").style.display = 'none';
    } else if (visibility === 'miminized') {
        document.getElementById("reactAppRoot").style.display = 'none';
        document.getElementById("chinglish-chromex-toggle-button").style.display = '';
    }
}

// listen for chrome.storage changes to manage panel position
chrome.storage.onChanged.addListener(function(changes, namespace) {
    for (var key in changes) {
      const { oldValue, newValue } = changes[key];
      if (key === 'position') {
          handlePositionChange(newValue)
      }
      if (key === 'visibility') {
          handleVisibilityChange(newValue)
      }
    }
});

// listen for messages from background.js including visibility:maximize
// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//         console.log(sender.tab ?
//                     "from a content script:" + sender.tab.url :
//                     "from the extension");
//         if (request.visibility === "maximize") {
//             handleVisibilityChange(request.visibility)
//         }
// });


// init a messaging connection btwn foreground and background
// chrome.runtime.connect();
// chrome.runtime.onConnect.addListener(function(port) {
//     console.log('Foreground script connected to chrome.runtime', port)
//     port.onMessage.addListener(function(msg) {
//         console.log('Foreground received a message... ')
//         console.log(msg)
//         // listen for the minimize event from React
//         if (msg === "ACTION:MINIMIZE_EXTENSION") {
//             document.body.style.width = '100vw';
//             reactAppRoot.style.display = 'none';
//         }
//     });
// });


// proof that we can manipulate <input />
document.addEventListener('focusin', function(e) {
    // console.log('focusin!', e)
    // e.srcElement.value = "HELLO WORLD"
    e.srcElement.addEventListener("keydown", event => {
        // console.log(`Event with keyCode: ${event.keyCode}`, event)
    })
    // should unsubscribe from eventListener automatically on blur()
})

const iframe = document.getElementById("chinglish-chromex-iframe")

// proof that we can get read mouse highlighted text
document.addEventListener("mouseup", function(e) {
    iframe.contentWindow.postMessage({ type: "highlighted", message: document.getSelection().toString() }, "*")
    iframe.contentWindow.focus()
})


// proof that we can just copy text without interacting with a DOM element
// just hold alt while copying
// https://superuser.com/questions/173200/how-to-select-hyperlink-text-in-google-chrome




// how many downloads do the other chinese apps have?


// will we replicate the <input>.value in the sidepanel?
// 
// what should the default action be?
// 