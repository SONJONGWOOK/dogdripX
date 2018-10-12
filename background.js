'use strict';

let lastViewNo
let notiLink = []
let myNotificationID
let time
let interval = 0
function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        parserElement(this.response)
      }
    }
    xhttp.open("GET", "https://www.dogdrip.net/dogdrip");
    // xhr.open("GET", "https://www.dogdrip.net/dogdrip", true);
    xhttp.responseType = "document";
    xhttp.send()
}

const parserElement = (response) =>{
    let body = response.body
    let list = body.querySelector('tbody').querySelectorAll('tr')
    notiLink = []
    processStorage(callBack , list)
    

}
const processStorage = (callback , list) =>{
    let lastDrip 

    chrome.storage.sync.get( (items) => {
        lastDrip = callback(items['lastDrip'])
        // console.log(parseInt(lastDrip)+1)
        for(let key of list){
            // console.log(key)
            let listNo = (key.querySelector('.no').innerHTML).trim()
            // console.log(parseInt(lastDrip)+1  , parseInt(listNo) )
            if( parseInt(lastDrip)+1 == parseInt(listNo) ) {
                break
            }
            
            let link = {
                title : key.querySelector('span.title-link').innerHTML ,
                link : key.querySelector('a').href
            }
            
            notiLink.push(link)
        }
      
        chrome_notification_create()
    })
}
const callBack = (items) =>{
    return items
}

const chrome_notification_create = () => {
      
    
    if(notiLink.length <= 0) return

    chrome.notifications.create(
            'dogdrip',
            {
                type:'basic',
                iconUrl:chrome.runtime.getURL("doge48.png"),
                title : "dogdrip",
                message: "dogdrip Notification",
                priority:1,
                buttons:[{
                        title: notiLink[0].title
                        },
                        {
                        title:'외 '+(parseInt(notiLink.length)-1)+'개' 
                        }
                ],
                
                isClickable: true
                
            },
            (id) => {
                myNotificationID  = id
                setTimeout( () =>
                {chrome.notifications.clear(id);}, 3000);
                // console.log(chrome.runtime.lastError);
            }
        )
 }
chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === myNotificationID) {
        
        let link 
        if(btnIdx == 0){
            link = notiLink[0].link
        }
        else{
            link = 'https://dogdrip.net/dogdrip'
        }
        chrome.tabs.create({url: link}, (tab) => {
        })
    } 
})

chrome.extension.onConnect.addListener( (port) => {
    // console.log("Connected .....")
    port.onMessage.addListener( (msg) => {
       
        if(msg.interval){
            console.log('interval on')
            console.log(new Date().toLocaleTimeString() )
            console.log(interval)
            
            if(interval  == 0 ) {
                notificationInerval(msg.timer)  
            } 

        }else{
            console.log('interval off')
            clearInterval(interval)
            interval = 0
            // console.log(interval)
        }
        
    });


})

//분단위
const notificationInerval = (setTime) =>{
    console.log(setTime)
    if(setTime == undefined || setTime == null || setTime.trim() == '' ){
        setTime = 10
    }
    console.log('interval timer ' , setTime)
    interval = setInterval( ()=>{
        loadDoc()
        console.log(new Date().toLocaleTimeString() )
    }, parseInt(setTime)*60000) 
}
