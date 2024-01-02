$(".card-button").click(function(event){
    const action = $(this).attr("name").split('-')[0];

    let data = {
        projectId: window.location.href.substring(window.location.href.lastIndexOf('/') + 1),
        id: $(this).attr("name").split('-')[1]
    };

    let callback = (data, status) => {
        if (status === 'success'){
            $(this).parents(".bug-card")[0].remove();
        }
    };

    let projectId = window.location.href.match(/\/project\/(\w+)/)[1];
    console.log(projectId);

    $.post(`/project/${projectId}/${action}`, data, callback);

    //Stops click event from triggering on the bug card, resulting in data being shown about it.
    event.stopPropagation();
});

$(".add-bug-card").click(() => {
    $("#add-bug-overlay").removeClass("hidden");
});

$(".close-overlay-button").click(function(){
    $(this).parents(".site-overlay").addClass("hidden");
});

$(".level-selection").click(function(){
    $("#level").attr("value", $(this).attr("name"));
	$(".level-selection").css("background-color", "var(--card-background)");
    switch ($(this).attr("name")){
        case "4":
            $(this).css("background-color", "magenta");
            break;
        case "3":
            $(this).css("background-color", "red");
            break;
        case "2":
            $(this).css("background-color", "goldenrod");
            break;
        case "1":
            $(this).css("background-color", "green");
            break;
    }
});

$(".more-info-card").on("click", function() {
    $("#bug-info-overlay").removeClass("hidden");

    $("#bug-info-overlay-date").text($(this).attr("data-date"));
    $("#bug-info-overlay-name").text($(this).attr("data-name"));
    $("#bug-info-overlay-author").text($(this).attr("data-author"));
    $("#bug-info-overlay-description").text($(this).find("p").text());

    let color;
    switch ($(this).attr("data-level")){
        case '1':
            color = "green";
            break;
        case '2':
            color = "yellow";
            break;
        case '3':
            color = "red";
            break;
        case '4':
            color = "magenta";
            break;    
    }
    $("#bug-info-overlay-underline").css("background-color", color);
});