//Client side password validation

function checkPasswordMatch(){
    if ($("#confirmpassword").val() !== $("#password").val()){
        $("#password-match-warning").show();
    }else {
        $("#password-match-warning").hide();
    }
}

//What password to check, what list to toggle, validator list
//Each item in the validation list should be an object that follows this format:
//{
//  regex: ...,
//  elementMatch
//}
function validatePasswordRequirements(passwordMatch, listMatch, validatorList){
    let valid = true;
    validatorList.forEach(validator => {
        if ($(passwordMatch).val().match(validator.regex) == null){
            $(validator.elementMatch).addClass("warning-text");
            valid = false;
        } else {
            $(validator.elementMatch).removeClass("warning-text");
        }
    });

    if (valid)
        $(listMatch).hide();
    else{
        $(listMatch).show();
    }
}

$("#confirmpassword").on("input", () => {
    validatePasswordRequirements("#confirmpassword", "#invalid-confirm-password-list", [
        { regex: "[A-Z]", elementMatch: "#uppercase-character-warning-1" },
        { regex: "[a-z]", elementMatch: "#lowercase-character-warning-1" },
        { regex: "[0-9]", elementMatch: "#digit-warning-1" },
        { regex: "[ -/]|[:-@]|[\[-`]", elementMatch: "#special-character-warning-1"},
        { regex: "^.{8,25}$", elementMatch: "#length-warning-1" }
    ]);

    checkPasswordMatch();
});

$("#password").on("input", () => {
    //Validate password characters

    //Regular expression to ensure a password contains at least 8 characters, at least one upercase letter, one lowercase letter, one number, and one special character
    
    let passwordValidationString = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

    validatePasswordRequirements("#password", "#invalid-password-list", [
        { regex: "[A-Z]", elementMatch: "#uppercase-character-warning" },
        { regex: "[a-z]", elementMatch: "#lowercase-character-warning" },
        { regex: "[0-9]", elementMatch: "#digit-warning" },
        { regex: "[ -/]|[:-@]|[\[-`]", elementMatch: "#special-character-warning"},
        { regex: "^.{8,25}$", elementMatch: "#length-warning" }
    ]);

    //Check if the confirm password field exists and if it does, check if any text is inside it
    if ($("#confirmpassword").length && $("#confirmpassword").val().length > 0){ 
        checkPasswordMatch();
    }
});