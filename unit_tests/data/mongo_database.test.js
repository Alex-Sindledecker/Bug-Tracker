import "dotenv/config";
import { MongoDatabase } from "../../data/mongo_database";

let db;

//Setup database for testing
beforeAll(async () => {
    db = new MongoDatabase();
    await db.init(process.env.TEST_DB_URL);
});

//Test user creation
test(`Creates a user in ${process.env.TEST_DB_URL}  with username 'DEV_USER_CREATE' and passowrd '123'`, (done) => {
    db.addUser("DEV_USER_CREATE", "123").then(user => {
        expect(user).toStrictEqual({username: "DEV_USER_CREATE", password: "123"});

        done();
    });
});

//Test project creation
test(`Creates a project in ${process.env.TEST_DB_URL} with username: 'username', name: 'DEV_PROJECT_CREATE', and description: 'description'`, (done) => {
    db.addProject("username", "DEV_PROJECT_CREATE", "description").then(project => {
        expect(project).toMatchObject({
            name: "DEV_PROJECT_CREATE",
            description: "description",
            ownerUsername: "username"
        });
        done();
    });
});

//Wipe data from database and disconnect
afterAll(async () => {
    await db._UserModel.deleteMany({});
    await db._ProjectModel.deleteMany({});
    await db._BugModel.deleteMany({});
    await db.disconnect();
});