let type

document.querySelector('#reset').addEventListener('click' , () =>{
    chrome.storage.sync.clear(function() {
        var error = chrome.runtime.lastError;

        if (error) {
            console.error(error);
        }
    })
})

document.querySelector('#gotoURL').addEventListener('click' , () =>{
    chrome.tabs.create({url: "https://dogdrip.net"}, function(tab) {
    })
})

document.querySelector('#extensionPage').addEventListener('click' , () =>{
    chrome.tabs.create({url: "./extensionPage.html"}, function(tab) {
    })
})

document.querySelector('form#check').addEventListener('change'  , ()=> {
    type = document.querySelector('input[name="type"]:checked').value
    chrome.storage.sync.set( {'type' : type }, () => {
        // console.log('set to type :' , type)
    })

    chrome.tabs.query({}, tabs => {
        tabs.forEach( tab => {
            chrome.tabs.sendMessage(tab.id, type);
      })
    })
})

chrome.storage.sync.get('type' , (result) =>{
    // console.log(result.type)

    if(result.type == undefined || result.type == null ){
        type = document.querySelector(".basic").value
        document.querySelector(".basic").checked = true
        document.querySelector('form#check').value = type

        chrome.storage.sync.set( {'type' : type}, () => {
            // console.log('set to type :' , type)
        })    
    }else{
        
        document.querySelector('form#check').value = result.type
        let list = document.querySelectorAll('input[name="type"]')
        Array.from(list).forEach( (el) => {    
        if(el.value == result.type) {
            el.checked = true
        }
    })
    }
})

chrome.browserAction.onClicked.addListener(function() {
    // The event page will unload after handling this event (assuming nothing
    // else is keeping it awake). The content script will become the main way to
    // interact with us.
    chrome.tabs.create({url: "http://google.com"}, function(tab) {
        alert("test")           
    });
  });
  

