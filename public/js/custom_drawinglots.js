
let list = [false,true,false]
list.sort(()=>Math.random()-0.5)
console.log(list)

$('.contents_item').each(function(){
    let item_bool = true

    $(this).click(function(){
        if(item_bool){
            $(this).css({"background-image":"url(../m_evt_img/drawinglots_blank_item.png)"});
            if(list[0]){
                $(".custom_drawinglots_window").css({
                    'background-image':'url(../m_evt_img/drawinglot_true.png)',
                    'background-repeat':'no-repeat',
                    'background-size':'contain',
                    'background-position':'center',
                    'background-attachment':'initial'
                })
                modal(list[0])
            }else{
                $(".custom_drawinglots_window").css({
                    'background-image':'url(../m_evt_img/drawinglot_false.png)',
                    'background-repeat':'no-repeat',
                    'background-size':'contain',
                    'background-position':'center',
                    'background-attachment':'initial'
                })
                modal(list[0])
                list.shift()
            }
            item_bool = false
        }else{
            alert('이미 선택된 아이템 입니다!')
        }
       
        
   
    })
})



/// 모달 창
function modal(b){
    const zIndex = 99;
    const modal = document.getElementById("custom_drawinglots_modal");

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

    // if(b){
    //     bg.innerHTML='<div id="close_btn"></div>'
    // }
    document.body.append(bg);

    modal.setStyle({
        position: 'fixed',
        display: 'block',
        // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',

        // 시꺼먼 레이어 보다 한칸 위에 보이기
        zIndex: zIndex + 1,

        // div center 정렬
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        msTransform: 'translate(-50%, -50%)',
        webkitTransform: 'translate(-50%, -50%)'
    });

    if(b){
        // const close_b = document.getElementById('close_btn');
        const form = document.getElementById("custom_drawinglots_submit");
        // close_b.addEventListener("click",()=>{          
            // form.setAttribute("method","post")
            // form.setAttribute("action","/custom_submit_return")
            // form.submit()           
        // })
        // $('#custom_drawinglots_modal').off("click")

        $('#custom_drawinglots_modal').click(function(){
            bg.remove();
            modal.style.display = 'none';
            form.setAttribute("method","post")
            form.setAttribute("action","/custom_submit_return")
            form.submit()  
        })
        bg.addEventListener("click",function(){
            bg.remove();
            modal.style.display = 'none';
            form.setAttribute("method","post")
            form.setAttribute("action","/custom_submit_return")
            form.submit()  
        })
    }else{
        $('#custom_drawinglots_modal').click(function(){bg.remove();modal.style.display = 'none';})
        bg.addEventListener("click",function(){
            bg.remove();
            modal.style.display = 'none';
        })
    }
}
  
Element.prototype.setStyle = function(styles){
    for(var k in styles) this.style[k] = styles[k];
    return this;
}