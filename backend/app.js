const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://youssefgamal:LR7EP4QYriDvy0cb@cluster0.i4xkmms.mongodb.net/test?retryWrites=true&w=majority")
.then(()=>console.log("connected successfully"))
.catch(()=>console.log("connection to the database failed"));
const Post=require("./models/post");
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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({title:req.body.title,content:req.body.content});
  console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});
app.delete("/api/posts/:id",(req,res)=>{
  const id=req.params.id;
    Post.deleteOne({_id:id}).then(result=>{
      console.log(result);
      res
      .status(204)
      .json({message:"Post deleted"});
    })
});
app.get("/api/posts", (req, res, next) => {
  Post.find().
  then(documents=>{
    const posts=documents;
    res.status(200).json({
      message: "Posts fetched successfully!",
      posts: posts
    });

  });
  
});

module.exports = app;
