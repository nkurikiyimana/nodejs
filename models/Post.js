
const { object } = require("@hapi/joi");
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  image: String,
  content: String,
  comments: {type: [String],default:[]},
  likes: {type: [String],default:[]}
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

