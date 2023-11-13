import express from "express";
import bcrypt from "bcrypt";
import __dirname from "../__dirname.js";

const router = express.Router();
const saltRounds = 10; //For bcrypt hashing

//https://localhost:3000/signup/
router.get("/", (req, res) => {
    if (req.isAuthenticated()){
        return res.redirect("/");
    }

    res.render(__dirname + "/views/signup.ejs");
});

//https://localhost:3000/signup/
//Route for when the user posts their sign up info
router.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    //Validate username and password here

    //Validate that the user does not exist yet. If they do, redirect back to the signup page with the email currently in use
    if (await req.db.getUser(username) != null){
        res.render(__dirname + "/views/signup.ejs", {email: username});
    } else {
        //Create the new user.
        //Begin by hashing their password
        bcrypt.hash(password, saltRounds, (err, hash) => {
            //Create the user in the database with the given hash
            req.db.createNewUser(username, hash).then(user => {
                //If the user is succesfully created, log them into the current passport session and redirect them to the next page
                if (user != null){
                    req.login(user, err => {
                        if (err){
                            return res.redirect("/signup");
                        } else {
                            return res.redirect("/home");
                        }
                    });
                }
            });
        });
    }

});

export default router;