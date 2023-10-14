import express from "express";
import bodyParser from "body-parser";
import {BugManager, InstanceDatabase} from "./data.js";

import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const bypassLogin = true;
const port = 3000;
const app = express();

let bugManager = new BugManager(new InstanceDatabase());

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    if (bypassLogin === false)
        res.render(__dirname + "/views/index.ejs");
    else
        res.render(__dirname + "/views/index.ejs", {username: "Dev123"});

    bugManager.setTargetProject(1);
    const bugModel = bugManager.makeBug(4, "Death bug", "Evil bug that kills thigns");
    console.log(bugModel);
});

app.listen(port, () => {
    console.log("App running on port " + port);
});