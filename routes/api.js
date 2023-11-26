import express from "express";
import { getDataManager, getDatabase } from "../database.js";

const router = express.Router();

//CRUD API for database

router.get("/", (req, res) => {
    res.json(JSON.stringify({hello: "world"}));
});

//Gets a user, expects username
router.get("/user/:username", (req, res) => {
    getDatabase().getUser(req.params.username).then(user => {
        res.send(JSON.stringify(user));
    });
});

//Creates a new user, expects username and password
router.post("/user", (req, res) => {
    getDatabase().addUser(req.body.username, req.body.password).then(user => {
        res.send(JSON.stringify(user));
    });
});

export default router;