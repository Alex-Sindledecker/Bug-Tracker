import express from "express";
import __dirname from "../__dirname.js";

const router = express.Router();

//https://localhost:3000/home/
router.get("/", (req, res) => {
    if (req.isAuthenticated()){
        req.db.getProjects(req.user.email).then(projects => {
            const ownerProjects = projects.filter(project => project.ownerUsername === req.user.email);
            const collabProjects = projects.filter(project => project.ownerUsername !== req.user.email);

            req.db.getPendingProjects(req.user.email).then(pendingProjects => {
                console.log(pendingProjects);
                res.render(__dirname + "/views/home.ejs", {
                    username: req.user.email, 
                    ownerProjects: ownerProjects,
                    collabProjects: collabProjects,
                    pendingProjects: pendingProjects
                });
            });
        });
    } else {
        res.redirect("/login");
    }
});

router.post("/createProject", (req, res) => {
    if (req.isAuthenticated()){
        const name = req.body.name;
        const description = req.body.description;

        req.db.createProject(req.user.email, name, description).then(project => {
            req.db.giveProjectAccess(project.id, req.user.email).then(() => {
                res.redirect(`/project/${project.id}`);
            });
        });
    }else{
        res.sendStatus(403);
    }
});

export default router;