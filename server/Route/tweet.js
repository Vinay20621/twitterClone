//feed
const express=require('express')
const User=require('../models/user')
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Tweet=require('../models/tweet')
const Comment=require('../models/comment')

const router=express.Router()
router.get("/", async (req, res) => {
    const token = req.headers["x-access-token"];
  
    const tweetsToSkip = req.query.t || 0;
  
    try {
      const decoded = jwt.verify(token, "newSecretKey");
      const username = decoded.username;
      const user = await User.findOne({ username: username });
      Tweet.find({ isRetweeted: false })
        .populate("postedBy")
        .populate("comments")
        .sort({ createdAt: -1 })
        .skip(tweetsToSkip)
        .limit(20)
        .exec((err, docs) => {
          if (!err) {
            //to know if a person has liked tweet
            docs.forEach((doc) => {
              if (!doc.likes.includes(username)) {
                doc.likeTweetBtn = "black";
                doc.save();
              } else {
                doc.likeTweetBtn = "deeppink";
                doc.save();
              }
            });
  
            //to know if a person has liked comment
            docs.forEach((doc) => {
              doc.comments.forEach((docComment) => {
                if (!docComment.likes.includes(username)) {
                  docComment.likeCommentBtn = "black";
                  docComment.save();
                } else {
                  docComment.likeCommentBtn = "deeppink";
                  docComment.save();
                }
              });
            });
  
            //to know if a person has retweeted the tweet
            docs.forEach((doc) => {
              if (!doc.retweets.includes(username)) {
                doc.retweetBtn = "black";
              } else {
                doc.retweetBtn = "green";
              }
            });
  
            return res.json({
              status: "ok",
              tweets: docs,
              activeUser: user,
            });
          }
        });
    } catch (error) {
      return res.json({ status: "error", error: "Session ended :(" });
    }
  });
  
  //populate comments of a particular tweet
  router.get("/comments/:tweetId", (req, res) => {
    Tweet.find({ postedTweetTime: req.params.tweetId })
      .populate("postedBy")
  
      .populate({
        path: "comments",
        populate: [{ path: "postedBy" }],
      })
      .exec((err, tweet) => {
        if (!err) {
          return res.json({
            status: "ok",
            tweet: tweet,
          });
        } else return res.json({ status: "error", error: "comments not found" });
      });
  });
  module.exports=router