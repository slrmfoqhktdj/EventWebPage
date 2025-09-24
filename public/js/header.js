const header_login_btn = document.getElementById("loginpagebtn_h")
const login_submit_form = document.getElementById("login_form");
const login_submit_btn = document.getElementById("login_btn_id");





header_login_btn.addEventListener("click",()=>{
    modal("login_modal")
})

login_submit_btn.addEventListener("click",()=>{
    const _id = $('#login_idtext_id').val().trim()
    const _pw = $('#login_pwtext_id').val().trim()
    if(_id!=null&&_id!=""&&_pw!=null&&_pw!=""){
        login_submit_form.setAttribute("method","post")
        login_submit_form.setAttribute("action","/login")

        login_submit_form.submit();
    }else{
        login_alert();
    }
})




// 모달
function modal(id){
    const zIndex = 99;
    const modal = document.getElementById(id);

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

    document.body.append(bg);

    // 닫기 버튼 처리, 시꺼먼 레이어와 모달 div 지우기
    modal.querySelector('.login_modal_close_btn').addEventListener('click', function() {
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


function login_alert(){
    alert("아이디와 비밀번호를 채워주세요")
}