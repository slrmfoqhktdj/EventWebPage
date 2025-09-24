

const form = document.getElementById("drawinglots_do_checked_form")
const checked_input = document.getElementById("m_checked_id")
const rain_msg = document.getElementById("m_rain_id").value
var result = new Array();


function num_div_click(div,v,item){
    console.log(v)
    console.log(item)
    $(div).css("background-color","coral")

    var data = new Object();
    data.cnt = v;
    result.push(data);
   

    modal("result_modal",item)

    
    console.log(result)
    
    
}

/// 모달 창
function modal(id,item){
    const zIndex = 99;
    const modal = document.getElementById(id);
    const ok_btn = document.getElementById("ok_btn");
    const no_btn = document.getElementById("no_btn");

    // 모달 div 뒤에 희끄무레한 레이어
    var bg = document.createElement('div');
    bg.setStyle({
        position: 'fixed',
        zIndex: zIndex,
        left: '0px',
        top: '0px',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        // 레이어 색갈은 여기서 바꾸면 됨
        backgroundColor: 'rgba(0,0,0,0.4)'
    });

    if(item == ""){
        $("#result_item_id").text(rain_msg)
    }else{
        $("#result_item_id").text(item)
    }

    ok_btn.addEventListener("click",()=>{
        bg.remove();
        modal.style.display = 'none';
        
    })
    
    no_btn.addEventListener("click",()=>{
        form.setAttribute("method","post")
        form.setAttribute("action","/drawinglots_do_result")
        checked_input.setAttribute("value",JSON.stringify(result))
        return form.submit()
    })

    document.body.append(bg);

    modal.setStyle({
        position: 'fixed',
        display: 'block',
        boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

        // 시꺼먼 레이어 보다 한칸 위에 보이기
        zIndex: zIndex + 1,

        // div center 정렬
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        msTransform: 'translate(-50%, -50%)',
        webkitTransform: 'translate(-50%, -50%)'
    });
}
  
Element.prototype.setStyle = function(styles){
    for(var k in styles) this.style[k] = styles[k];
    return this;
}