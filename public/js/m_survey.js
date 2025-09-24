
function survey_show(div){
    const box = $(div).parent().prev();
    // const id = box.find("input").val();
    const form = box.find("form");
    form.attr("method","post");
    form.attr("action","/survey_show_page").submit();
}

function survey_amend(div){
    const box = $(div).parent().prev();
    // const id = box.find("input").val();
    const form = box.find("form");
    form.attr("method","post");
    form.attr("action","/survey_amend_page").submit();
}

function survey_statistics(div){
    const box = $(div).parent().prev();
    // const id = box.find("input").val();
    const form = box.find("form");
    form.attr("method","post");
    form.attr("action","/survey_statistics_page").submit();
}

function survey_delete(div){
    const box = $(div).parent().prev();
    // const id = box.find("input").val();
    const form = box.find("form");
    form.attr("method","post");
    form.attr("action","/survey_delete").submit();
}