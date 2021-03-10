const fs = require('fs');
const mime = require('mime');
const connection = require('./routers/connection');

const uploadImage = async (req, res, next) => {
    // to declare some path to store your converted image
    var matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
    response = {};
    console.log("matches :",matches);
    console.log("response :",response);
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
     
    response.type = matches[1];
    console.log("response.type :",response.type);
    response.data = new Buffer(matches[2], 'base64');
    console.log("response.data :",response.data);
    let decodedImg = response;
    console.log("decodedImg :",decodedImg);
    let imageBuffer = decodedImg.data;
    console.log("imageBuffer :",imageBuffer);
    let type = decodedImg.type;
    console.log("type :",type);
    let extension = mime.extension(type);
    console.log("extenstion :",extension);
    let fileName = "image." + extension;
    console.log("fileName :",fileName);
    try {
    fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf8');
    return res.send({"status":"success"});
    } catch (e) {
    next(e);
    }
}


// single file upload
console.log(req.params.id);
let date = new Date().toLocaleString();
let dataString = date.replace(" ", "-");
let dateupdate = dataString.replace(" ", "-");
var matches = await req.body.proof.match(
    /^data:([A-Za-z-+\/]+);base64,(.+)$/
  ),
  response = {};
if (matches.length !== 3) {
  return new Error("Invalid input string");
}
response.type = matches[1];
response.data = new Buffer.from(matches[2], "base64");
let decodedImg = response;
let imageBuffer = decodedImg.data;
let type = decodedImg.type;
const name = type.split("/");
const name1 = name[0];
let extension = mime.getExtension(type);
const rand = Math.ceil(Math.random() * 1000);
//Random photo name with timeStamp so it will not overide previous images.
const fileName = `photo_${Date.now()}.${extension}`;
path3 = path.resolve(`./public/images`);
const localpath = `${path3}/photo/`;
if (!fs.existsSync(localpath)) {
  fs.mkdirSync(localpath, { recursive: true });
}
fs.writeFileSync(
  `${localpath}` + fileName,
  imageBuffer,
  "utf8"
);
const url = `${req.protocol}://${req.hostname}:${PORT}/images/photo/${fileName}`;
console.log(url);
// const updating = await Escort.findByIdAndUpdate(
//   { _id: req.params.id },
//   {
//     $set: { proof: url },
//   }
// );
// console.log(updating);

connection.query("UPDATE joining set url=? WHERE email=?",[url,req.body.email],(err,results)=>{
    console.log(results);
})
return res.status(200).json({
  status: "success",
});
module.exports = uploadImage;

//for multiple files upload
exports.insertescortpicture =  catchAsync(
    async (req, res, next) => {
      let images = [];
      console.log(req.params.id);
     // console.log(req.body.image.length);
      for (var i in req.body.image) 
      {
        console.log(i);
        let date = new Date().toLocaleString();
        let dataString = date.replace(" ", "-");
        let dateupdate = dataString.replace(" ", "-");
        var matches = await req.body.image[i].match(
            /^data:([A-Za-z-+\/]+);base64,(.+)$/
          ),
          response = {};
        if (matches.length !== 3) {
          return new Error("Invalid input string");
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], "base64");
        let decodedImg = response;
        let imageBuffer = decodedImg.data;
        let type = decodedImg.type;

        const name = type.split("/");
        const name1 = name[0];
        let extension = mime.getExtension(type);
        const rand = Math.ceil(Math.random() * 1000);
        //Random photo name with timeStamp so it will not overide previous images.
        const fileName = `photo_${Date.now()}.${extension}`;
        path3 = path.resolve(`./public/images`);
        const localpath = `${path3}/photo/`;
        if (!fs.existsSync(localpath)) {
          fs.mkdirSync(localpath, { recursive: true });
        }
        fs.writeFileSync(
          `${localpath}` + fileName,
          imageBuffer,
          "utf8"
        );
        const url = `${req.protocol}://${req.hostname}:${PORT}/images/photo/${fileName}`;
        console.log(url);
        images.push(url);
      }
      const updating = await Escort.findByIdAndUpdate(
        { _id: req.params.id },
        {
          $set: { image: images },
        }
      );
      console.log(images);
      // console.log(updating);
      return res.status(200).json({
        status: "success",
      });
    }
  );