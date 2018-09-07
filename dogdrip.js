if(document.location.href == 'https://www.dogdrip.net/') {
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
let type
const comment = (el) =>{

    if(type == 'poly') {
        el.parentNode.innerHTML = '<div style="text-align:center;" >차단</div>'
    }else{
        el.parentNode.style.display="none"
    }
}
const board = (el) =>{
    
    if(type == 'poly') {
        el.parentNode.innerHTML = '<td colspan="5" style="text-align:center;">차단</td>'
    }else{
        el.parentNode.style.display="none"
    }
}

const processStorage = (key, callback , addMember) =>{
    chrome.storage.sync.get(key, (items) => {
        callback(key, items[key] , addMember)
    })
}

const callBack = (key , val  , addMember ) =>{

    if(val == null || val == undefined ) {
        val = []
    }

    val.push(addMember)
    chrome.storage.sync.set( {'block' : val }, () => {
        // console.log('set to data :' , val)
    })
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
                processStorage('block' , callBack , member)   

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
    // console.log("sync type " ,msgObj)
   type = msgObj
})
