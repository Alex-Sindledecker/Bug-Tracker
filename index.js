import express from "express";
import bodyParser from "body-parser";
import {InstanceDatabase, DataManager} from "./data.js";

import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const bypassLogin = true;
const port = 3000;
const app = express();

let database = new InstanceDatabase();
const projectId = database.addProject("My Project", "Dev project").id;
let dataManager = new DataManager(database);

dataManager.createBug(projectId, "Level 4 bug", "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.", 4);
dataManager.createBug(projectId, "Level 3 bug", "Fix this thing in this other place",3 );
dataManager.createBug(projectId, "Level 2 bug", "Fix this thing in a hypothetical place", 2);
dataManager.createBug(projectId, "Level 1 bug", "Fix this thing in a different place", 1);

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    if (bypassLogin === false)
        res.render(__dirname + "/views/index.ejs");
    else
        res.render(__dirname + "/views/index.ejs", {username: "Dev123"});
});

app.get("/project/:id", (req, res) => {
    try{
        const project = dataManager.getProject(req.params.id);
        const bugs = dataManager.getBugs(project.id);

        res.render(__dirname + "/views/project.ejs", {project: project, bugs: bugs, archivePage: false});
    } catch (error){
        console.log(error.message);
        res.status(404).render(__dirname + "/views/not-found-404.ejs");
    }
});

app.post("/project/:id/archive", (req, res) => {
    const projectId = req.params.id;
    const bugId = req.body.id;

    try{
        dataManager.archiveBug(bugId);

        res.sendStatus(200);
    }
    catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

app.get("/project/:id/archive", (req, res) => {
    try{
        const project = dataManager.getProject(req.params.id);
        const bugs = dataManager.getArchivedBugs(project.id);

        res.render(__dirname + "/views/project.ejs", {project: project, bugs: bugs, archivePage: true});
    } catch (error){
        console.log(error.message);
        res.status(404).render(__dirname + "/views/not-found-404.ejs");
    }
});

app.post("/project/:id/restore", (req, res) => {
    const projectId = req.params.id;
    const bugId = req.body.id;

    try{
        dataManager.unarchiveBug(bugId);

        res.sendStatus(200);
    }
    catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

app.post("/project/:id/delete", (req, res) => {
    const bugId = req.body.id;

    try{
        dataManager.deleteBug(bugId);

        res.sendStatus(200);
    } catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

app.post("/project/:id/new", (req, res) => {
    const projectId = Number.parseInt(req.params.id);
    const dataModel = {
        level: Number.parseInt(req.body.level),
        name: req.body.name,
        description: req.body.description
    }

    //TODO: request validation
    console.log(dataManager.createBug(projectId, dataModel.name, dataModel.description, dataModel.level));

    res.redirect("/project/" + projectId);
});

app.listen(port, () => {
    console.log("App running on port " + port);
});