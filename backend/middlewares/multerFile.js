const multer=require("multer");
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
module.exports=multer({storage:storage}).single("image");