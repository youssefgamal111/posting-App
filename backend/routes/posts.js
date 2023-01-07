const express=require("express");
const router=express.Router();
const Post=require("../models/post");

router.put("/:id",(req,res)=>{
    const post=new Post({
      _id:req.body.id,
      title:req.body.title,
      content:req.body.content
    });
      Post.updateOne({_id:req.params.id},post)
      .then((err,docs)=>
        res.status(200).json({
         err:err
        }));
    })

    router.post("", (req, res, next) => {
      const post = new Post({title:req.body.title,content:req.body.content});
      console.log(post);
      post.save().then(result=>{
        res.status(201).json({
          message: 'Post added successfully',
          id:result._id
        });
      })
    
    });

    router.delete("/:id",(req,res)=>{
      const id=req.params.id;
        Post.deleteOne({_id:id}).then(result=>{
          console.log(result);
          res
          .status(204)
          .json({message:"Post deleted"});
        })
    });
    router.get("/:id",(req,res)=>{
      Post.findById({_id:req.params.id})
      .then(document=>{
        res.status(200)
        .json(
        {message:"post fetched",
        post:document});
                    })
    })
    
    router.get("", (req, res, next) => {
      Post.find().
      then(documents=>{
        const posts=documents;
        res.status(200).json({
          message: "Posts fetched successfully!",
          posts: posts
        });
    
      });
      
    });

    module.exports=router;