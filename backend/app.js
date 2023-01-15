const path=require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const postRoutes=require("./routes/posts");
const userRoutes=require("./routes/users");
require('dotenv').config();
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://youssefgamal:"+process.env.mongo_atlas_pass+"@cluster0.5tfzpkm.mongodb.net/?retryWrites=true&w=majority")
.then(()=>console.log("connected successfully"))
.catch(()=>console.log("connected failed"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images",express.static(path.join(__dirname,"/images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );
  next();
});
app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);
module.exports = app;
