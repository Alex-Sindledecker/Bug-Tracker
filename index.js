import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

import { MongoDatabase } from "./data/mongo_database.js";
import { DataManager } from "./data/data_manager.js";

import {dirname} from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const port = 3000;
const saltRounds = 10;

const app = express();

let database = new MongoDatabase();
let dataManager = new DataManager(database);
await dataManager.initDb(process.env.MONGO_URL);

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, cb) => {
    const user = await dataManager.getUser(username);

    if (user == null)
        return cb(null, false, {message: `Could not find a user with username: ${username}`});

    bcrypt.compare(password, user.password, (err, result) => {
        if (err)
            return cb(err);
        if (result == false)
            return cb(null, false);

        return cb(null, user);
    });
}));

passport.serializeUser((user, cb) => {
    cb(null, {
        email: user.username
    });
});

passport.deserializeUser((user, cb) => {
    cb(null, user);
});

app.get("/", async (req, res) => {
    if (req.isAuthenticated()){
        dataManager.getProjects(req.user.email).then(projects => {
            const ownerProjects = projects.filter(project => project.ownerUsername === req.user.email);
            const collabProjects = projects.filter(project => project.ownerUsername !== req.user.email);

            res.render(__dirname + "/views/index.ejs", {
                username: req.user.email, 
                ownerProjects: ownerProjects,
                collabProjects: collabProjects
            });
        });
    } else {
        res.render(__dirname + "/views/index.ejs");
    }
});

app.get("/login", (req, res) => {
    if (req.isAuthenticated())
        res.redirect("/");
    else
        res.render(__dirname + "/views/login.ejs");
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true
}));

app.get("/signup", (req, res) => {
    if (req.isAuthenticated()){
        return res.redirect("/");
    }

    res.render(__dirname + "/views/signup.ejs");
});

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //Validate username and password here

    if (await dataManager.getUser(username) != null){
        res.render(__dirname + "/views/signup.ejs", {email: username});
    } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            const user = dataManager.createNewUser(username, hash);
            
            if (user != null){
                req.login(user, err => {
                    console.log(err);
                    if (err){
                        return res.redirect("/signup");
                    } else {
                        return res.redirect("/");
                    }
                });
            }
        });
    }

});

app.get("/logout", (req, res) => {
    if (req.isAuthenticated()){
        req.logOut(err => {
            if (err) console.log(err);
            res.redirect("/");
        });
    }
});

app.get("/project/:id", async (req, res) => {
    try{
        const project = await dataManager.getProject(req.params.id);
        const bugs = await dataManager.getBugs(project.id);

        res.render(__dirname + "/views/project.ejs", {project: project, bugs: bugs, archivePage: false});
    } catch (error){
        console.log(error.message);
        res.status(404).render(__dirname + "/views/not-found-404.ejs");
    }
});

app.post("/project/:id/archive", async (req, res) => {
    const projectId = req.params.id;
    const bugId = req.body.id;

    try{
        await dataManager.archiveBug(bugId);

        res.sendStatus(200);
    }
    catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

app.get("/project/:id/archive", async (req, res) => {
    try{
        const project = await dataManager.getProject(req.params.id);
        const bugs = await dataManager.getArchivedBugs(project.id);

        res.render(__dirname + "/views/project.ejs", {project: project, bugs: bugs, archivePage: true});
    } catch (error){
        console.log(error.message);
        res.status(404).render(__dirname + "/views/not-found-404.ejs");
    }
});

app.post("/project/:id/restore", async (req, res) => {
    const projectId = req.params.id;
    const bugId = req.body.id;

    try{
        await dataManager.unarchiveBug(bugId);

        res.sendStatus(200);
    }
    catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

app.post("/project/:id/delete", async (req, res) => {
    const bugId = req.body.id;

    try{
        await dataManager.deleteBug(bugId);

        res.sendStatus(200);
    } catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

app.post("/project/:id/new", async (req, res) => {
    const projectId = req.params.id;
    const dataModel = {
        level: Number.parseInt(req.body.level),
        name: req.body.name,
        description: req.body.description
    }
    //TODO: request validation
    await dataManager.createBug(projectId, dataModel.name, dataModel.description, dataModel.level);

    res.redirect("/project/" + projectId);
});

app.listen(port, () => {
    console.log("App running on port " + port);
    console.log("Dev project running on http://localhost:3000/project/6541eaa9e357f47d45b32a4c");
});