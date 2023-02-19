const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const schema = mongoose.Schema({
  fName: String,
  lName: String,
  email: String,
  password: String
});


module.exports = mongoose.model("Signup", schema);