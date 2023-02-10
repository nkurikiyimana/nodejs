const express = require("express");
const mongoose = require("mongoose"); // new
const routes = require("./routes");
mongoose.set("strictQuery", true);
// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://nkuru:test1234@my-brand.cwt5cow.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const app = express();
app.use(express.json());
app.use("/api", routes);



app.listen(3000, () => {
  console.log("Server has started!");
});
