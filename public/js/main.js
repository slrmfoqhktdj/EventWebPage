var m_survey = document.getElementById("m_survey_id");
var m_survey_form = document.getElementById("m_survey_form");
var m_pachinko = document.getElementById("m_pachinko_id");
var m_pachinko_form = document.getElementById("m_pachinko_form");
var m_custom = document.getElementById("m_custom_id");
var m_custom_form = document.getElementById("m_custom_form");



m_survey.addEventListener("click",()=>{
    m_survey_form.submit();
});

m_pachinko.addEventListener("click",()=>{
    m_pachinko_form.submit();
})

m_custom.addEventListener("click",()=>{
    m_custom_form.submit();
})