const express = require("express");
const authRoutes = express.Router();
const bcrypt = require('bcrypt');
const { UserModel } = require("../models/authModel");
const jwt = require("jsonwebtoken");
const { authenticated } = require("../middlewares/authenticated");

authRoutes.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const auth = await new UserModel({ name, email, password: hash });
            auth.save();
            res.status(200).send({ "msg": "User Registered successfully" });
        });
    } catch (error) {
        res.status(400).send({ "msg": "registration canceled" });
    }
});

authRoutes.post("/login", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await UserModel.find({ email });
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, async (err, result) => {
                if (result === true) {
                    res.status(201).send({ "msg": "login succesfull", "token": jwt.sign({ userID: user[0]._id }, 'subodh') })
                } else {
                    res.status(400).send({ "msg": "login Failed" });
                }
            });
        }else{
            res.status(400).send({ "msg": "email not exists" });
        }
    } catch (error) {
        res.status(400).send({ "msg": "error exists" });
    }
})

authRoutes.get("/profile",authenticated, async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const userID = jwt.verify(token, "subodh").userID;

     try {
        const user = await UserModel.find({_id:userID});
        res.status(200).send(user);
     } catch (error) {
        res.status(400).send({ "msg": "error exists" });
     }
})

module.exports = { authRoutes };