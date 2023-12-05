const daySVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" viewBox="0 0 16 16">
<path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z"/>
</svg>`;
const nightSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon-stars-fill" viewBox="0 0 16 16">
<path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z"/>
<path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z"/>
</svg>`;

let darkMode = true;

$("#daylight-button").click(() => {
    if (darkMode === false){
        $(":root").css({
            "--color1": "#79155B",
            "--color2": "#C23373",
            "--color3": "#F6635C",
            "--color4": "rgb(80,80,80)",
            "--font-color": "white",
            "--card-background": "#363436"
        });

        $("body").css("background-color", "#262426");
        $("#daylight-button").html(nightSVG);
        $(".card-button").css("color", "white");

        darkMode = true;
    }else{
        $(":root").css({
            "--color1": "#79155B",
            "--color2": "#C23373",
            "--color3": "#F6635C",
            "--color4": "rgb(80,80,80)",
            "--font-color": "#323232",
            "--card-background": "#d4d4d4"
        });
        
        $("body").css("background-color", "#c4c4c4");
        $("#daylight-button").html(daySVG);
        $(".card-button").css("color", "black");

        darkMode = false;
    }
});

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