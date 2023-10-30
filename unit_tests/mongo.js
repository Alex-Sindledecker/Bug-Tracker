import {logSuccess, logFailure} from "./log.js";
import { DataManager, MongoDatabase} from "../data.js";

let db = new MongoDatabase();
await db.init("mongodb://127.0.0.1:27017/bugtrackerdb");
//let dataManager = new DataManager(db);

//await dataManager.initDb("mongodb://127.0.0.1:27017/bugtrackerdb");

const projectTest = async (name, description) => {
    try{
        const p = await db.addProject(name, description);
        if (p.name === name && p.description === description && p.id !== null)
            logSuccess("\t\tCreate Project");
        else
        {
            logFailure("\t\tCreate Project");
            return;
        }

        const q = await db.getProject(p.id);
        if (q.name === name && q.description === description && q._id === p._id)
            logSuccess("\t\tGet Project");
        else
            logFailure("\t\tGet Project");

        const r = await db.deleteProject(p.id);
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
        const projectId = (await db.addProject("--DELETE--", "--DELETE--")).id;
        const p = await db.addBug(projectId, level, name, description);
        if (p.projectId.equals(projectId) && p.name === name && p.description === description && p.level === level && p.id !== null)
            logSuccess("\t\tCreate Bug");
        else{
            logFailure("\t\tCreate Bug");
        }

        const q1 = await db.getBug(p.id);
        if (q1.projectId.equals(p.projectId) && q1.name === p.name && q1.description === p.description && q1.level === p.level)
            logSuccess("\t\tGet Bug");
        else
            logFailure("\t\tGet Bug");

        //const q2 = await dataManager.upd

        if (await db.deleteBug(p.id) === true)
            logSuccess("\t\tDelete Bug");
        else
            logFailure("\t\tDelete Bug");

        await db.deleteProject(projectId);

    } catch (error){
        console.log(error.message);
    }
};

console.log("\tProject Tests:");
await projectTest("Test Project", "Test Project Description");
console.log("\tBug Tests:");
await bugTest("Test Bug", "Test bug description", 3, true);


await db.disconnect();