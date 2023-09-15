const express=require('express')
const User=require('../models/user')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const router=express.Router()
router.post("/", (req, res) => {
    const userLogin = req.body;
    User.findOne({ username: userLogin.username }).then((dbUser) => {
      if (!dbUser) {
        return res.json({
          status: "error",
          error: "Invalid login",
        });
      }
      bcrypt.compare(userLogin.password, dbUser.password).then((isCorrect) => {
        if (isCorrect) {
          const payload = {
            id: dbUser._id,
            username: dbUser.username,
          };
          const token = jwt.sign(payload, "newSecretKey", { expiresIn: 86400 });
          return res.json({ status: "ok", user: token });
        } else {
          return res.json({ status: "error", user: false });
        }
      });
    });
  });
  
  //sign up
  router.post("/signup", async (req, res) => {
    const user = req.body;
    const takenUsername = await User.findOne({ username: user.username });
  
    if (takenUsername) {
      return res.json({ status: "error", error: "username already taken" });
    } else {
      user.password = await bcrypt.hash(req.body.password, 10);
  
      const dbUser = new User({
        username: user.username,
        password: user.password,
        avatar: "initial-avatar.png",
      });
  
      dbUser.save();
      return res.json({ status: "ok" });
    }
  });
  

  // search page
  router.get("/search/:user", (req, res) => {
    // console.log(req.params.user);
    User.find(
      { username: { $regex: `${req.params.user}`, $options: "i" } },
      function (err, docs) {
        if (!err) {
          return res.json({ status: "ok", users: docs });
        } else return res.json({ status: "error", error: err });
      }
    );
  });
    // search page
    
 
  module.exports=router
  