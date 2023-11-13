import express from "express";
import __dirname from "../__dirname.js";

const router = express.Router();

//https://localhost:3000/home/
router.get("/", (req, res) => {
    if (req.isAuthenticated()){
        req.db.getProjects(req.user.email).then(projects => {
            const ownerProjects = projects.filter(project => project.ownerUsername === req.user.email);
            const collabProjects = projects.filter(project => project.ownerUsername !== req.user.email);

            res.render(__dirname + "/views/home.ejs", {
                username: req.user.email, 
                ownerProjects: ownerProjects,
                collabProjects: collabProjects
            });
        });
    } else {
        res.redirect("/login");
    }
});

export default router;