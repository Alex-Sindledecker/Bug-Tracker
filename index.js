//Public imports (npm)
import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import bcrypt from "bcrypt";

//Local imports
import __dirname from "./__dirname.js";
import { isValidPassword } from "./data/data_validator.js";

//Routing imports 
import homeRoutes from "./routes/home.js";
import projectRoutes from "./routes/project.js";
import loginRoutes from "./routes/login.js";
import signupRoutes from "./routes/signup.js";
import profileRoutes from "./routes/profile.js";

import { connectDB, getDataManager } from "./database.js";

const port = 3000;
const app = express();

await connectDB();
let dataManager = getDataManager();

//Set the static (public) folder for ejs and setup body parser
app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended: true}));

//Session and cookie setup
app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false
}));

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

//Passport strategy
passport.use(new LocalStrategy(async (username, password, cb) => {
    const user = await dataManager.getUser(username);

    if (user == null)
        return cb(null, false, {message: `Could not find a user with username: ${username}`});

    //if (isValidPassword(password) == false)
    //    return cb(null, false, {message: "Password could not be validated"});

    bcrypt.compare(password, user.password, (err, result) => {
        if (err)
            return cb(err);
        if (result == false)
            return cb(null, false);

        return cb(null, user);
    });
}));

//Passport serialization and deserilization
passport.serializeUser((user, cb) => {
    cb(null, {
        email: user.username
    });
});
passport.deserializeUser((user, cb) => {
    cb(null, user);
});

//Routing
app.use("/home", homeRoutes);
app.use("/project", projectRoutes);
app.use("/login", loginRoutes);
app.use("/signup", signupRoutes);
app.use("/profile", profileRoutes);

//Index route
app.get("/", (req, res) => {
    if (req.isAuthenticated())
        res.render(__dirname + "/views/index.ejs", { username: req.user.email });
    else
        res.render(__dirname + "/views/index.ejs");
});

//Log the user out
app.get("/logout", (req, res) => {
    if (req.isAuthenticated()){
        req.logOut(err => {
            if (err) console.log(err);
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});

//Run the application
app.listen(port, () => {
    console.log("App running on port " + port);
});