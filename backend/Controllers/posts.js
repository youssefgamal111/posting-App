const Post=require("../models/post");

 exports.createPost=(req, res, next) => {
    const ipath=req.protocol+"://"+req.get('host')+"/images/"+req.file.filename;
    const post = new Post({title:req.body.title,content:req.body.content,
    imagepath:ipath,creator:req.userdata.id});
    post.save()
    .then(result=>
        {
      res.status(201).json({
        message: 'Post added successfully',
        post:{...result,
          id:result._id}
        });
        }
        )
     }
 exports.updatePost=(req,res)=>{
    let ipath;
    if(req.file){
      //update with new file
       ipath=req.protocol+"://"+req.get('host')+"/images/"+req.file.filename;
  
    }
    else{
      ipath=req.body.imagepath;
    }
    const post=new Post({
      _id:req.body.id,
      title:req.body.title,
      content:req.body.content,
      imagepath:ipath
    });
        console.log(post);
        Post.updateOne({_id:req.params.id,creator:req.userdata.id},post)
        .then(result=>{
          if(result.modifiedCount===0){
            return res.status(401).json({
              message:"user are not authorized to edit this post"
             });
          }
          res.status(200).json({
           imagepath:ipath
          });
        });
      }
exports.deletePost=(req,res)=>{
    const id=req.params.id;
      Post.deleteOne({_id:id,creator:req.userdata.id}).then(result=>{
       if(result.deletedCount>0)
        {res
        .status(204)
        .json({message:"Post deleted"});
        }
        else {
          res
        .status(401)
        .json({message:"you cant not delete others posts"});
        }
      })
  }
exports.getPostById=(req,res)=>{
    Post.findById({_id:req.params.id})
    .then(document=>{
      res.status(200)
      .json(
      {message:"post fetched",
      post:document});
                  })
  }
  
exports.getPosts=(req, res,) => {
    let posts;
    const pageSize=+req.query.pagesize;
    const currentPage=+req.query.currentpage;
    const postQery=Post.find();
    if(pageSize&&currentPage){
      postQery
      .skip(pageSize*(currentPage-1))
      .limit(pageSize);
    }
    postQery
    .then(documents=>
      {posts=documents;
        return Post.count();//return new promise ;)
      })
    .then(count=>{
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: posts,
        postcount:count
      });
    })
  }  