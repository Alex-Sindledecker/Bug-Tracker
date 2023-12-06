import express from "express";
import { getDataManager } from "../database.js";

const router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated())
        next();
    else if (req.method == "GET")
        res.redirect("/login");
    else
        res.sendStatus(403);
});

//https://localhost:3000/home/
router.get("/", (req, res) => {
    const db = getDataManager();

    db.getProjects(req.user.email).then(projects => {
        const ownerProjects = projects.filter(project => project.ownerUsername === req.user.email);
        const collabProjects = projects.filter(project => project.ownerUsername !== req.user.email);

        db.getPendingProjects(req.user.email).then(pendingProjects => {
            res.render("home.ejs", {
                username: req.user.email, 
                ownerProjects: ownerProjects,
                collabProjects: collabProjects,
                pendingProjects: pendingProjects
            });
        });
    });
});

router.post("/createProject", (req, res) => {
    const db = getDataManager();
    const name = req.body.name;
    const description = req.body.description;

    db.createProject(req.user.email, name, description).then(project => {
        db.giveProjectAccess(project.id, req.user.email).then(() => {
            res.redirect(`/project/${project.id}`);
        });
    });
});

export default router;
