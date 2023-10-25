import {logSuccess, logFailure} from "./log.js";
import { DataManager, MongoDatabase} from "../data.js";

let db = new MongoDatabase();
let dataManager = new DataManager(db);

await dataManager.initDb("mongodb://127.0.0.1:27017/bugtrackerdb");

const projectTest = async (name, description) => {
    const q = await dataManager.createProject(name, description);
    if (q.name === name && q.description === description && q._id !== null)
        logSuccess("\t\tCreate Project");
    else
    {
        logFailure("\t\tCreate Project");
        return;
    }

    const r = await dataManager.deleteProject(q._id);
    if (r === true)
        logSuccess("\t\tDelete Project");
    else
        logFailure("\t\tDelete Project");
}

console.log("\tProject Tests:");
await projectTest("Test Project", "Test Project Description");


await dataManager.closeDb();