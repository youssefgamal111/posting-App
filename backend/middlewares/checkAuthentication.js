const jwt=require("jsonwebtoken");
module.exports=(req,res,next)=>{
    try{
    const token=req.headers.authorization.replace("Bearer ","");
    const decode=jwt.verify(token,process.env.secret_key);
    req.userdata={email:decode.email,id:decode.id};
    next();}
    catch(error){
        res.status(401).json({message:"auth failed!!"});

    }
}