let url = document.location.href 

if(url == 'https://www.dogdrip.net/') {
    console.log("DDDDDDDDDDDDD             OOOOOOOOO             GGGGGGGGGGGGGDDDDDDDDDDDDD      RRRRRRRRRRRRRRRRR   IIIIIIIIIIPPPPPPPPPPPPPPPPP   \r\n"
    +"D::::::::::::DDD        OO:::::::::OO        GGG::::::::::::GD::::::::::::DDD   R::::::::::::::::R  I::::::::IP::::::::::::::::P  \r\n"
    +"D:::::::::::::::DD    OO:::::::::::::OO    GG:::::::::::::::GD:::::::::::::::DD R::::::RRRRRR:::::R I::::::::IP::::::PPPPPP:::::P \r\n"
    +"DDD:::::DDDDD:::::D  O:::::::OOO:::::::O  G:::::GGGGGGGG::::GDDD:::::DDDDD:::::DRR:::::R     R:::::RII::::::IIPP:::::P     P:::::P\r\n"
    +"  D:::::D    D:::::D O::::::O   O::::::O G:::::G       GGGGGG  D:::::D    D:::::D R::::R     R:::::R  I::::I    P::::P     P:::::P\r\n"
    +"  D:::::D     D:::::DO:::::O     O:::::OG:::::G                D:::::D     D:::::DR::::R     R:::::R  I::::I    P::::P     P:::::P\r\n"
    +"  D:::::D     D:::::DO:::::O     O:::::OG:::::G                D:::::D     D:::::DR::::RRRRRR:::::R   I::::I    P::::PPPPPP:::::P \r\n"
    +"  D:::::D     D:::::DO:::::O     O:::::OG:::::G    GGGGGGGGGG  D:::::D     D:::::DR:::::::::::::RR    I::::I    P:::::::::::::PP  \r\n"
    +"  D:::::D     D:::::DO:::::O     O:::::OG:::::G    G::::::::G  D:::::D     D:::::DR::::RRRRRR:::::R   I::::I    P::::PPPPPPPPP    \r\n"
    +"  D:::::D     D:::::DO:::::O     O:::::OG:::::G    GGGGG::::G  D:::::D     D:::::DR::::R     R:::::R  I::::I    P::::P            \r\n"
    +"  D:::::D     D:::::DO:::::O     O:::::OG:::::G        G::::G  D:::::D     D:::::DR::::R     R:::::R  I::::I    P::::P            \r\n"
    +"  D:::::D    D:::::D O::::::O   O::::::O G:::::G       G::::G  D:::::D    D:::::D R::::R     R:::::R  I::::I    P::::P            \r\n"
    +"DDD:::::DDDDD:::::D  O:::::::OOO:::::::O  G:::::GGGGGGGG::::GDDD:::::DDDDD:::::DRR:::::R     R:::::RII::::::IIPP::::::PP          \r\n"
    +"D:::::::::::::::DD    OO:::::::::::::OO    GG:::::::::::::::GD:::::::::::::::DD R::::::R     R:::::RI::::::::IP::::::::P          \r\n"
    +"D::::::::::::DDD        OO:::::::::OO        GGG::::::GGG:::GD::::::::::::DDD   R::::::R     R:::::RI::::::::IP::::::::P          \r\n"
    +"DDDDDDDDDDDDD             OOOOOOOOO             GGGGGG   GGGGDDDDDDDDDDDDD      RRRRRRRR     RRRRRRRIIIIIIIIIIPPPPPPPPPP + extension")
}

//읽은 글 번호 확인할때 
if(url.match(/www.dogdrip.net\/[0-9]+/gi) != null ){
   let isDogdrip =  document.querySelector('a.title-underline').innerHTML == '개드립' ? true : false
   let element = document.querySelector('td.ed.no svg').parentNode.parentNode.nextSibling
//    console.log(element.tagName)
   let lastView 
   if(element.tagName == undefined){
    element = document.querySelector('td.ed.no svg').parentNode.parentNode.previousSibling
    lastView = true
   }
   if(isDogdrip && element.tagName == 'TR') {
    let lastDrip = (element.querySelector('.no').innerHTML).trim()      
    chrome.storage.sync.get( ['lastDrip'] , (result) =>{
        
        if(lastView){
            lastDrip = parseInt(lastDrip)-2
        }
        // console.log(result , lastDrip , parseInt(result.lastDrip) < parseInt(lastDrip) )
         if(parseInt(result.lastDrip) < parseInt(lastDrip) || result == undefined || result == null || result.length == 0 ) {
            chrome.storage.sync.set( {'lastDrip' : lastDrip }, () => {
                // console.log('set to drip :' , lastDrip)

           })
        }
    })

   }
   
}

let type
const comment = (el) =>{

    if(type == 'poly') {
        el.parentNode.innerHTML = '<div style="text-align:center;" >차단</div>'
    }else if(type == 'hide') {
        el.parentNode.style.display="none"
    }else{
        blockView(el)
    }
}
const board = (el) =>{
    
    if(type == 'poly') {
        el.parentNode.innerHTML = '<td colspan="5" style="text-align:center;">차단</td>'
    }else if(type == 'hide') {
        el.parentNode.style.display="none"
    }else{
        blockView(el)
    }
}

const blockView  = (el)  =>{
    let list = el.parentNode.children
    for (let item of list) {
        item.style.display="none"
    }
    let blockView = document.createElement( 'td' );
    blockView.innerHTML =  '<a href="javascript:void(0);"} ">차단 보기</a>' 
    blockView.onclick = () => {
        el.parentNode.removeChild(blockView)
        el.parentNode.style.background = "#D3D3D3"
        for (let item of list) {
            item.style.display=""
        }
    }
    blockView.style.textAlign  = "center"
    blockView.colSpan=5
    el.parentNode.appendChild(blockView)
}

const processStorage = (callback , addMember , memo) =>{
    chrome.storage.sync.get( (items) => {
        
        callback('block', items['block'] , addMember )
        callback('blockMemo', items['blockMemo'] , memo )
    })
}

const callBack = (key, val  , addMember ) =>{

    if(val == null || val == undefined ) {
        val = []
    }

    val.push(addMember)
    if(key == 'block'){
        chrome.storage.sync.set( {'block' : val }, () => {
            // console.log('set to data :' , val)
        })
    }else if(key == 'blockMemo'){
        chrome.storage.sync.set( {'blockMemo' : val }, () => {
            // console.log('set to data :' , val)
        })
    }
}

const check = (e) =>{

    if(e.srcElement.id == 'popup_menu_area'){
        let origin = document.querySelector('div#popup_menu_area ul')
        if(origin != undefined || origin != null ){
            let member = origin.children[0].innerHTML
            
            member = member.substring(member.search("member_srl="))
            member = member.substring(member.search("=")+1 ,member.search("\"") )
            let add = origin.innerHTML + '<li id="block" ><a target="_blank">차단</a></li>'

            origin.innerHTML = add
            
            origin.querySelector('#block').addEventListener('click' , (event) =>{
                
                
                let memo = prompt("메모장켜라 :", "메모");
                if (memo == null || memo == "") {
                    memo = "메모없음"
                }

                processStorage(callBack , member , {member : member , memo : memo })   

                // console.log(event)
                let list = document.querySelectorAll('tbody .author')

                Array.from(list).forEach( (el) => {
                    let auth = el.querySelector('a').className
                    auth = auth.substring(auth.search("member_"))
                    auth = auth.substring(auth.search("_")+1)
                    if(auth == member) {
                        board(el)
                       
                    }                    
                })
                
                list = document.querySelectorAll('div .comment-content')
                Array.from(list).forEach( (el) => {
                    let auth = el.querySelector('a').className
                    auth = auth.substring(auth.search("member_"))
                    auth = auth.substring(auth.search("_")+1)
                    if(auth == member) {
                      
                        comment(el)
                    }                    
                })


            })
        }
    }
}


const substrAuth = (el) => {
    let auth = el.querySelector('a').className
    auth = auth.substring(auth.search("member_"))
    auth = auth.substring(auth.search("_")+1)

    return auth
}
const boardHideDom = (blockList) =>{

    let list = document.querySelectorAll('tbody .author')
    Array.from(list).forEach( (el) => {
        let auth = substrAuth(el)

        if(blockList.block.includes(auth) ) {
            board(el)
        
        }
    })
}

const commentHideDom = (blockList) =>{
    let list = document.querySelectorAll('div .comment-content')
    Array.from(list).forEach( (el) => {
        let auth = substrAuth(el)

        if(blockList.block.includes(auth) ) {
            comment(el)
         
        }
    })
}

chrome.storage.sync.get('type' , (result) =>{
   type = result.type
   if(type == undefined || type == null){
       type = "poly"
    }
    
    chrome.storage.sync.get('block' , (result) =>{
        
        if(result.block != undefined || result.block != null){
            if(document.location.href.includes('dogdrip.net/dogdrip')) {
                boardHideDom(result)
            }else{
                commentHideDom(result)
                boardHideDom(result)
            }
        }  
    })

    document.querySelector('body').addEventListener('DOMSubtreeModified', check )
})
chrome.runtime.onMessage.addListener(msgObj => {
   type = msgObj
})

