// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function(req,file,cb){
//      cb(null,'./uploads')
//   },
//   filename: function(req,file,cb){
//     cb(null,new Data().getTime() + path.extname(file.originalname));
//   }
// });

// const fileFilter = (req,file,cb)=>{
//     if(file.mimeType === 'image/jpeg' || file.mimeType === 'image/png'){
//         cb(null,true)
//     }else{
//       cb(new error('Unsupported files'),false);
//     }
// };
// const upload = multer({
//   storage : storage,
//   limits:{
//     fileSize:1024*1024*10
//   },
//   fileFilter:fileFilter
// })
// module.exports = {upload : up};

const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })
  
  module.exports = upload;


// const fs = require('fs');
// const mime = require('mime');

// const uploadImage = async (req, res, next) => {
//   // to declare some path to store your converted image
//   var matches = req.body.base64image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
//   response = {};
   
//   if (matches.length !== 3) {
//   return new Error('Invalid input string');
//   }
   
//   response.type = matches[1];
//   response.data = new Buffer(matches[2], 'base64');
//   let decodedImg = response;
//   let imageBuffer = decodedImg.data;
//   let type = decodedImg.type;
//   let extension = mime.extension(type);
//   let fileName = "image." + extension;
//   try {
//   fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
//   return res.send({"status":"success"});
//   } catch (e) {
//   next(e);
//   }
//   }

//   module.exports = uploadImage;