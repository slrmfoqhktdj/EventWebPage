const submit_btn = document.getElementById("survey_amend_submit_btn_id");
const submit_form = document.getElementById("survey_amend_submit_form_id");
const survey_amend_plus_q_btn = document.getElementById("survey_amend_plus_q_btn_id");
const survey_contents_box = document.getElementById("survey_contents_box_id");

var drl_count = parseInt($("#survey_drawinglots_item_count").val())+1

create_drawinglots_contents()

submit_btn.addEventListener("click",()=>{

    if(return_a_allow()&&return_q_allow()&&return_t_allow()){

        var t_id = $('#survey_drawinglots_title_id').val()
        var s_x_id = $('#survey_drawinglots_size_x_id').val().replace(/ /gi,'')
        var s_y_id = $('#survey_drawinglots_size_y_id').val().replace(/ /gi,'')
        var r_id = $('#survey_drawinglots_raincheck_id').val()

        if($('input[name="drawinglots_selector"]:checked').val()=="y"){
            if(return_drawinglots_item_boolen()&&t_id!=null&&t_id!=""&&s_x_id!=null&&s_x_id!=""&&s_y_id!=null&&s_y_id!=""&&r_id!=null&&r_id!=""){
                if($('.survey_drawinglots_item_pro').length){
                    modal("amend_modal");
                }else{
                    i_blank_alert()
                }
            }else{
                d_blank_alert()
            }
        }else{
            modal("amend_modal");
        }
    }else{
        blank_alert()
    }

})

//공백 발견시 경고창
function blank_alert(){
    alert("공백을 채워주세요")
}

//공백 발견시 경고창
function d_blank_alert(){
    alert("투표공백을 채워주세요")
}

//공백 발견시 경고창
function i_blank_alert(){
    alert("투표 경품을 채워주세요")
}

//input number키 이벤트
$('input[type="number"]').change(function(){
    if($(this).val()<1){
        $(this).val(1)
    }
});

//input number키 이벤트
$('.survey_drawinglots_item_cnt').change(function(){
    var xy = parseInt($('#survey_drawinglots_size_x_id').val())*parseInt($('#survey_drawinglots_size_y_id').val())
    if($(this).val()>xy){
        $(this).val(xy)
    }
})

//input number키 이벤트
$('input[name="survey_drawinglots_size"]').change(function(){
    if($(this).val()>70){
        $(this).val(70)
    }

    $('.survey_drawinglots_item_cnt').each(function(){
        var xy = parseInt($('#survey_drawinglots_size_x_id').val())*parseInt($('#survey_drawinglots_size_y_id').val())
        if($(this).val()>xy){
            $(this).val(xy)
        }
    })
})

//뽑기 아이템 반환값 공백 찾기

function return_drawinglots_item_boolen(){
    var result = true;

    $('.survey_drawinglots_item').each(function(){   
        var pro = $(this).children(".survey_drawinglots_item_pro").val()
        var cnt = $(this).children(".survey_drawinglots_item_cnt").val()

        if(!(pro!="" && cnt !="")){
            result = false;
            return false
        }
    });

    return result
}


//답문 공백찾기
function return_a_allow(){
    var result = true;

    $('.survey_contents_A').each(function(){   
        if($(this).val().trim()==null||$(this).val().trim()=="undefined"||$(this).val().trim()==""){
            result = false;
            return false;
        }
    });

    return result
}

//답문 공백찾기
function return_q_allow(){
    var result = true;

    $('.survey_contents_Q').each(function(){   
        if($(this).val().trim()==null||$(this).val().trim()=="undefined"||$(this).val().trim()==""){
            result = false;
            return false;
        }
    });

    return result
}

//답문 공백찾기
function return_t_allow(){
    var result = true;

    if($('#survey_title').val().trim()==null||$('#survey_title').val().trim()=="undefined"||$('#survey_title').val().trim()==""){
        result = false;
    }

    return result
}



//go에 질문값반환값만들기
function return_question_value(){
   
    var result = new Array();
    var count_q = 0;

    $('.survey_contents_Q').each(function(){
        var data = new Object();
        var id = $(this).attr('name')

        data.id = parseInt(id);
        data.id_t =  parseInt($('#survey_m_id').val())
        data.order = count_q;
        data.ctt = $(this).val();
        data.type = $(this).parent().next().children(".survey_question_select_box").children("input[name='"+id+"']:checked").val();

        result.push(data);

        count_q++;
    })
  
    
    return JSON.stringify(result)
} 

//go에 응답값반환값만들기
function return_resp_value(){

    var result = new Array();
    var count_a = 0;

    $('.survey_contents_A').each(function(){   
        var id_ =$(this).attr('name');
        
        var data = new Object();

        data.id_q =  parseInt(id_);
        data.order = count_a;
        data.ctt = $(this).val();

        result.push(data);

        count_a++;
    })
    
    return JSON.stringify(result)
} 



var q_count =  parseInt(survey_amend_plus_q_btn.value)+1;



survey_amend_plus_q_btn.addEventListener("click",()=>{
    create_survey_plus_list_box()
})



//survey_plus_list_box 만들기
function create_survey_plus_list_box() {
    var q_id = Date.now();

    var temp = document.createElement('div');
    temp.setAttribute('class','survey_list_item_box');
    temp.setAttribute('id','survey_list_item'+q_count+'_box');

    var c_list ='<div class="survey_list_item_contents_box" id="survey_list_item'+q_count+'_contents_box"><div class="survey_question_box" id="survey_question'+q_count+'_box"><input type = "text" class ="survey_contents_Q" name="'+q_id+'" ></div><div class="survey_answer_box" id="survey_answer'+q_count+'_box">   <div class="survey_question_select_box" id="survey_question'+q_count+'_select_box"><input type="radio" id ="question'+q_count+'_answertype_r" name="'+q_id+'" value="r" onclick="create_answer_type('+q_id+','+q_count+',this.value,this)"><label for ="question'+q_count+'_answertype_r">라디오</label> <input type="radio" id="question'+q_count+'_answertype_t" name="'+q_id+'" value="t" onclick="create_answer_type('+q_id+','+q_count+',this.value,this)"><label for ="question'+q_count+'_answertype_t">텍스트</label> <input type="radio" id="question'+q_count+'_answertype_c" name="'+q_id+'" value="c" onclick="create_answer_type('+q_id+','+q_count+',this.value,this)"><label for ="question'+q_count+'_answertype_c">체크박스</label></div><div class="survey_answer_contents_box" id="survey_answer'+q_count+'_contents_box"></div></div></div>    <button type="button" onclick="remove_question(this.value)" class="remove_list_item_box_btn" value="'+q_count+'">X</button>' 
    temp.innerHTML = c_list;
    survey_contents_box.appendChild(temp)
    q_count++;
}


//질문 지우기
function remove_question(count){
    console.log("remove"+count)

    var id = document.getElementById('survey_list_item'+count+'_box')
    survey_contents_box.removeChild(id);
}

// console.log($(div).prev().children().last().children('button').val())
//답변 추가하기
function create_answer_item(count,div,me){
    var a_id = Date.now();
    var q_count = parseInt(div);
    var a_count = parseInt(count);

    var q_id = $('#survey_question'+q_count+'_box').children('input').attr('name')

    var v = $('input[name="'+q_id+'"]:checked').val().trim()


    var temp = document.getElementById('survey_answer'+q_count+'_box');
    var ttemp = document.createElement('div');
    ttemp.setAttribute('class','survey_answer_contents_box');
    ttemp.setAttribute('id','survey_answer'+q_count+'_contents_box'+a_count);

    var answer_item = '';
    switch (v){
        case "r":
            answer_item = '<input type = "text" class ="survey_contents_A" name="'+q_id+'" id="'+a_id+'"><button type="button" id="question'+q_count+'_answer'+a_count+'" value="'+a_count+'" onclick="remove_answer_item('+q_count+','+a_count+')">x</button>';
        break;
        case "c":
            answer_item = '<input type = "text" class ="survey_contents_A" name="'+q_id+'" id="'+a_id+'"><button type="button" id="question'+q_count+'_answer'+a_count+'" value="'+a_count+'" onclick="remove_answer_item('+q_count+','+a_count+')">x</button>';
        break;
    } 

    ttemp.innerHTML = answer_item;
    temp.appendChild(ttemp);

    $(me).val(a_count+1);

}

//답변 삭제하기
function remove_answer_item(count,value){
    console.log(value+" "+count)
    var item = document.getElementById('survey_answer'+count+'_contents_box'+value);
    item.parentNode.removeChild(item);
}


//답변 타입정하기
function create_answer_type(q_id,count,type,div){
    var q_count = parseInt(count);
    var a_id = Date.now();

    var temp = document.getElementById("survey_answer"+q_count+"_box")
    
    
    var box = $(div).parents("#survey_list_item"+q_count+"_contents_box")
    var box1 = document.getElementById("survey_list_item"+q_count+"_contents_box")

    var ttemp = document.createElement('div');
    ttemp.setAttribute('class','survey_answer_contents_box');
    ttemp.setAttribute('id','survey_answer'+q_count+'_contents_box0');


     $(div).parent().nextAll().remove();

    // var answer_item_plus = '<button type="button" onclick="create_answer_item(this.value,'+q_count+',this)" class="pluse_list_item_btn" value="1"></button>'

    if(box.children("button").length>0){
        console.log("true")
    }else{
        console.log("false")
        var b = document.createElement('button');
        b.setAttribute('type','button')
        b.setAttribute('onclick','create_answer_item(this.value,'+q_count+',this)')
        b.setAttribute('class','pluse_list_item_btn')
        b.setAttribute('value','1')
        b.innerHTML = '답변추가하기';
        box1.appendChild(b);
    }

    var answer_item = '';
    switch (type){
        case "r":
            answer_item = '<input type = "text" class ="survey_contents_A" name="'+q_id+'" id="'+a_id+'"><button type="button" id="question'+q_count+'_answer0" value="0" onclick="remove_answer_item('+q_count+',0)">x</button>';
        break;
        case "t":
            answer_item = '<input type = "hidden" class ="survey_contents_A" name="'+q_id+'" id="'+a_id+'" value="T">'
            box.children("button").remove();
        break;
        case "c":
            answer_item = '<input type = "text" class ="survey_contents_A" name="'+q_id+'" id="'+a_id+'"><button type="button" id="question'+q_count+'_answer0" value="0" onclick="remove_answer_item('+q_count+',0)">x</button>';
        break;
    }
    

    
    ttemp.innerHTML = answer_item;
    temp.appendChild(ttemp);
    
    
}

//추첨 설정창 추가하기
function create_drawinglots_contents(){

    var type = document.querySelector('input[name="drawinglots_selector"]:checked').value;
    const box = document.getElementById('survey_drawinglots_contents_box_id');
    switch (type){
        case "y":
            box.setStyle({
                display: 'block'  
            })
        break;
        case "n":
            box.style.display= 'none';
        break;
    } 

}

//추첨 항목 추가하기
function create_drawinglots_item(){
    var temp = document.getElementById('survey_drawinglots_item_list_box_id');
    var ttemp = document.createElement('div');
    ttemp.setAttribute('class','survey_drawinglots_item');
    ttemp.setAttribute('id','survey_drawinglots_item'+drl_count);

    var answer_item = '<input type="text"  id="survey_drawinglots_item_pro'+drl_count+'" class="survey_drawinglots_item_pro"> <input type="number"  id="survey_drawinglots_item_cnt'+drl_count+'" class="survey_drawinglots_item_cnt" min="1" value="1" > <button type="button" id="survey_drawinglots_item_del_btn'+drl_count+'" class="survey_drawinglots_item_del_btn" onclick="remove_drawinglots_item('+drl_count+')">X</button>';

    ttemp.innerHTML = answer_item;
    temp.appendChild(ttemp);

    drl_count++;
}

//추첨 항목 삭제하기
function remove_drawinglots_item(count){
    var item = document.getElementById('survey_drawinglots_item'+count);
    item.parentNode.removeChild(item);
}

//go에 뽑기아이템 반환값만들기
function return_drawinglots_item_value(){
   
    var result = new Array();

    $('.survey_drawinglots_item').each(function(){   
        var pro = $(this).children(".survey_drawinglots_item_pro").val()
        var cnt = $(this).children(".survey_drawinglots_item_cnt").val()

        var data = new Object();
        data.pro = pro;
        data.cnt = cnt;
        result.push(data);
    });

    
    return JSON.stringify(result)
} 


/// 모달 창
function modal(id){
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

    bg.addEventListener("click",function(){
        bg.remove();
        modal.style.display = 'none';
    })

    ok_btn.addEventListener("click",()=>{
        document.getElementById("s_r_v_id").setAttribute('value',return_resp_value());
        document.getElementById("s_q_v_id").setAttribute('value',return_question_value());
        submit_form.setAttribute("method","post")
        submit_form.setAttribute("action","/survey_amend")



        if($('input[name="drawinglots_selector"]:checked').val()=="y"){
            var t_id = $('#survey_drawinglots_title_id').val()
            var s_x_id = $('#survey_drawinglots_size_x_id').val().replace(/ /gi,'')
            var s_y_id = $('#survey_drawinglots_size_y_id').val().replace(/ /gi,'')
            var r_id = $('#survey_drawinglots_raincheck_id').val()
            document.getElementById("s_d_t_id").setAttribute('value',t_id);
            document.getElementById("s_d_s_x_id").setAttribute('value',s_x_id);
            document.getElementById("s_d_s_y_id").setAttribute('value',s_y_id);
            document.getElementById("s_d_v_id").setAttribute('value',return_drawinglots_item_value());
            document.getElementById("s_d_r_id").setAttribute('value',r_id);
        }
        
        return submit_form.submit()
    })
    
    no_btn.addEventListener("click",()=>{
        bg.remove();
        modal.style.display = 'none';
    })

    document.body.append(bg);

    // 닫기 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    modal.querySelector('.amend_modal_close_btn').addEventListener('click', function() {
        bg.remove();
        modal.style.display = 'none';
    });

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
