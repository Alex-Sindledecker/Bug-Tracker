import express from "express";
import {getDataManager} from "../database.js";

let router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated())
        next();
    else if (req.method == "GET")
        res.redirect("/login");
    else
        res.status(403).redirect("/login");
});

router.get("/", (req, res) => {
    const db = getDataManager();
    
    db.getUser(req.user.email).then(user => {
        db.getProjects(req.user.email).then(projects => {
            res.render("profile.ejs", {username: req.user.email, userStats: user.stats, projects: projects});
        });
    });
});

router.post("/deleteProject", (req, res) => {
    const db = getDataManager();

    db.getProject(req.body.projectId).then(project => {
        if (project.ownerUsername == req.user.email)
        {
            db.deleteProject(project.id);
            db.leaveProject(req.user.email, project.id);
        }
        else
            res.sendStatus(404);
        res.redirect("/profile");
    });
});

router.post("/leaveProject", (req, res) => {
    const db = getDataManager();

    db.getProject(req.body.projectId).then(project => {
        db.getUser(req.user.email).then(user => {
            if (user.projects.find(q => q == project.id) != undefined){
                db.leaveProject(req.user.email, project.id);
            }
            res.redirect("/profile");
        }).catch(() => {
            res.redirect("/profile");
        });
    }).catch(() => {
        res.redirect("/profile");
    });
});

router.post("/changePassword", (req, res) => {
    //Send email to user requiring with a unique link that allows them to change their password
    res.sendStatus(200);
});

export default router;