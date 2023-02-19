
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
/*
const jwt = require("jsonwebtoken");
function authToken(req, res, next){
  const auth = req.headers["authorisation"]
  const token = auth && auth.split('')[1]
  if(token == null) return res.sendStatus(401).send({ err0r:"auth header is missing"})
 jwt.verify(token,(err,user)=> {
  if(err)  return res.sendStatus(403)
  req.user = user
  next()
})
}  
*/
module.exports= admin