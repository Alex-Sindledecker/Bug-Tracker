import express from "express";
import bodyParser from "body-parser";
import {InstanceDatabase} from "./data.js";

import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const bypassLogin = true;
const port = 3000;
const app = express();

let database = new InstanceDatabase();
const projectId = database.addProject("My Project", "Dev project").id;
database.addBug(projectId, 4, "Level 4 bug", "Fix this thing in this place");
database.addBug(projectId, 3, "Level 3 bug", "Fix this thing in this other place");
database.addBug(projectId, 2, "Level 2 bug", "Fix this thing in a hypothetical place");
database.addBug(projectId, 1, "Level 1 bug", "Fix this thing in a different place");

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
        const project = database.getProject(req.params.id);
        res.sendStatus(200);
    } catch (error){
        console.log(error.message);
        res.status(404).render(__dirname + "/views/not-found-404.ejs");
    }
});

app.listen(port, () => {
    console.log("App running on port " + port);
});