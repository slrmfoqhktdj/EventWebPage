const submit_btn = document.getElementById("survey_do_submit_btn_id");
const submit_form = document.getElementById("survey_respond_form");
const input_text1 = document.getElementById("input_draw1");
const input_value = document.getElementById("custom_survey_value")
const bb = document.getElementById("bb");

submit_btn.addEventListener("click",()=>{
    //화질 0~1
    const canvas1 = document.getElementById('survey_canvas01')


    var dataURL1 = canvas1.toDataURL('image/png',0.5);


    submit_form.setAttribute("method","post");
    submit_form.setAttribute("action","/custom_submit");
    input_text1.setAttribute("value",dataURL1)


    if(return_custom_item_boolen()){
        document.getElementById('layerPopup').style.display='block';
        submit_form.submit()
    }else{
        alert("빈칸을 채워주세요!")
    }
    

})


function return_custom_item_boolen(){
    var arr = new Array();
    var data = new Object();

    var result = true;

    const r_v1 = $('input[name="radio1"]:checked').val()
    const r_v2 = $('input[name="radio2"]:checked').val()
    const r_v3 = $('input[name="radio3"]:checked').val()
    const r_v4 = $('input[name="radio4"]:checked').val()
    const r_v5 = $('input[name="radio5"]:checked').val()
    const r_v6 = $('input[name="radio6"]:checked').val()
    const r_v7 = $('input[name="radio7"]:checked').val()

    let chk_val1 = "";
    $('input:checkbox[name="checkbox1"]:checked').each(function(){
        chk_val1 += $(this).val()+"/"
    })


    data.R1 = r_v1;
    data.R2 = r_v2;
    data.R3 = r_v3;
    data.R4 = r_v4;
    data.R5 = r_v5;
    data.R6 = r_v6;
    data.R7 = r_v7;
    data.C1 = chk_val1;
    arr.push(data);

    if(r_v1&&r_v2&&r_v3&&r_v4&&r_v5&&r_v6&&r_v7&&chk_val1.length!=0){
        input_value.setAttribute("value",JSON.stringify(arr))
    }else{
        result = false;
    }


    return result
}




$('.survey_canvas').each(function(){
    
    const canvas = document.getElementById($(this).attr('id'));


    let drawing = false;
    let drawing_mode = true; 
       

    //창이 띄워진후 캔버스의 크기를 화면비율에 맞게 맞춰 적용해줌
    const { width, height } = canvas.getBoundingClientRect();
   
    canvas.style.width = width;
    canvas.style.height = height;

    // 메모리에 실제 크기 설정 (픽셀 밀도를 고려하여 크기 조정)
    const dpr = window.devicePixelRatio;

    canvas.width =  width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = 1;
    ctx.lineCap = "round"
    ctx.strokeStyle = "black";


    // CSS에서 설정한 크기와 맞춰주기 위한 scale 조정
    ctx.scale(dpr, dpr);






    if(!canvas.getContext){
        alert("캔버스 지원 안함")
    }

    canvas.addEventListener("mousedown",()=>{drawing = true;},false);
    canvas.addEventListener("mouseup",()=>(drawing = false),false);
    canvas.addEventListener("mouseleave",()=>(drawing = false),false);
    // canvas.addEventListener("mousemove",onMouseMove,false);





    // canvas.addEventListener("touchstart",()=>{drawing = true; ctx.beginPath()},false);
    // canvas.addEventListener("touchend",()=>(drawing = false),false);
    // canvas.addEventListener("touchmove",onTouchMove,false);



    function onTouchMove(e){
        e.preventDefault();
        const x = e.touches[0].clientX - e.target.offsetLeft;
        const y = e.touches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
        // const x = e.touches[0].pageX * 2;
        // const y = e.touches[0].pageY * 2;
        if(!drawing_mode){
            if(drawing){
                ctx.clearRect(x-ctx.lineWidth/2, y-ctx.lineWidth/2, 40,40);
                
            }
        }else{
            
            if(!drawing){
                ctx.beginPath();
                ctx.moveTo(x,y);
            }else{
                ctx.lineTo(x,y);
                ctx.stroke();
            }
        }
    }




    // bb.addEventListener("pointerdown",function(e){
    //     if(!$(e.target).hasClass("survey_canvas")) {
    //         console.log("ee")
    //         $('body').css({"overflow":"auto","height":"auto"})
    //     }
    
    // },false);

    canvas.addEventListener("pointerdown",function(e){
        //터치 영역이 캔버스일때 페이지 스크롤링을 막음
        if(e.target == canvas){
            e.preventDefault()

            //터치 포인터 탑에 따른 이벤트
            switch(e.pointerType){
                case 'pen':
                    drawing = true;
                    ctx.beginPath()
                    $('body').css({"overflow":"hidden","height":"100%"})
                    break;
                // case 'touch':
                //     drawing = true; 
                //     ctx.beginPath()
                //     $('body').css({"overflow":"hidden","height":"100%"})
                //     console.log("touch pointerdown");
                //     break;
    
            }
        }
        

    },false);

    canvas.addEventListener("pointerup",function(e){
        if(e.target == canvas){
            e.preventDefault()
            switch(e.pointerType){
                case 'pen':
                    drawing = false;
                    console.log("pen pointerup");
                break;
                // case 'touch':
                //     drawing = false; 
                //     console.log("touch pointerup");
                //     break;
            }
        }
        
    },false);

    canvas.addEventListener("pointerleave",function(e){
        if(e.target == canvas){
            e.preventDefault()
            switch(e.pointerType){
                case 'pen':
                    drawing = false;
                    $('body').css({"overflow":"auto","height":"auto"})
                    console.log("pen pointerleave");
                break;
                // case 'touch':
                //     drawing = false; 
                //     $('body').css({"overflow":"auto","height":"auto"})
                //     console.log("touch pointerleave");
                //     break;
            }
        }
        
    },false);

    canvas.addEventListener("pointermove",function(e){
        e.preventDefault();
        switch(e.pointerType){
            case 'pen':
                onMouseMove(e);
                console.log("pen pointermove");
            break;
            // case 'touch':
            //     onTouchMove(e);
            //     console.log("touch pointermove");
            //     break;
        }
    },false);



    function onMouseMove(e){
        e.preventDefault();
        const x = e.offsetX;
        const y = e.offsetY;
        
        if(!drawing_mode){
            if(drawing){
                //지우개
                ctx.clearRect(x-ctx.lineWidth/2, y-ctx.lineWidth/2, 40,40);
                
            }
        }else{
            
            if(!drawing){
                ctx.beginPath();
                ctx.moveTo(x,y);
            }else{
                ctx.lineTo(x,y);
                ctx.stroke();
            }
        }
        return false
    }






























    $(this).parent().next().find('.survey_canvas_option_all_cleaner').click(function(){
        ctx.clearRect(0, 0, canvas.width,canvas.height);
    })

    $(this).parent().next().find('.survey_canvas_option_dot_cleaner').click(function(){
        if(drawing_mode){
            $(this).find('b').text("펜")
            drawing_mode = false
        }else{
            $(this).find('b').text("지우개")
            drawing_mode = true
        }
    })
    
});

