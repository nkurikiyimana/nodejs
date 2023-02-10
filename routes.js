const express = require("express");
const Post = require("./models/Post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const admin = require("./middleware/AdminAuth");
//const Com = require("./models/comment");
const Contact = require("./models/Contact");
//const User = require("./models/User");
const Signup = require("./models/Signup");
const login = require("./login");

const router = express.Router();
//comment

router.use(async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "remember");
    const user = await Signup.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
});
/*
router.post("/comment/:id", async (req, res) => {
  const com = new Com({
    userid: req.user._id,
    postid: req.params.id,
    comment: req.body.comment,
  });
  await com.save();
  res.send(com);
}); 

/*router.post("/comment/:id", async (req, res) => {
  const adminid = req.id
  console.log(adminid)
  const com = new Com({
    userid: req.body.userid,
    postid: req.params.id,
    comment: req.body.comment,
  });
  await com.save();
  res.send(com);
});*/

//check comment
/*
router.post("/comment/:id", function(req, res, next) {
  admin(req, res, next);
}, async (req, res) => {
  try {
    const adminid = req.id
    console.log(adminid)
    
    if (!req.body.comment) {
      return res.status(400).send({ error: "Comment is required" });
    }
  
    const com = new Com({
      postid: req.params.id,
      comment: req.body.comment,
    });
    await com.save();
    res.send(com);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Could not save comment" });
  }
});*/


// Get all posts
router.use(async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "remember");
    const user = await Signup.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.get("/posts", async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

router.post("/posts", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
    user: req.user._id,
  });
  await post.save();
  res.send(post);
});



router.get("/posts",async (req, res) => {
  const posts = await Post.find();
  res.send(posts);
});

router.post("/posts", async (req, res) => {
  const adminid = req.id
  console.log(adminid)
  const post = new Post({
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
  });
  await post.save();
  res.send(post);
});

// grab individual post

router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

router.patch("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    if (req.body.title) {
      post.title = req.body.title;
    }

    if (req.body.image) {
      post.image = req.body.image;
    }

    if (req.body.content) {
      post.content = req.body.content;
    }

    await post.save();
    res.send(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

router.delete("/posts/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});


//contact
const Joi = require("@hapi/joi");

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  message: Joi.string().required(), 
});

router.post("/Contact", async (req, res) => {
  const { error } = contactSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  try {
    await contact.save();
    res.send(contact);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get("/Contact", async (req, res) => {
  const contact = await Contact.find();
  res.send(contact);
});

router.post("/Contact", async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  await contact.save();
  res.send(contact);
});

router.get("/Contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id });
    res.send(contact);
  } catch {
    res.status(404);
    res.send({ error: "Message doesn't exist!" });
  }
});

router.patch("/Contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id });

    if (req.body.name) {
      contact.name = req.body.name;
    }

    if (req.body.email) {
      contact.email = req.body.email;
    }

    if (req.body.message) {
      contact.message = req.body.message;
    }

    await contact.save();
    res.send(contact);
  } catch {
    res.status(404);
    res.send({ error: "update doesn't exist!" });
  }
});

router.delete("/Contact/:id", async (req, res) => {
  try {
    await Contact.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: " Done!" });
  }
});

/*
//User

router.get("/User", async (req, res) => {
  const user = await User.find();
  res.send(user);
});

router.post("/User", async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });
  await user.save();
  res.send(user);
});

//hashing my password

router.patch("/User/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    await user.save();
    res.send(user);
  } catch {
    res.status(404);
    res.send({ error: "update doesn't exist!" });
  }
});

router.delete("/User/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: " not One!" });
  }
});

//Sign up
//GET "/Sigup": This endpoint returns a list of all the user data in the database
router.get("/Sign", async (req, res) => {
  const sign = await Sign.find();
  res.send(sign);
});*/


router.post("/Signup", async (req, res) => {
  try {
    const { fName, lName, email, password } = req.body;
    //hash password
    const hashedpassword = await bcrypt.hash(password, 10);
    const user = await Signup.create({
      fName,
      lName,
      email,
      password: hashedpassword,
    });

    const token = jwt.sign({ id: user._id }, "remember");
    res.json({ message: "Signup Succeful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Signup.findOne({ email });
    const ismuch = await bcrypt.compare(password, user.password);
    if (!ismuch) res.status(400).json({ message: "paassword is not correct!" });
    const token = jwt.sign({ id: user._id }, "remember");
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;
