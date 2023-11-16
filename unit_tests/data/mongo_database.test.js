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
        console.log("User created");
        expect(user).toStrictEqual({username: "DEV_USER_CREATE", password: "123"});

        done();
    });
});

//Test share project
test(`Creates a new project share object in ${process.env.TEST_DB_URL} with project id: '000000000000000000000000', targetUsername: 'TARGET_USERNAME_DEV', and join code: '0000'`, (done) => {
    db.shareProject("000000000000000000000000", "TARGET_USERNAME_DEV", "0000").then(share => {
        expect(share).toMatchObject({
            projectId: "000000000000000000000000",
            targetUsername: "TARGET_USERNAME_DEV",
            code: "0000"
        });
        done();
    });
});

//Test get shared projects
test("creates two projectShares and run getSharedProjects to get them", async () => {
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

    const p1Id = await p1._id.toString();
    const p2Id = await p2._id.toString();

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

//Wipe data from database and disconnect
afterAll(async () => {
    await db._UserModel.deleteMany({});
    await db._ProjectModel.deleteMany({});
    await db._BugModel.deleteMany({});
    await db._ProjectShareModel.deleteMany({});
    await db.disconnect();
});