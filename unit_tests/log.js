export function logSuccess(msg){
    console.log("%s - \x1b[32mPassed\x1b[0m", msg);
}

export function logFailure(msg){
    console.log("%s - \x1b[31mFailed\x1b[0m", msg);
}