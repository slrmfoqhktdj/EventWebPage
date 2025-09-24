const submit_btn = document.getElementById("survey_do_submit_btn_id");
const submit_form = document.getElementById("survey_respond_form");

submit_btn.addEventListener("click",()=>{

    submit_form.setAttribute("method","post")
    submit_form.setAttribute("action","/survey_submit")

    if(return_allow()){
        submit_form.submit()
    }else{
        a_blank_alert()
    }

})

// 공백찾기
function return_allow(){
    var pre_id = "0"
    var result = true;


    $('.survey_contents_A').each(function(){   
        var id_ =$(this).attr('name').trim();
        if(pre_id!=id_){
            switch($(this).attr('type').trim()){
                case "text":
                    if($(this).val().trim()==''){
                        result = false;
                        return false
                    }
                break;
                default:
                    if($('input[name='+id_+']:checked').val()==null||$('input[name='+id_+']:checked').val()==""||$('input[name='+id_+']:checked').val()=="undefined"){
                        result = false;
                        return false
                    }
                break;
            }
        }
        pre_id = id_
    });

    return result
}


//답문 공백 발견시 경고창
function a_blank_alert(){
    alert("모든 질문에 답을 해주세요")
}