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

//Middleware that verifies that the user is authenticated and that they are allowed to access the project with the given id
function userVerificationMiddleware(req, res, next){
    const db = getDataManager();

    db.getProjects(req.user.email).then(projects => {
        console.log(req.params.id);
        console.log(projects);
        if (projects.find(p => p.id == req.params.id) == undefined){
            res.status(404).render("not-found-404.ejs", {username: req.user.email, message: "<h1>The requested project could not be found<br/>Or you are not authorized to access this project!</h1><a href='/home'>Return Home</a>"});
        } else {
            next();
        }
    });
}

//https://localhost:3000/project/id
router.get("/:id", userVerificationMiddleware, async (req, res) => {
    const db = getDataManager();

    const project = await db.getProject(req.params.id);
    const bugs = await db.getBugs(project.id);

    res.render("project.ejs", {username: req.user.email, project: project, bugs: bugs, archivePage: false, isProjectOwner: project.ownerUsername == req.user.email});
});

//https://localhost:3000/project/id/archive
router.post("/:id/archive", userVerificationMiddleware, async (req, res) => {
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
});

//https://localhost:3000/project/id/archive
router.get("/:id/archive", userVerificationMiddleware, async (req, res) => {
    const db = getDataManager();

    try{
        const project = await db.getProject(req.params.id);
        const bugs = await db.getArchivedBugs(project.id);

        res.render("project.ejs", {username: req.user.email, project: project, bugs: bugs, archivePage: true, isProjectOwner: project.ownerUsername == req.user.email});
    } catch (error){
        console.log(error.message);
        res.status(404).render("not-found-404.ejs");
    }
});

//https://localhost:3000/project/id/restore
router.post("/:id/restore", userVerificationMiddleware, async (req, res) => {
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
});

//https://localhost:3000/project/id/delete
router.post("/:id/delete", userVerificationMiddleware, async (req, res) => {
    const db = getDataManager();

    const bugId = req.body.id;

    try{
        await db.deleteBug(bugId);

        res.sendStatus(200);
    } catch (error){
        console.log(error.message);
        res.sendStatus(404);
    }
});

//https://localhost:3000/project/id/new
router.post("/:id/new", userVerificationMiddleware, async (req, res) => {
    const db = getDataManager();

    const projectId = req.params.id;
    const dataModel = {
        level: Number.parseInt(req.body.level),
        name: req.body.name,
        description: req.body.description
    }
    //TODO: request validation
    await db.createBug(projectId, dataModel.name, dataModel.description, dataModel.level, req.user.email);

    res.redirect("/project/" + projectId);
});

router.post("/:id/share", userVerificationMiddleware, async (req, res) => {
    //Verify user is authenticated
    const db = getDataManager();

    const projectId = req.params.id;
    const targetUsername = req.body.email;
    
    const targetUser = await db.getUser(targetUsername);
    const projectShares = await db.getPendingProjects(targetUsername);

    const targetUserIsNotNull = targetUser != null;
    const targetUserHasProject = targetUser.projects.includes(projectId);
    const projectAlreadyShared = projectShares.find(p => p.id == projectId) != undefined;
    const authedUserOwnsProject = req.user.email == (await db.getProject(projectId)).ownerUsername;

    //Ensure target user exists before sharing, that the target user doesn't already have access to that project, that the project isn't pending with the target user,
    //and that the authenticated user is the owner of the project
    if (targetUserIsNotNull == true && targetUserHasProject == false && projectAlreadyShared == false && authedUserOwnsProject == true) {

        db.shareProject(projectId, targetUsername).then(p => {
            if (p == null)
                res.sendStatus(500);
            else
                res.status(200).send(JSON.stringify({sharedWith: targetUsername}));
        });
    } else if (targetUser != null) {
        res.status(200).send(JSON.stringify({error: "This project has already been shared with that user, or is currently pending with that user..."}));
    } else {
        res.status(200).send(JSON.stringify({error: "User not found!"}));
    }
});

router.post("/:id/join", async (req, res) => {
    const db = getDataManager();

    const username = req.user.email;
    const projectId = req.params.id;

    await db.giveProjectAccess(projectId, username);
    await db.deleteProjectInvite(projectId, username);

    res.redirect(`/project/${projectId}/`);
});

router.post("/:id/decline", (req, res) => {
    const db = getDataManager();

    const username = req.user.email;
    const projectId = req.params.id;

    db.deleteProjectInvite(projectId, username);

    res.redirect("/home");
})

export default router;