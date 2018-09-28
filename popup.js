let type

document.querySelector('#reset').addEventListener('click' , () =>{
    browser.storage.local.clear(function() {
        var error = chrome.runtime.lastError;

        if (error) {
            console.error(error);
        }
    })
})

document.querySelector('#gotoURL').addEventListener('click' , () =>{
    browser.tabs.create({url: "https://dogdrip.net"}, function(tab) {
    })
})

document.querySelector('#extensionPage').addEventListener('click' , () =>{
    browser.tabs.create({url: "./extensionPage.html"}, function(tab) {
    })
})

document.querySelector('form#check').addEventListener('change'  , ()=> {
    type = document.querySelector('input[name="type"]:checked').value
    browser.storage.local.set( {'type' : type }, () => {
        // console.log('set to type :' , type)
    })
    
    //파이어폭스에서 이것에 대한 문제 해결이필요할듯 우선 막아둠
    browser.tabs.query({}, tabs => {
        // tabs.forEach( tab => {
            // browser.tabs.sendMessage(tab.id, type);
    //   })
    })
})

browser.storage.local.get('type' , (result) =>{

    console.log(result)
    if(result == undefined || result == null ){
        type = document.querySelector(".basic").value
        document.querySelector(".basic").checked = true
        document.querySelector('form#check').value = type

        browser.storage.local.set( {'type' : type}, () => {
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
