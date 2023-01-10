const express=require("express");
const router=express.Router();
const Post=require("../models/post");
const multer=require("multer");
const authorize=require("../middlewares/checkAuthentication");

const MIME_TYPE_MAP={
  "image/png":"png",
  "image/jng":"jpg",
  "image/jpg":"jpg",

}

const storage=multer.diskStorage({
  destination:(req,file,cb)=>{
    const isvalid=MIME_TYPE_MAP[file.mimetype];
    let error=null;
    if(!isvalid){
      error=new Error("Invalid mime Type");
    }
    cb(error,"images");//from the location of the server as route will called from server
  },
  filename:(req,file,cb)=>{
    const name=file.fieldname.toLowerCase().split('').join('-');
    const extension=MIME_TYPE_MAP[file.mimetype];
    cb(null,name+'-'+Date.now()+'.'+extension);
  }
});

router.put("/:id",multer({storage:storage}).single("image"),(req,res)=>{
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
      Post.updateOne({_id:req.params.id},post)
      .then((err,docs)=>
        res.status(200).json({
         err:err,
         imagepath:ipath
        }));
    })

    router.post("",authorize,multer({storage:storage}).single("image"),(req, res, next) => {
      const ipath=req.protocol+"://"+req.get('host')+"/images/"+req.file.filename;
      console.log(ipath);
      const post = new Post({title:req.body.title,content:req.body.content,imagepath:ipath});
      post.save().then(result=>{
        res.status(201).json({
          message: 'Post added successfully',
          post:{...result,
            id:result._id}
         
        });
      })
    
    });

    router.delete("/:id",authorize,(req,res)=>{
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
    
      
    });

    module.exports=router;