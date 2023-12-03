import express from "express";
import { DataManager } from "../data/data_manager.js";

let router = express.Router();

router.get("/", (req, res) => {
    if (req.isAuthenticated())
        res.render("profile.ejs", {username: req.user.email});
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