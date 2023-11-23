export function isValidPassword(password){
    const matchExpression = "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$";

    if (password.match(matchExpression) == null || password.match("[\x00-\x1F]|[\x7F]") != null || password.length > 25 || password.length < 8){
        return false;
    }

    return true;
}