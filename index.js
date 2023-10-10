import express from "express";
import bodyParser from "body-parser";

import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const bypassLogin = true;
const port = 3000;
const app = express();

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    if (bypassLogin === false)
        res.render(__dirname + "/views/index.ejs");
    else
        res.render(__dirname + "/views/index.ejs", {username: "Dev123"});
});

app.listen(port, () => {
    console.log("App running on port " + port);
});