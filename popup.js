let type

// chrome.storage.sync.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// })

document.querySelector('form#check').addEventListener('change'  , ()=> {
    type = document.querySelector('input[name="type"]:checked').value
    console.log(type)

    chrome.storage.sync.set( {'type' : type }, () => {
        console.log('set to type :' , type)
    })

    chrome.tabs.query({}, tabs => {
        tabs.forEach( tab => {
            chrome.tabs.sendMessage(tab.id, type);
      })
    })
})

chrome.storage.sync.get('type' , (result) =>{
    console.log(result.type)
    if(result.type == undefined || result.type == null ){
        type = document.querySelector(".basic").value
        document.querySelector(".basic").checked = true
        document.querySelector('form#check').value = type

        chrome.storage.sync.set( {'type' : type}, () => {
            console.log('set to type :' , type)
        })    
    }else{
        
        document.querySelector('form#check').value = result.type
        let list = document.querySelectorAll('input[name="type"]')
        Array.from(list).forEach( (el) => {    
        if(el.value == result.type) {
            console.log(el.checked)
            el.checked = true
        }
    })
    }
})

// console.log(document.querySelector('input[name="type"]:checked'))
// console.log(document.querySelector('input[name="type"]:checked').value)

