const form = document.getElementById("custom_submit_return_form");

// $('.contents').click(function(){
//     form.setAttribute("method","post")
//     form.setAttribute("action","/m_custom")
//     form.submit()  
// })

setTimeout(function(){
    form.setAttribute("method","post")
    form.setAttribute("action","/m_custom")
    form.submit()  
},3000);