import express from "express";
import passport from "passport";
import __dirname from "../__dirname.js";

const router = express.Router();

//https://localhost:3000/login/
router.get("/", (req, res) => {
    if (req.isAuthenticated())
        res.redirect("/");
    else
        res.render(__dirname + "/views/login.ejs");
});

//https://localhost:3000/login/
router.post("/", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureMessage: true
}));

export default router;