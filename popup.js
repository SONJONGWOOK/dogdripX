let type
let timer
let check 
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
document.querySelector('#noti').addEventListener('change' , () =>{  
    
    
    if(document.querySelector('#noti').checked){
        check = true
    }else{
        check = false
    }

    chrome.storage.sync.set( {'interval' : check }, () => {
        // console.log('set to ' , check)
    })
    chrome.storage.sync.set( {'intervalTime' : timer }, () => {
        // console.log('set to ' , timer)
    })

    let set = { interval : check , timer : timer}
    let port = chrome.extension.connect({
        // name: "Sample Communication"
    })
    // console.log(set)
    port.postMessage(set)
    
    port.onMessage.addListener(function(msg) {
        // console.log("message recieved" + msg);
    })
    
})
document.querySelector('#timer').addEventListener('change' , ()=>{
    timer = document.querySelector('#timer').value
    // console.log(timer)
})
document.querySelector('#timer').addEventListener('keypress' , ()=>{
    timer = document.querySelector('#timer').value
    // console.log(timer)
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

chrome.storage.sync.get('intervalTime' , (result) =>{
    timer = result.intervalTime
    // console.log(timer)
    document.querySelector('#timer').value  = timer
    
})  

chrome.storage.sync.get('interval' , (result) =>{ 
    // console.log(result.interval)
    if(result.interval){
        document.querySelector('#noti').click()
    }
})

