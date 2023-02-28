const express = require("express");
const Post = require("./models/Post");
const jwt = require("jsonwebtoken");
const admin = require("./middleware/AdminAuth");
const bcrypt = require("bcryptjs");
//const Com = require("./models/comment");
const Contact = require("./models/Contact");
//const User = require("./models/User");
const Signup = require("./models/Signup");
const login = require("./models/login");

const Comment = require("./models/comment");
const routes = express();

const Joi = require("@hapi/joi");

//protect my end user
/*routes.use(async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "remember");
    const user = await Signup.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
});*/


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
 *      summary: To get all Blog Posts from From Mongodb
 *      description: This api is used to fetch all blog posts data from mongodb
 *      responses:
 *          200:
 *              description: This api is used to fetch all blog post data from mongodb
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
 *      summary:  adding blog Posts in mongodb
 *      description: This api is used to add blog post in mongodb
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
 *              description: This api is used to add blog POst in mongodb
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
    res.status(201).json(post); // Change status code to 201
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
 *      summary: To get Specific blog Post by id from mongodb
 *      description: This api is used to fetch blog post Data  of specified id from mongodb
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *      responses:
 *          200:
 *              description: This api is used to fetch blog data of specified id from mongodb
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
 *      summary: updating a blog Posts of specified id in mongodb
 *      description: This api is used for updating a blog Posts of specified id in mongodb
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
 *                      $ref: '#components/schemas/Post'
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used for updating a blog Posts of specified id in mongodb
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
 *      summary: deletins blog Posts of specified id from mongodb
 *      description: This api is used to delete blog post of specified id from mongoDB
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

//swagger documentation

/**
 * @swagger
 *  components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      schemas:
 *          Contact:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  email:
 *                      type: string
 *                  message:
 *                      type: string   
 *                 
 */

//contact

//Swagger documentation Get all contact
/**
 * @swagger
 * /api/Contact:
 *  get:
 *      summary:  geting all Contact message from mongoDB
 *      description: This api is used to fetch all Contact message data from mongoDB
 *      responses:
 *          200:
 *              description: This api is used to fetch all Contact message data from mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Contact'
 */

routes.get("/Contact", async (req, res) => {
  const contact = await Contact.find();
  res.send(contact);
});
//swagger documentation

/**
 * @swagger
 * /api/Contact:
 *  post:
 *      summary: adding Contact message in mongoDB
 *      description: This api is used to add Contact message in mongoDB
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Contact'
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: This api is used to add Contact message in mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Contact'
 */



routes.post("/Contact", async (req, res) => {
  const contact = new Contact({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
  await contact.save();
  res.status(200).json(contact);
});

//Swagger documentation Get contact by Id



/**
 * @swagger
 * /api/Contact/{id}:
 *  get:
 *      summary: To get blog of specified id from mongoDB
 *      description: This api is used to fetch Contact message data of specified id from mongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *      responses:
 *          200:
 *              description: This api is used to fetch Contact message data of specified id from mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Contact'
 */




routes.get("/Contact/:id", async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id });
    res.status(200).send(contact)
  } catch {
    res.status(404);
    res.send({ error: "Message doesn't exist!" });
  }
});

// Swagger Documentation Update contact


/**
 * @swagger
 * /api/Contact/{id}:
 *  patch:
 *      summary: updating Contact message of specified id in mongoDB
 *      description: This api is used to update Contact message data of specified id in mongoDB
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
 *                      $ref: '#components/schemas/Contact'
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
 *                              $ref: '#components/schemas/Contact'
 */





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
    res.status(200).json("Contact uptated successful");
  } catch {
    res.status(404);
    res.send({ error: "update doesn't exist!" });
  }
});

//Swagger Documentation Delete Contact


/**
 * @swagger
 * /api/Contact/{id}:
 *  delete:
 *      summary: deleting Contact message of specified id from mongoDB
 *      description: This api is used to delete Contact message of specified id from mongoDB
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


routes.delete("/Contact/:id", async (req, res) => {
  try {
    await Contact.deleteOne({ _id: req.params.id });
    res.status(204).json("Querry message Deleted Successful");
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

//Swagger documentation Schma Signup


/**
 * @swagger
 *  components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      schemas:
 *          Signup:
 *              type: object
 *              properties:
 *                  _id:
 *                      type: string
 *                  fName:
 *                      type: string
 *                  lName:
 *                      type: string
 *                  email:
 *                      type: string   
 *                  password:
 *                      type: String
 *                 
 */


//Swagger Documentation Signup Add new user

/**
 * @swagger
 * /api/Signup:
 *  post:
 *      summary: Adding new user
 *      description: This api is used to add New user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/Signup'
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
 *                              $ref: '#components/schemas/Signup'
 */


routes.post("/Signup", async (req, res) => {
  try {
    const { fName, lName, email, password } = req.body;
    //hash password
    const hashedpassword = await bcrypt.hash(password, 12);
    const user = await Signup.create({
      fName,
      lName,
      email,
      password: hashedpassword,
    });

    const token = jwt.sign({ id: user._id }, "remember");
    res.status(200).json({ message: "Signup Successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login for Accessing new user!

/**
 * @swagger
 *  components:
 *      securitySchemes:
 *          bearerAuth:
 *              type: http
 *              scheme: bearer
 *              bearerFormat: JWT
 *      schemas:
 *         login:
 *              type: object
 *              properties:
 *                email:
 *                      type: string  
 *                password:
 *                      type: String
 *                 
 */


//Swagger Documentation Sigin ew user

/**
 * @swagger
 * /api/login:
 *  post:
 *      summary:  user login
 *      description: This api is used by new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/login'
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
 *                              $ref: '#components/schemas/login'
 */



routes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Signup.findOne({ email });
    const ismuch = await bcrypt.compare(password, user.password);
    if (!ismuch) res.status(200).json({ message: "Login Succeful!" });
    const token = jwt.sign({ id: user._id }, "remember");
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a comment
//Swagger documentation Schma Comments


/* @swagger
* /api/Like/{id}:
*  post:
*      summary: To add like on blog of specified id in mongodb
*      description: This api is used to add like on blog of specified id in mongodb
*      parameters:
*          - in: path
*            name: id
*            required: true
*            description: AlphaNumeric ID required
*      security:
*          - bearerAuth: []
*      responses:
*          200:
*              description: Blog has been liked!
 */

/**
 * @swagger
 * /api/Comments/{id}:
 *  post:
 *      summary: adding comments to the Specified Blog in mongoDB
 *      description: This api is used to add comment data in mongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: AlphaNumeric ID required
 *      security:
 *          - bearerAuth: []
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#components/schemas/comment'
 *      responses:
 *          200:
 *              description: This api is used to add comment data in mongoDB
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/comment'
 */

//Swagger Documentation Comments

// Create a comment
routes.post("/comments/:id", async (req, res) => {
  console.log(req.params.id);
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: req.body.comment },
  });
  res.status(200).json({ message: "comment Added Successful" });
});



//Swagger documentation Schma Like

/**
 * @swagger
 * /api/Like/{id}:
 *  post:
 *      summary: commenting blog post of specified id from mongoDB
 *      description: This api is used to  of specified id from mongoDB
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            description: Numeric ID required
 *      security:
 *          - bearerAuth: []
 *      responses:
 *          200:
 *              description: Comments blog Added successfully
 */

routes.post("/Like/:id", async (req, res) => {
  console.log(req.params.id)
  const userid = req.id;
  console.log(req.id)
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $addToSet: { likes: userid },
    });

    res.status(200).json({ message: "Like Added!" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
});



module.exports = routes;
