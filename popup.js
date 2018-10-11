let type

document.querySelector('#reset').addEventListener('click' , () =>{
    chrome.storage.sync.clear(()=> {
        var error = chrome.runtime.lastError;

        if (error) {
            console.error(error);
        }
    })
})

document.querySelector('#gotoURL').addEventListener('click' , () =>{
    chrome.tabs.create({url: "https://dogdrip.net"}, (tab) => {
    })
})

document.querySelector('#extensionPage').addEventListener('click' , () =>{
    chrome.tabs.create({url: "./extensionPage.html"}, (tab) => {
    })
})
document.querySelector('#noti').addEventListener('click' , () =>{
    let port = chrome.extension.connect({
        // name: "Sample Communication"
    })
    port.postMessage("Hi BackGround")
    
    // port.onMessage.addListener(function(msg) {
    //     console.log("message recieved" + msg);
    // })
    
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


