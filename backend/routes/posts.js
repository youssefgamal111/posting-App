const express=require("express");
const router=express.Router();
const checkAuthentication = require("../middlewares/checkAuthentication");
const extractFile = require("../middlewares/multerFile");
const postController=require("../Controllers/posts")

router.put("/:id",checkAuthentication,extractFile,postController.updatePost)

router.post("",checkAuthentication,extractFile,postController.createPost);

router.delete("/:id",checkAuthentication,postController.deletePost);

router.get("/:id",postController.getPostById)
    
router.get("",postController.getPosts );

 module.exports=router;