import express from "express";
import {getDataManager} from "../database.js";

let router = express.Router();

router.get("/", (req, res) => {
    if (req.isAuthenticated()){
        const db = getDataManager();
        db.getUser(req.user.email).then(user => {
            res.render("profile.ejs", {username: req.user.email, userStats: user.stats});
        });
    }
    else
        res.redirect("/login");
});

router.post("/changePassword", (req, res) => {
    if (req.isAuthenticated()){
        //Send email to user requiring with a unique link that allows them to change their password
        res.sendStatus(200);
    }
});

export default router;