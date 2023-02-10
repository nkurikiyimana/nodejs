
const jwt = require("jsonwebtoken");
const admin = async(req, res , next)=>{
  if (!req.headers.authorization) {
    return res.status(401).send({ error: "Authorization header is missing" });
  }
  const Token = req.headers.authorization.split(" ")[1]
  let data = jwt.verify(Token,"remember" )
  req.id = data.id
  next()
} 
module.exports= admin