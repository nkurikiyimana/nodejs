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

const Comment = require("./models/comment");
const Like = require("./models/like");
const routes = express();

const Joi = require("@hapi/joi");
/*
//protect my end user
routes.use(async (req, res, next) => {
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
*/

// Define the validation schema for a new post
const postSchema = Joi.object({
  title: Joi.string().required(),
  image: Joi.string().required(),
  content: Joi.string().required(),
});

routes.post("/posts", async (req, res) => {
  const { error } = postSchema.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const post = new Post({
    title: req.body.title,
    image: req.body.image,
    content: req.body.content,
  });
  await post.save();
  res.send(post);
});

//acess Swagger Documentation


/**
 * @swagger
 *  components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      schemas:
 *          Post:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  title:
 *                      type: string
 *                  img:
 *                      type: string
 *                  content:
 *                      type: string   
 *                  likes:
 *                      type: array
 *                  comments:
 *                      type: array
 */


/**
 * @swagger
 * /api/posts:
 *  get:
 *      summary: To get all blogs from mongoDB
 *      description: This api is used to fetch all blog data from mongoDB
 *      responses:
 *          200:
 *              description: This api is used to fetch all blog data from mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Post'
 */
//Get all post
routes.get("/posts", async (req, res) => {
  const posts = await Post.find().populate("comments").populate("likes");
  res.status(200).json(posts);
});
//Swagger documentation post

/**
 * @swagger
 * /api/posts:
 *  post:
 *      summary: To add blog in mongoDB
 *      description: This api is used to add blog in mongoDB
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Post'
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used to add blog in mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Post'
 */


routes.post("/posts", async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      image: req.body.image,
      content: req.body.content,
    });
    await post.save();
    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error saving post to database" });
  }
});

//swagger documentation Get by Id


/**
 * @swagger
 * /api/posts/{id}:
 *  get:
 *      summary: To get blog of specified id from mongoDB
 *      description: This api is used to fetch blog data of specified id from mongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *      responses:
 *          200:
 *              description: This api is used to fetch blog data of specified id from mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Post'
 */



// grab individual post


routes.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch {
    res.status(404);
    res.send({ error: "Post doesn't exist!" });
  }
});

//Swagger documentation

/**
 * @swagger
 * /api/posts/{id}:
 *  patch:
 *      summary: To update blog of specified id in mongoDB
 *      description: This api is used to update blog data of specified id in mongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: AlphaNumeric ID required
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Blog'
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used to update blog data of specified id in mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Post'
 */



routes.patch("/posts/:id", async (req, res) => {
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

//swagger Delete Documentation

/**
 * @swagger
 * /api/posts/{id}:
 *  delete:
 *      summary: To delete blog of specified id from mongoDB
 *      description: This api is used to delete blog of specified id from mongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: blog deleted successfully
 */

routes.delete("/posts/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404).json({message: "Post doesn't exist!" });
  }
});

// Define the validation schema for a new contact

const contactSchema = Joi.object().keys({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().min(5).required(),
  message: Joi.string().min(10).required(),
});

routes.post("/contact", async (req, res) => {
  const { error } = contactSchema.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  await contact.save();
  res.send(contact);
});

//contact

routes.get("/Contact", async (req, res) => {
  const contact = await Contact.find();
  res.send(contact);
});

routes.post("/Contact", async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  await contact.save();
  res.send(contact);
});

routes.get("/Contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id });
    res.send(contact);
  } catch {
    res.status(404);
    res.send({ error: "Message doesn't exist!" });
  }
});

routes.patch("/Contact/:id", async (req, res) => {
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

routes.delete("/Contact/:id", async (req, res) => {
  try {
    await Contact.deleteOne({ _id: req.params.id });
    res.status(204).send();
  } catch {
    res.status(404);
    res.send({ error: " Done!" });
  }
});

// Define the validation schema for a new Signup user

const signupSchema = Joi.object().keys({
  fName: Joi.string().min(3).required(),
  lName: Joi.string().min(3).required(),
  email: Joi.string().email().min(5).required(),
  password: Joi.string()
    .min(8)
    .max(30)
    .regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    .required(),
});

routes.post("/signup", async (req, res) => {
  const { error } = signupSchema.validate(req.body);

  if (error) {
    res.status(400).send({ error: error.details[0].message });
    return;
  }

  const signup = new Signup({
    fName: req.body.fName,
    lName: req.body.lName,
    email: req.body.email,
    password: req.body.password,
  });
  await signup.save();
  res.send(signup);
});

//Add new user

routes.post("/Signup", async (req, res) => {
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
    console.log("Generated token:", token);
    res.json({ message: "Signup Successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Access web site!

routes.post("/login", async (req, res) => {
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

// Create a comment

// Create a comment
routes.post("/comments", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: req.body.comment },
  });
  res.status(200).json({ message: "comment Added Successful" });
});

// Read all comments
routes.get("/comments", async (req, res) => {
  const comments = await Comment.find().sort({ created: -1 });
  res.send(comments);
});

// Read all comments specific to a blog
routes.get("/comments/post/:postId", async (req, res) => {
  const comments = await Comment.find({ postId: req.params.postId }).sort({
    created: -1,
  });
  res.send(comments);
});

// Read a specific comment by id
routes.get("/comments/:id", async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  res.send(comment);
});

// Update a specific comment by id
routes.patch("/comments/:id", async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });nodemon

  res.send(comment);
});

// Delete a specific comment by id
routes.delete("/comments/:id", async (req, res) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);
  res.send(comment);
});

// Add a like to a specific comment
routes.post("/Like/:id", async (req, res) => {
  const userid = tokenid;
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: userid },
    });

    res.status(200).json({ message: "Like Added!" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});

const request = require('request');

const url = 'https://jsonplaceholder.typicode.com/posts';

request(url, function(error, response, body) {
  if (error) {
    console.error('Error:', error);
  } else if (response.statusCode !== 200) {
    console.error('Invalid status code:', response.statusCode);
  } else {
    const posts = JSON.parse(body);
    for (let i = 0; i < posts.length; i++) {
      console.log(`Post ${i}: ${posts[i].title}`);
    }
  }
});

module.exports = routes;
