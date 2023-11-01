import {logSuccess, logFailure} from "./log.js";
import { DataManager, MongoDatabase} from "../data.js";

let db = new MongoDatabase();
await db.init("mongodb://127.0.0.1:27017/bugtrackerdb");

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
            logSuccess("\t\tRead Project");
        else
            logFailure("\t\tRead Project");

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
        if (p.projectId === projectId && p.name === name && p.description === description && p.level === level && p.id !== null)
            logSuccess("\t\tCreate Bug");
        else{
            logFailure("\t\tCreate Bug");
        }

        const q1 = await db.getBug(p.id);
        if (q1.projectId === p.projectId && q1.name === p.name && q1.description === p.description && q1.level === p.level)
            logSuccess("\t\tRead Bug (1/2)");
        else
            logFailure("\t\tRead Bug (1/2)");

        const _q2 = await db.addBug(projectId, 4, "--DELETE--", "--DELETE--");
        const q2 = await db.getBugs(projectId,  {archived: false});
        if (q2.length === 2)
            logSuccess("\t\tRead Bug(s) (2/2)");
        else
            logFailure("\t\tRead Bug(s) (2/2)");
        await db.deleteBug(_q2.id);

        const q3 = await db.updateBug(q1.id, {
            projectId: projectId,
            name: "--UPDATE-BUG-TEST--",
            description: "--UPDATE-BUG-TEST-DESCRIPTION--",
            level: -1,
            archived: false
        });

        if (q3.projectId === projectId && q3.name === "--UPDATE-BUG-TEST--" && q3.description === "--UPDATE-BUG-TEST-DESCRIPTION--" && q3.level === -1 && q3.archived === false)
            logSuccess("\t\tUpdate Bug (1/2)");
        else
            logFailure("\t\tUpdate Bug (1/2)");


        const q4 = await db.modifyBug(q1.id, "archived", true);
        if (q4.archived === true)
            logSuccess("\t\tUpdate Bug (2/2)");
        else
            logFailure("\t\tUpdate Bug (2/2)");


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