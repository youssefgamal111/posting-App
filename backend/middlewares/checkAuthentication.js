const jwt=require("jsonwebtoken");
module.exports=(req,res,next)=>{
    try{
    const token=req.headers.authorization.replace("Bearer ","");
    jwt.verify(token,"jgbmvmgrtkjrmjtr");
    next();}
    catch(error){
        res.status(401).json({message:"auth failed!!"});

    }
}