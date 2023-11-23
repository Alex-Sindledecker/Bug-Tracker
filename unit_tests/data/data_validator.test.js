import { isValidPassword } from "../../data/data_validator";

describe("User Information Validation Testing", () => {

    describe("Password validation tests on 'isValidPassword'", () => {

        test("Test for valid password", () => {
            expect(isValidPassword("ABCabc123!")).toBe(true);
        });

        test("Test for missing special character", () => {
            expect(isValidPassword("ABCabc123")).toBe(false); //Missing special character
        });

        test("Test for missing lowercase character", () => {
            expect(isValidPassword("ABC123!!!!")).toBe(false); //Missing lowercase character
        });

        test("Test for missing uppercase character", () => {
            expect(isValidPassword("abcabc123!")).toBe(false); //Missing uppercase character
        });

        test("Test for missing digit", () => {
            expect(isValidPassword("ABCabc!!!!")).toBe(false); //Missing digit
        });

        test("Test for too short", () => {
            expect(isValidPassword("aA1!")).toBe(false); //Too short (less than 8 characters)
        });

        test("Test for too long", () => {
            expect(isValidPassword("aA1!aA1!aA1!aA1!aA1!aA1!aA1!aA1!")).toBe(false); //Too long (more than 25 characters)
        });

        test("Test for invalid characters", () => {
            let asciiPassword = "Ab1!\x7f";
            for (let i = 0; i < 16; i++){
                asciiPassword += String.fromCharCode(asciiPassword);
            }
    
            expect(isValidPassword(asciiPassword)).toBe(false); //Invalid characters used

            asciiPassword = "Ab1!";
            for (let i = 16; i < 32; i++){
                asciiPassword += String.fromCharCode(asciiPassword);
            }
    
            expect(isValidPassword(asciiPassword)).toBe(false); //Invalid characters used
        });

    });

});