const mongoose=require("mongoose");
const postSchema=mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true}
});
//takecare if you make new object of this it will generate new id
module.exports=mongoose.model("post",postSchema);