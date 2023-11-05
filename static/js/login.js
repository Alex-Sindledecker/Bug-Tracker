//Client side password validation

function checkPasswordMatch(){
    if ($("#confirmpassword").val() !== $("#password").val()){
        $("#password-match-warning").show();
    }else {
        $("#password-match-warning").hide();
    }
}

$("#confirmpassword").on("input", () => {
    checkPasswordMatch();
});

$("#password").on("input", () => {
    //Check if the confirm password field exists and if it does, check if any text is inside it
    if ($("#confirmpassword").length && $("#confirmpassword").val().length > 0){ 
        checkPasswordMatch();
    }
});