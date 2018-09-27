chrome.storage.sync.get( (result) =>{
   console.log(result)   
    if(result.block != undefined || result.block != null){
        if(result.blockMemo ==undefined || result.block == null){
            result.blockMemo = []
        }
        if(result.block.length !== result.blockMemo.length){
            // console.log(result.block)
            // console.log(result.blockMemo)
            concatList(result.block , result.blockMemo)
        }
        drawGrid(result)
 
    }  
})

document.querySelector('#myFile').addEventListener('change' , (e) =>{
    // alert(document.querySelector('#dlLabel'))
    let file = document.getElementById('myFile') 
        
    if(file.value && file.files[0].type !== "application/json"){
        alert("파일형태가 맞지않습니다")
        return
    }
    let text = 'Choose file'
    if (file.value) {
        text = file.files[0].name
    }
    document.querySelector('#dlLabel').innerHTML = text
   
})
 
document.querySelector('#update').addEventListener('click' , (e) =>{
    let file = document.getElementById('myFile') 
    if (!file.value) {
        alert("파일 다시 선택해 주세요")
        return // 파일이 없는 경우 빠져나오기
    }

    let reader  = new FileReader()

    reader.onload = (e) =>{
        // console.log('e readAsText = ', e);
        // console.log('e readAsText target = ', e.target)
        // console.log('e readAsText target result = ', e.target.result)
        let json = JSON.parse(e.target.result)
        chrome.storage.sync.get( (result) =>{
            
            result.blockMemo =  result.blockMemo == undefined ? []  :  result.blockMemo
            result.block =  result.block == undefined ? []  :  result.block
           
            concatMemoList(result.blockMemo , json)
        
            if(result.block.length !== result.blockMemo.length){
                concatList(result.block , result.blockMemo)
            }
            drawGrid(result)
        }) 
    }    
    reader.readAsText(file.files[0]);
})

const drawGrid = (result) =>{

    let el = document.querySelector('#blockList')
    el.innerHTML ="";
    let list = result.blockMemo
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list))
    document.querySelector('#download').href = dataStr

    list.map( (value , index) => {
        let html =  document.createElement( 'tr' )
        let memo = (value.memo == undefined || value.memo == null )  ? '메모없음' : value.memo
        html.innerHTML ="<tr> <th scope='row'>"+(index+1)+"</th> <td>"+value.member+"</td> <td>"+memo+"</td> <td><button type='button' class='btn btn-dark'>REMOVE</button></td> </tr>"    
        el.appendChild(html)
        html.querySelector('button').onclick = () => {
            
            let blockIndex = result.block.indexOf(value.member)
            result.block.splice(blockIndex , 1)
            let memoIndex = list.indexOf(value)
            list.splice(memoIndex , 1)    
            processStorage(callBack, result.block, list)
            html.parentNode.removeChild(html)            
            dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(list))
            document.querySelector('#download').href = dataStr
            console.log(blockIndex , "  "  , memoIndex)
            console.log(result.block)
            console.log(list)
        }

    })
}

const concatMemoList = (oriMemo, addMemo) =>{
    let oriList = []
    let addList = []
    for(let value of oriMemo){
        oriList.push(value.member)
    }
    for(let value of addMemo){
        addList.push(value.member)
    }

    addList.map( (value , index) => {
        if(!oriList.includes(value) ){
            // console.log('수정 : ' , addMemo[index])
            oriMemo.push( { member : value , memo : addMemo[index].memo} )
            
        }
    })
    
}


const concatList = (blockList ,memoList ) =>{

    let oriList = []
    for(let value of memoList){
        oriList.push(value.member)
    }
  
    blockList.map( (value)  => {
        if(!oriList.includes(value) ){
            
            memoList.push( { member : value , memo : '메모없음'} )
        }
    })
    memoList.map( (value) =>{
        if(!blockList.includes(value.member) ){
            
            blockList.push(value.member)
        }  

    })
    
    processStorage(callBack, blockList, memoList)
}


const processStorage = (callback , blockList , memoList) =>{    
        callback('block', blockList )
        callback('blockMemo', memoList )
} 

const callBack = (key, val  ) =>{

    if(val == null || val == undefined ) {
        val = []
    }
    
    if(key == 'block'){
        chrome.storage.sync.set( {'block' : val }, () => {
            console.log('set to data :' , val)
        })
    }else if(key == 'blockMemo'){
        chrome.storage.sync.set( {'blockMemo' : val }, () => {
            console.log('set to memo  :' , val)
            alert("변경완료")
        })
    }
}


