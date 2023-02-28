const express = require("express");
const cors = require("cors");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const mongoose = require("mongoose"); // new
const routes = require("./routes");
mongoose.set("strictQuery", true);
// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://nkuru:test1234@my-brand.cwt5cow.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Faustin portfolio API",
      version: "1.0.0",
      description: "express portfolio API",
    },
    servers: [
      {
        url: "https://anxious-worm-outerwear.cyclic.app",
      },
    ],
  },

  apis: ["./routes.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // allow requests from all domains
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS"); // allow these HTTP methods
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization"); // allow these headers
  res.header("Access-Control-Allow-Credentials", true); // allow sending cookies
  next();
});

app.use(express.json());
app.use("/api", routes);

app.listen(3000, () => {
  console.log("Server has started!");
});

module.exports = app;
