//All database operations are mocked. Database specific testing is preformed in another file

import passport from "passport";
import { Express } from "express";
import { MongoDatabase } from "../data/mongo_database";

import { runApp, initApp } from "../app"
import axios from "axios";

let server;

//MOCK FUNCTIONS:
//------------------------------------------------------------------------------------------------
jest.spyOn(MongoDatabase.prototype, 'getUser').mockImplementation((username) => {
    return new Promise((resolve, reject) => {
        resolve({username: username, password: "--test-password--", projects: []});
    });
});

jest.spyOn(MongoDatabase.prototype, 'addUser').mockImplementation((username, password) => {
    console.log("Mocked addUser");
    return new Promise((resolve, reject) => {
        resolve({username: username, password: password});
    });
});

jest.spyOn(MongoDatabase.prototype, 'deleteUser').mockImplementation((username) => {
    return new Promise((resolve, reject) => {
        resolve(true);
    });
});

//------------------------------------------------------------------------------------------------

//SETUP
//------------------------------------------------------------------------------------------------
beforeAll((done) => {
    //Start the server
    const mockAuth = (req, res, next) => {
        req.user = { email: "dev" };
        next();
    };

    const middleWare = [mockAuth];

    initApp().then(() => {
        server = runApp(middleWare);
        done();
    });
});

afterAll((done) => {
    //Stop the server
    server.then(async obj => {
        await obj.close();
        done();
    });
});
//------------------------------------------------------------------------------------------------

//TESTS
//------------------------------------------------------------------------------------------------
describe("Tests API routes", () => {

    //Test 1 - GET /user
    test("Tests GET /api/user/test_username --> Expects test_username", (done) => {
        axios.get("http://localhost:3000/api/user/", {
            params: {
                username: "test_username"
            }
        }).then(result => {
            expect(result.data).toMatchObject({
                username: 'test_username',
                password: '--test-password--',
                projects: []
            });
            done();
        });
    });

    //Test 2 - POST /user
    test("Tests POST /api/user/ with username: 'uname', and password: 'pword' --> Expects the input", (done) => {
        let testData = {username: "uname", password: "pword"};

        axios.post("http://localhost:3000/api/user/", testData).then(result => {
            expect(result.data).toMatchObject(testData);
            done();
        });
    });

    /*
    test("Tests DELETE /api/user with username: 'uname'", (done) => {
        axios.delete("http://localhost:3000/api/user").then(response => {
            expect(response.status).toBe(200);
            done();
        });
    });
    */

});
//------------------------------------------------------------------------------------------------