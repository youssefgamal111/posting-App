const express=require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const User=require("../models/user");
const jwt=require("jsonwebtoken");
router.post("/signup",(req,res)=>{
    bcrypt.hash(req.body.password,7)
    .then(hash=>{
        const user=new User({
        email:req.body.email,
        password:hash
                     });
         user.save()
         .then(
         result=>{
         res.status(201).json({message:"New User Added",user:result});
                         })
         .catch(err=>{
           res.status(500).json({err:err});
          });            
        });


    });

    router.post("/login",(req,res)=>{
        let fetchedUser;
        User.findOne({email:req.body.email})
        .then(user=>{
            if(user==null)
                return res.status(401).json({message:"wrong email"});
                fetchedUser=user;
            return bcrypt.compare(req.body.password,user.password)
        })
        .then(result2=>{
            if(!result2)
                return res.status(401).json({message:"wrong email or password"});
            const token=jwt.sign({email:fetchedUser.email,id:fetchedUser._id} ,"jgbmvmgrtkjrmjtr",{expiresIn:"1h"});
            res.status(200).json({message:"success auth",token:token,
            expiresin:"3600",userid:fetchedUser._id});
        })
        .catch(err=>{
            return res.status(401).json({message:"auth failed"});
        })
    });

module.exports=router;