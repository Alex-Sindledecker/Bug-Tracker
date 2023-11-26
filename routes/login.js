import express from "express";
import passport from "passport";

const router = express.Router();

//https://localhost:3000/login/
router.get("/", (req, res) => {
    if (req.isAuthenticated())
        res.redirect("/");
    else
        res.render("login.ejs");
});

//https://localhost:3000/login/
router.post("/", passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureMessage: true
}));

export default router;