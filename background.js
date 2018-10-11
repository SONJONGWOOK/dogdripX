'use strict';

let lastViewNo
let notiLink = []
let myNotificationID

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
            console.log(this)
          
            // let t = new DOMParser().parseFromString(this.response.body.innerHTML , "text/xml")
            // console.log(t)
            // console.log(this.response.documentElement.innerHTML)

            // console.log(this.response.documentElement.innerHTML)
            // let doc =  new DOMParser().parseFromString(this.response.documentElement.innerHTML , "text/xml")
            // console.log(doc)
            
            // console.log(this.response.body.innerHTML)
            // var oSerializer = new XMLSerializer();
            // var sXML = oSerializer.serializeToString(this.response.body);
            // console.log(sXML)

            // var div =  document.createElement("div");
            // div.innerHTML = sXML;

            // console.log(div)
            // console.log(this.response.body)
            parserElement(this.response)
            // let t = new DOMParser().parseFromString(this.response.body.innerHTML , "text/xml")
            // console.log(t)
            // parserBoard(this.response.documentElement.innerHTML)
        
        
      }
    };
    xhttp.open("GET", "https://www.dogdrip.net/dogdrip");
    // xhr.open("GET", "https://www.dogdrip.net/dogdrip", true);
    xhttp.responseType = "document";
    xhttp.send();

}



const parserElement = (response) =>{
    let body = response.body
    let list = body.querySelector('tbody').querySelectorAll('tr')
     processStorage(callBack , list)
    console.log(notiLink)

}

const processStorage = (callback , list) =>{
    let lastDrip 

    chrome.storage.sync.get( (items) => {
        lastDrip = callback(items['lastDrip'])

        for(let key of list){
        
            let listNo = (key.querySelector('.no').innerHTML).trim()
    
            console.log(lastDrip , parseInt(listNo) )
            console.log(parseInt(lastDrip) > parseInt(listNo) )
            if( parseInt(lastDrip) == parseInt(listNo) ) {
                return
            }
            
            let link = {
                title : key.querySelector('span.title-link').innerHTML ,
                link : key.querySelector('a').href
            }
    
            notiLink.push(link)
        }
        console.log(lastDrip)
    })
}

const callBack = (items) =>{
    return items
}



const chrome_notification_create = () => {
       
    var options = {
            type : "basic",
            title : "User Update",
            message: "Dear User XYZ U have recieved an update",
            iconUrl: "outsourcing.png"
    }
    
    chrome.notifications.create(
            'id1',
            {
                type:'basic',
                iconUrl:chrome.runtime.getURL("doge48.png"),
                title : "dogdrip",
                message: "test notification",
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
    console.log("Connected .....")
    port.onMessage.addListener( (msg) => {
         console.log("message recieved" + msg)
         chrome_notification_create()
        //  port.postMessage("Hi Popup.js");
  
  
    });
})


loadDoc()