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

//Test bug creation
test(`Creates a bug in ${process.env.TEST_DB_URL} with projectId: '000000000000000000000000', level: '2', name: 'DEV_BUG_CREATE', and description: 'description'`, (done) => {
    db.addBug("000000000000000000000000", 2, "DEV_BUG_CREATE", "description").then(bug => {
        expect(bug).toMatchObject({
            projectId: "000000000000000000000000",
            level: 2,
            name: "DEV_BUG_CREATE",
            description: "description"
        });
        done();
    })
});

//Test user retrieval
test(`Retrieves a user with username: 'DEV_USERNAME_GET', password: 'password', projects: '[]'`, (done) => {
    (new db._UserModel({username: 'DEV_USERNAME_GET', password: 'password', projects: []})).save().then((createdModel => {
        db.getUser("DEV_USERNAME_GET").then(user => {
            expect(user).toMatchObject({
                username: "DEV_USERNAME_GET", 
                password: "password",
                projects: []
            });
            done();
        })
    }));
});

//Wipe data from database and disconnect
afterAll(async () => {
    await db._UserModel.deleteMany({});
    await db._ProjectModel.deleteMany({});
    await db._BugModel.deleteMany({});
    await db.disconnect();
});