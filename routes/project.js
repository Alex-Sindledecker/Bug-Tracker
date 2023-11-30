import express from "express";
import { getDataManager } from "../database.js";

const router = express.Router();

//https://localhost:3000/project/id
router.get("/:id", async (req, res) => {
    if (req.isAuthenticated()){
        try{
            const db = getDataManager();

            const project = await db.getProject(req.params.id);
            const bugs = await db.getBugs(project.id);

            res.render("project.ejs", {username: req.user.email, project: project, bugs: bugs, archivePage: false});
        } catch (error){
            console.log(error.message);
            res.status(404).render("not-found-404.ejs");
        }

    } else {
        res.redirect("/login");
    }
});

//https://localhost:3000/project/id/archive
router.post("/:id/archive", async (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const projectId = req.params.id;
        const bugId = req.body.id;

        try{
            await db.archiveBug(bugId);

            res.sendStatus(200);
        }
        catch (error){
            console.log(error.message);
            res.sendStatus(404);
        }
    } else {
        res.redirect("/login");
    }
});

//https://localhost:3000/project/id/archive
router.get("/:id/archive", async (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        try{
            const project = await db.getProject(req.params.id);
            const bugs = await db.getArchivedBugs(project.id);

            res.render("project.ejs", {username: req.user.email, project: project, bugs: bugs, archivePage: true});
        } catch (error){
            console.log(error.message);
            res.status(404).render("not-found-404.ejs");
        }
    } else {
        res.redirect("/login");
    }
});

//https://localhost:3000/project/id/restore
router.post("/:id/restore", async (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const projectId = req.params.id;
        const bugId = req.body.id;

        try{
            await db.unarchiveBug(bugId);

            res.sendStatus(200);
        }
        catch (error){
            console.log(error.message);
            res.sendStatus(404);
        }

    } else {
        res.redirect("/login");
    }
});

//https://localhost:3000/project/id/delete
router.post("/:id/delete", async (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const bugId = req.body.id;

        try{
            await db.deleteBug(bugId);

            res.sendStatus(200);
        } catch (error){
            console.log(error.message);
            res.sendStatus(404);
        }

    } else {
        res.redirect("/login");
    }
});

//https://localhost:3000/project/id/new
router.post("/:id/new", async (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const projectId = req.params.id;
        const dataModel = {
            level: Number.parseInt(req.body.level),
            name: req.body.name,
            description: req.body.description
        }
        //TODO: request validation
        await db.createBug(projectId, dataModel.name, dataModel.description, dataModel.level);

        res.redirect("/project/" + projectId);

    } else {
        res.redirect("/login");
    }
});

router.post("/:id/share", (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const projectId = req.params.id;
        const targetUsername = req.body.email;
        
        //TODO: Verify that target username exists and that the authenticated user is allowed to share this project
        
        db.shareProject(projectId, targetUsername).then(p => {
            if (p == null)
                res.sendStatus(500);
            else
                res.sendStatus(200);
        })
    }
});

router.post("/:id/join", (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const username = req.user.email;
        const projectId = req.params.id;

        db.giveProjectAccess(projectId, username);
        db.deleteProjectInvite(projectId, username);

        res.redirect(`/project/${projectId}/`);
    }else{
        res.sendStatus(403);
    }
});

router.post("/:id/decline", (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();

        const username = req.user.email;
        const projectId = req.params.id;

        db.deleteProjectInvite(projectId, username);

        res.redirect("/home");
    }else{
        res.sendStatus(403);
    }
})

export default router;