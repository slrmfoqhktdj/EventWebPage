const submit_btn = document.getElementById("survey_statistics_submit_btn_id");
const submit_form = document.getElementById("survey_statistics_submit_form");
submit_form.setAttribute("method","post")
submit_form.setAttribute("action","/m_survey")

submit_btn.addEventListener("click",()=>{
    submit_form.submit()
})