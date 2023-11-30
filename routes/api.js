import express from "express";
import { getDataManager, getDatabase } from "../database.js";

const router = express.Router();

//CRUD API for database

router.get("/", (req, res) => {
    res.json(JSON.stringify({hello: "world"}));
});

//Gets a user, expects username
router.get("/user/", (req, res) => {
    console.log("Query username: ", req.query.username);
    console.log("Authed? " + req.isAuthenticated());
    if (req.isAuthenticated() && req.query.username === req.user.email){
        getDatabase().getUser(req.query.username).then(user => {
            res.send(JSON.stringify(user));
        });
    } else {
        res.status(403).send("{}");
    }
});

//Creates a new user, expects username and password
router.post("/user", (req, res) => {
    getDatabase().addUser(req.body.username, req.body.password).then(user => {
        res.send(JSON.stringify(user));
    });
});

router.delete("/user", (req, res) => {
    if (req.isAuthenticated()){
        getDatabase().deleteUser(req.user.email).then(result => {
            if (result === true)
                res.sendStatus(200);
            else
                res.sendStatus(500);
        });
    } else {
        res.sendStatus(403);
    }
});

export default router;