const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const schema = mongoose.Schema({
  email: String,
  password: String 
  
});


/*schema.pre("save", async function (next){
  const user = this;
  if(!user.isModified("password")){
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  next();
});
*/
module.exports = mongoose.model("User", schema);