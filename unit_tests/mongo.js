import {logSuccess, logFailure} from "./log.js";
import { DataManager, MongoDatabase} from "../data.js";

let db = new MongoDatabase();
let dataManager = new DataManager(db);

await dataManager.initDb("mongodb://127.0.0.1:27017/bugtrackerdb");

const projectTest = async (name, description) => {
    try{
        const p = await dataManager.createProject(name, description);
        if (p.name === name && p.description === description && p.id !== null)
            logSuccess("\t\tCreate Project");
        else
        {
            logFailure("\t\tCreate Project");
            return;
        }

        const q = await dataManager.getProject(p.id);
        if (q.name === name && q.description === description && q._id === p._id)
            logSuccess("\t\tGet Project");
        else
            logFailure("\t\tGet Project");

        const r = await dataManager.deleteProject(p.id);
        if (r === true)
            logSuccess("\t\tDelete Project");
        else
            logFailure("\t\tDelete Project");
    } catch (error){
        console.log(error.message);
    }
    
};

const bugTest = async (name, description, level) => {
    try
    {

        const projectId = (await dataManager.createProject("--DELETE--", "--DELETE--")).id;
        const p = await dataManager.createBug(projectId, name, description, level);
        if (p.projectId.equals(projectId) && p.name === name && p.description === description && p.level === level && p.id !== null)
            logSuccess("\t\tCreate Bug");
        else{
            logFailure("\t\tCreate Bug");
        }

        const q = await dataManager.getBug(p.id);
        if (q.projectId.equals(p.projectId) && q.name === p.name && q.description === p.description && q.level === p.level)
            logSuccess("\t\tGet Bug");
        else
            logFailure("\t\tGet Bug");

        if (await dataManager.deleteBug(p.id) === true)
            logSuccess("\t\tDelete Bug");
        else
            logFailure("\t\tDelete Bug");

        await dataManager.deleteProject(projectId);

    } catch (error){
        console.log(error.message);
    }
};

console.log("\tProject Tests:");
await projectTest("Test Project", "Test Project Description");
await bugTest("Test Bug", "Test bug description", 3, true);


await dataManager.closeDb();