

const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
});



const Comment = mongoose.model("Comment", commentSchema);

module.exports =  Comment;







/*const mongoose = require("mongoose");

const schema = mongoose.Schema({
  userid: String,
postid: String,
comment: String

});

module.exports = mongoose.model("comment", schema);*/