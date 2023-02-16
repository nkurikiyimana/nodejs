const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  //likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});



const Comment = mongoose.model("Comment", commentSchema);

module.exports =  Comment; 