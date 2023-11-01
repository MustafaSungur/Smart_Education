const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");

const pageRoute = require("./routes/pageRoute");
const courseRoute = require("./routes/courseRoute");
const categoryRoute = require("./routes/categoryRoute");
const authRoute = require("./routes/authRoute");

const app = express();

// CONNECT DATABASE
mongoose.connect("mongodb://localhost:27017/smart-edu-test").then(() => {
  console.log("Connected to MongoDB");
});

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDLLEWARE
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use("/", pageRoute);
app.use("/courses", courseRoute);
app.use("/categories", categoryRoute);
app.use("/auth", authRoute);
const port = 3000;
app.listen(port, () => {
  console.log(`App started on port ${port}`);
});
