const likeSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" }
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;