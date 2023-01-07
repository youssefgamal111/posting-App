const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const postRoutes=require("./routes/posts");
const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://youssefgamal:LR7EP4QYriDvy0cb@cluster0.7jvjww4.mongodb.net/?retryWrites=true&w=majority")
.then(()=>console.log("connected successfully"))
.catch(()=>console.log("connection to the database failed"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use("/api/post",postRoutes);

module.exports = app;
