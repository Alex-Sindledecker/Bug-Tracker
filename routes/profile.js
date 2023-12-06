import express from "express";
import {getDataManager} from "../database.js";

let router = express.Router();

router.use((req, res, next) => {
    if (req.isAuthenticated())
        next();
    else if (req.method == "GET")
        res.redirect("/login");
    else
        res.sendStatus(403);
});

router.get("/", (req, res) => {
    const db = getDataManager();
    db.getUser(req.user.email).then(user => {
        res.render("profile.ejs", {username: req.user.email, userStats: user.stats});
    });
});

router.post("/changePassword", (req, res) => {
    //Send email to user requiring with a unique link that allows them to change their password
    res.sendStatus(200);
});

export default router;