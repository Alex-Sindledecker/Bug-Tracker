import "dotenv/config";
import { MongoDatabase } from "../../data/mongo_database";

let db;

//Setup database for testing
beforeAll(async () => {
    db = new MongoDatabase();
    await db.init(process.env.TEST_DB_URL);
});

//Test user creation
test(`Creates a user with username 'DEV_USER_CREATE' and passowrd '123'`, (done) => {
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

//Test share project
test(`Creates a new project share object with project id: '000000000000000000000000', targetUsername: 'TARGET_USERNAME_DEV', and join code: '0000'`, (done) => {
    db.shareProject("000000000000000000000000", "TARGET_USERNAME_DEV", "0000").then(share => {
        expect(share).toMatchObject({
            projectId: "000000000000000000000000",
            targetUsername: "TARGET_USERNAME_DEV",
            code: "0000"
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

//Test get shared projects
test("creates two projectShares and run getSharedProjects to get them", async () => {
    //Create project samples
    let p1 = new db._ProjectModel({
        ownerUsername: "SHARE_PROJECT_NAME",
        name: "SHARE_PROJECT_DEV1",
        description: "description"
    });
    await p1.save();

    let p2 = new db._ProjectModel({
        ownerUsername: "SHARE_PROJECT_NAME",
        name: "SHARE_PROJECT_DEV2",
        description: "description"
    });
    await p2.save();

    //Get ids
    const p1Id = await p1._id.toString();
    const p2Id = await p2._id.toString();

    //Create project sharess
    await db.shareProject(p1Id, "SHARE_USERNAME_DEV", "0000");
    await db.shareProject(p2Id, "SHARE_USERNAME_DEV", "1111");

    db.getSharedProjects("SHARE_USERNAME_DEV").then(projects => {
        expect(projects).toEqual([
            {
                id: p1Id,
                name: "SHARE_PROJECT_DEV1",
                description: "description",
                ownerUsername: "SHARE_PROJECT_NAME",
                code: "0000"
            },
            {
                id: p2Id,
                name: "SHARE_PROJECT_DEV2",
                description: "description",
                ownerUsername: "SHARE_PROJECT_NAME",
                code: "1111"
            }
        ]);
    });
});

test("Creates a project share and deletes it. Expected result is true", (done) => {
    db.shareProject("000000000000000000000000", "PROJECT_SHARE_DELETE_NAME", "0000").then(share => {
        db.deleteProjectShare(share.projectId, share.targetUsername).then(result => {
            expect(result).toBe(true);
            done();
        });
    });
});

//Wipe data from database and disconnect
afterAll(async () => {
    await db._UserModel.deleteMany({});
    await db._ProjectModel.deleteMany({});
    await db._BugModel.deleteMany({});
    await db._ProjectShareModel.deleteMany({});
    await db.disconnect();
});