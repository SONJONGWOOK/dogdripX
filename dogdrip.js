let type
const comment = (el) =>{

    if(type == 'poly') {
        el.parentNode.innerHTML = '<div>차단</div>'
    }else{
        el.parentNode.style.display="none"
    }
}
const board = (el) =>{
    console.log(type)
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
        console.log('set to data :' , val)
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

                console.log(event)
                let list = document.querySelectorAll('tbody .author')

                Array.from(list).forEach( (el) => {
                    let auth = el.querySelector('a').className
                    auth = auth.substring(auth.search("member_"))
                    auth = auth.substring(auth.search("_")+1)
                    if(auth == member) {
                        board(el)
                        // el.parentNode.innerHTML = '<td colspan="5" style="text-align:center;">차단</td>'
                    }                    
                })
                
                list = document.querySelectorAll('div .comment-content')
                Array.from(list).forEach( (el) => {
                    let auth = el.querySelector('a').className
                    auth = auth.substring(auth.search("member_"))
                    auth = auth.substring(auth.search("_")+1)
                    if(auth == member) {
                        // el.parentNode.innerHTML = '<div style="text-align:center;">차단</div>'
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
            // el.parentNode.innerHTML = '<td colspan="5" style="text-align:center;">차단</td>'
        }
    })
}

const commentHideDom = (blockList) =>{
    let list = document.querySelectorAll('div .comment-content')
    Array.from(list).forEach( (el) => {
        let auth = substrAuth(el)

        if(blockList.block.includes(auth) ) {
            comment(el)
            // el.parentNode.innerHTML = '<div style="text-align:center;">차단</div>'
        }
    })
}




chrome.storage.sync.get('type' , (result) =>{
   type = result.type
   console.log("change type ",type)
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
    console.log("sync type " ,msgObj)
   type = msgObj
})

// chrome.storage.sync.clear(function() {
//     var error = chrome.runtime.lastError;
//     if (error) {
//         console.error(error);
//     }
// })