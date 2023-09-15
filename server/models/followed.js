const mongoose = require('mongoose');
const User=require('./user')

const followerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
  follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  createdAt: { type: Date, default: Date.now },
});

const Follower = mongoose.model('Follower', followerSchema);

module.exports = Follower;