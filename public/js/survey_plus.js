var count = 1;
var count_map = new Map();
var drl_count =1;

const survey_question_plus_btn_id = document.getElementById("survey_question_plus_btn_id");
const survey_plus_submit_btn_id = document.getElementById("survey_plus_submit_btn_id");
const survey_plus_submit_form_id  = document.getElementById("survey_plus_submit_form_id");
const contents_list = document.getElementById("contents_list_id");

//질문 추가 버튼
survey_question_plus_btn_id.addEventListener("click",()=>{
    create_survey_plus_list_box();
});


//제출 버튼
survey_plus_submit_btn_id.addEventListener("click",()=>{

    survey_plus_submit_form_id.setAttribute("method","post")
    survey_plus_submit_form_id.setAttribute("action","/survey_plus")
   
    //날짜 + 랜덤값 기반 고유 id
    var T_uid = Date.now();
    var Q_uid = T_uid+1;

    var t_id
    var s_x_id
    var s_y_id
    var r_id


    //id 만든 규칙숫자 map의 key 배열화
    var keys = Array.from(count_map.keys());

    document.getElementById("s_r_v_id").setAttribute('value',return_resp_value(Q_uid,keys));
    document.getElementById("s_q_v_id").setAttribute('value',return_question_value(T_uid,Q_uid,keys));

    if(document.querySelector('input[name="drawinglots_selector"]:checked').value=="y"){
        t_id = $('#survey_drawinglots_title_id').val()
        s_x_id = $('#survey_drawinglots_size_x_id').val().replace(/ /gi,'')
        s_y_id = $('#survey_drawinglots_size_y_id').val().replace(/ /gi,'')
        r_id = $('#survey_drawinglots_raincheck_id').val()

        document.getElementById("s_d_t_id").setAttribute('value',t_id);
        document.getElementById("s_d_s_x_id").setAttribute('value',s_x_id);
        document.getElementById("s_d_s_y_id").setAttribute('value',s_y_id);
        document.getElementById("s_d_v_id").setAttribute('value',return_drawinglots_item_value());
        document.getElementById("s_d_r_id").setAttribute('value',r_id);
    }


    const r = $("#s_r_v_id").val().trim()
    const q = $("#s_q_v_id").val().trim()
    const t = $("#survey_title").val().trim()

    if(t==""){
        t_blank_alert();
    }

    //제출 하기 폼 보내기
    if($('input[name = "drawinglots_selector"]:checked').val()=="y"){
        if(r!="undefined"&&q!="undefined"&&t!="undefined"&&r!="[]"&&q!="[]"&&t!="[]"&&r!=null&&q!=null&&t!=null&&t!=""){
            if(return_drawinglots_item_boolen()&&t_id!=null&&t_id!=""&&s_x_id!=null&&s_x_id!=""&&s_y_id!=null&&s_y_id!=""&&r_id!=null&&r_id!=""){
                if($('.survey_drawinglots_item_pro').length){
                    survey_plus_submit_form_id.submit();
                    console.log(true)
                }else{
                    i_blank_alert()
                }
            }else{
                d_blank_alert()
                console.log(false)
            }
        }else{
            console.log(false)
        }
    }else{
        if(r!="undefined"&&q!="undefined"&&t!="undefined"&&r!="[]"&&q!="[]"&&t!="[]"&&r!=null&&q!=null&&t!=null&&t!=""){       
            survey_plus_submit_form_id.submit();
            console.log(true)
            
        }else{
            console.log(false)
        }
    }

});

//input number키 이벤트
$('input[type="number"]').change(function(){
    if($(this).val()<1){
        $(this).val(1)
    }else if($(this).val()>70){
        $(this).val(70)
    }
});





//go에 질문값반환값만들기
function return_question_value(T_uid,Q_uid,keys){
   
    var result = new Array();
    
    for(var i=0;i<keys.length;i++){
        var question = document.getElementsByName("question"+keys[i])[0].value.trim();
        var type;
        try{
            type = document.querySelector('input[name="question'+keys[i]+'_answertype"]:checked').value;
        }catch(e){
            
            type_alert()
            break;
        }
        
        
        if(question!=''){
            var k = i+1
            var data = new Object();
            data.id = Q_uid+k;
            data.id_t = T_uid;
            data.order = i;
            data.ctt = question;
            data.type = type;
            
            result.push(data);
        }else{
            return q_blank_alert()
        }
    }
    
    return JSON.stringify(result)
} 

//go에 응답값반환값만들기
function return_resp_value(Q_uid,keys){
    var result = new Array();

    for(var i=0;i<keys.length;i++){
        var j = i+1;    
        var text = document.getElementsByName("question"+keys[i]+"_answer_t")
        var new_uid = Q_uid+j
        for(var k =0;k<text.length;k++){
            if(text[k].value.trim()!=''){
                var data = new Object();
                data.id_q = new_uid;
                data.order = k;
                data.ctt = text[k].value.trim();
                // console.log("key :"+keys[i]+" th :"+k+" text :"+text[k].value);
                result.push(data)
            }else{
                return a_blank_alert()
            }
            
        }
    }
    
    return JSON.stringify(result)
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

//survey_plus_list_box 만들기
function create_survey_plus_list_box() {

    var temp = document.createElement('div');
    temp.setAttribute('id','survey_plus_list_box'+count);
    temp.setAttribute('class','survey_plus_list_box');

    var c_list ='<ul><li><input type="text" name="question'+count+'"></li><li><div id="question'+count+'_answertype_box_id"><input type="radio" id ="question'+count+'_answertype_r" name="question'+count+'_answertype" value="r" onclick="create_answer_type('+count+',this.value)" ><label for ="question'+count+'_answertype_r">라디오</label> <input type="radio" id="question'+count+'_answertype_t" name="question'+count+'_answertype" value="t" onclick="create_answer_type('+count+',this.value)"><label for ="question'+count+'_answertype_t">텍스트</label> <input type="radio" id="question'+count+'_answertype_c" name="question'+count+'_answertype" value="c" onclick="create_answer_type('+count+',this.value)"><label for ="question'+count+'_answertype_c">체크박스</label></div></li><li><div id="question'+count+'_answerlist_box">        </div></li></ul><button type="button" onclick="remove_question('+count+')">X</button>' 
    temp.innerHTML = c_list;
    contents_list.appendChild(temp)
    count_map.set(count,6);
    count++;
}


//질문 지우기
function remove_question(count){
    console.log("remove"+count)
    var id = document.getElementById('survey_plus_list_box'+count)
    contents_list.removeChild(id);
    count_map.delete(count);
}


//답변 타입정하기
function create_answer_type(count,type){
    var temp = document.getElementById('question'+count+'_answerlist_box');
    removeAllchild(temp);

    var ttemp = document.createElement('div');
    ttemp.setAttribute('id','question'+count+'_answerlist_box_d');

    var answer_item = '';
    var answer_item_plus = '';
    switch (type){
        case "r":
            answer_item = '<div id="question'+count+'_answer1_box"><input type="radio" id ="question'+count+'_answer1" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer1_b" value="1" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer2_box"><input type="radio" id="question'+count+'_answer2" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer2_b" value="2" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer3_box"><input type="radio" id="question'+count+'_answer3" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer3_b" value="3" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer4_box"><input type="radio" id="question'+count+'_answer4" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer4_b" value="4" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer5_box"><input type="radio" id="question'+count+'_answer5" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer5_b" value="5" onclick="remove_answer_item('+count+',this.value)">x</button></div>';
            answer_item_plus = '<li><button type="button" onclick="create_answer_item('+count+')">답변추가하기</button></li>'
        break;
        case "t":
            answer_item = '<div id="question'+count+'_answer1_box"><input type="hidden" id="question'+count+'_answer1" name="question'+count+'_answer_t" value = "T"></div>';
        break;
        case "c":
            answer_item = '<div id="question'+count+'_answer1_box"><input type="checkbox" id ="question'+count+'_answer1" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer1_b" value="1" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer2_box"><input type="checkbox" id="question'+count+'_answer2" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer2_b" value="2" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer3_box"><input type="checkbox" id="question'+count+'_answer3" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer3_b" value="3" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer4_box"><input type="checkbox" id="question'+count+'_answer4" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer4_b" value="4" onclick="remove_answer_item('+count+',this.value)">x</button></div><div id="question'+count+'_answer5_box"><input type="checkbox" id="question'+count+'_answer5" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer_t"><button type="button" id="question'+count+'_answer5_b" value="5" onclick="remove_answer_item('+count+',this.value)">x</button></div>';
            answer_item_plus = '<li><button type="button" onclick="create_answer_item('+count+')">답변추가하기</button></li>'
        break;
    }
    ttemp.innerHTML = answer_item;
    temp.appendChild(ttemp);

    var tttemp = document.createElement('div');
    tttemp.setAttribute('id','question'+count+'_answerlist_box_p')
    tttemp.innerHTML = answer_item_plus;
    temp.appendChild(tttemp);
}
                
function removeAllchild(div) {
    while (div.hasChildNodes()) {
        div.removeChild(div.firstChild);
    }
}

//답변 추가하기
function create_answer_item(count){
    var count_map_get = count_map.get(count);

    var type = document.querySelector('input[name="question'+count+'_answertype"]:checked').value;
    console.log(type+count)
    var temp = document.getElementById('question'+count+'_answerlist_box_d');
    var ttemp = document.createElement('div');
    ttemp.setAttribute('id','question'+count+'_answer'+count_map_get+'_box');

    var answer_item = '';
    switch (type){
        case "r":
            answer_item = '<input type="radio" id ="question'+count+'_answer'+count_map_get+'" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer'+count_map_get+'_t"><button type="button" id="question'+count+'_answer'+count_map_get+'_b" value="'+count_map_get+'" onclick="remove_answer_item('+count+',this.value)">x</button></div>';
        break;
        case "c":
            answer_item = '<input type="checkbox" id ="question'+count+'_answer'+count_map_get+'" name="question'+count+'_answer"><input type="text" name="question'+count+'_answer'+count_map_get+'_t"><button type="button" id="question'+count+'_answer'+count_map_get+'_b" value="'+count_map_get+'" onclick="remove_answer_item('+count+',this.value)">x</button></div>';
        break;
    } 

    ttemp.innerHTML = answer_item;
    temp.appendChild(ttemp);

    count_map.set(count,++count_map_get);
}


//답변 삭제하기
function remove_answer_item(count,value){
    console.log(value+" "+count)
    var item = document.getElementById('question'+count+'_answer'+value+'_box');
    item.parentNode.removeChild(item);
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


//질문 공백 발견시 경고창
function q_blank_alert(){
    alert("질문의 공백을 채워주세요")
}

//답문 공백 발견시 경고창
function a_blank_alert(){
    alert("답문의 공백을 채워주세요")
}


//타입 미선택 경고창
function type_alert(){
    alert("질문의 형식을 정해주세요")
}

//제목 공백경고창
function t_blank_alert(){
    alert("제목의 공백을 채워주세요")
}

//제목 공백경고창
function d_blank_alert(){
    alert("투표창의 공백을 채워주세요")
}

//공백 발견시 경고창
function i_blank_alert(){
    alert("투표 경품을 채워주세요")
}