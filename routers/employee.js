const express = require('express');
const router = express.Router();
const connection = require('./connection');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const fs = require('fs');
const path = require('path');
const mime = require('mime');


router.post("/login", (req, res) => {
  var e = req.body.email;
  console.log("email :", e);
  connection.query(
    "SELECT * from joining WHERE email=?",
    [req.body.email],
    (err, rows) => {
      if (err) {
        console.log("error :", err);
      }
      console.log("rows, rows.length :", rows, rows.length);
      if (rows.length > 0) {
        console.log(" existing user");
        var otp = Math.floor(100000 + Math.random() * 900000);
        console.log("otp :", otp);
        //generate a signed token with user email with secret
        const token = jwt.sign(req.body.email, process.env.JWT_TOKEN);
        console.log("generate token :", token);

        //save token in cookies
        res.cookie("token", token, { expire: new Date() + 9999 });

        connection.query("UPDATE joining SET otp =?, WHERE email=?", [otp, req.body.email], (err, results) => {
          console.log("results :", results);
        })
        res.json({
          token,
          otp,
          data: rows[0],
        });
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          service: "gmail",
          auth: {
            user: "shivamkosti570@gmail.com",
            pass: "008602750983",
          },
        });

        var mailOption = {
          from: "shivamkosti570@gmail.com",
          to: req.body.email,
          // mail,
          subject: "send mail",
          html: `<p> we have received a request to have your password reset for <b>KOOKY ACCOUNT</b>.
        if you did not make this request ,plese ignore this email.<br>
        <br> To reset your password,plese <a href = "#"><b>visit the link</b></a> </p> <hr>
        <h3><b> Having trouble?</b></h3>
        <p>if the above link does not work try copying this link into your browser.</p>
        <p>${otp}</p></hr>
        <h3><b> Question ?<b></h3>
        <p>plese let us know if there's anything we can help you with by replying to this email or by emailing <b>Kooky.com</b></p>`,
        };

        transporter.sendMail(mailOption, function (err, info) {
          if (err) {
            console.log("error :", err);
          } else {
            console.log("Email Sent successfully :" + info.response);
          }
        });
      } else {
        console.log("new user");
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log("otp :", otp);

        //generate a signed token with user email with secret
        const token = jwt.sign(req.body.email, process.env.JWT_TOKEN);
        console.log("generate token :", token);

        //save token in cookies
        res.cookie("token", token, { expire: new Date() + 9999 });

        connection.query(
          "insert into joining(email) value(?)",
          [req.body.email],
          (err, user) => {

            // console.log("mail :", mail);
            if (err) {
              res.status(400).json({
                error: "Email not found",
              });
              connection.query("UPDATE joining SET otp =?,WHERE email=?", [otp, req.body.email], (err, results) => {
                console.log(results);
              })
            }


            const transporter = nodemailer.createTransport({
              host: "smtp.gmail.com",
              port: 587,
              secure: false,
              service: "gmail",
              auth: {
                user: "shivamkosti570@gmail.com",
                pass: "008602750983",
              },
            });

            let mailOption = {
              from: "shivamkosti570@gmail.com",
              to: e,

              subject: "send mail",
              html: `<p> we have received a request to have your password reset for <b>KOOKY ACCOUNT</b>.
        if you did not make this request ,plese ignore this email.<br>
        <br> To reset your password,plese <a href = "#"><b>visit the link</b></a> </p> <hr>
        <h3><b> Having trouble?</b></h3>
        <p>if the above link does not work try copying this link into your browser.</p>
        <p>${otp}</p></hr>
        <h3><b> Question ?<b></h3>
        <p>plese let us know if there's anything we can help you with by replying to this email or by emailing <b>Kooky.com</b></p>`,
            };

            transporter.sendMail(mailOption, function (err, info) {
              if (err) {
                console.log(err);
              } else {
                console.log("Email Sent successfully :" + info.response);
              }
            });

            res.status(200).json({
              status: "success",
              token,
              otp,

            });
          }
        );
      }
    }
  );

});

//verification 
router.post("/verification", (req, res) => {
  connection.query("SELECT * from joining WHERE email=?",
    [req.body.email], (err, rows) => {
      // console.log(rows);
      // console.log("length :",rows.length)
      console.log(rows[0].otp)
      // console.log(rows[0].otp)
      if (rows && rows[0].otp == req.body.otp) {
        console.log("true")
        res.status(200).json({ status: "You have successfully verified" })
      } else {
        res.status(400).json({ status: "failur", message: "Incorrect otp please enter your correct otp" })
      }
    })
})

router.post('/email/', (req, res) => {
  var e = req.body.email;
  console.log(e);

  var otp = Math.floor(100000 + Math.random() * 900000);
  console.log(otp);

  var mail = connection.query(
    "insert into joining(email) value(?)",
    [
      req.body.email,
    ], (err, user) => {
      console.log("mail :", mail, otp);
      if (err) {
        res.status(400).json({
          error: 'Email not found'
        })
      }

      //generate a signed token with user email with secret
      const token = jwt.sign({ email: req.body.email }, process.env.JWT_TOKEN);
      console.log("generate token :", token);

      //save token in cookies
      res.cookie("token", token, { expire: new Date() + 9999 });

      //return response with user and token to frontend client
      const { firstname, lastname, dob, gender, matrimony, mobileno, dateofjoining, presentaddress, permanentaddress, PF, emergencyname, relation, emergencycontact, emergencyaddress } = user;
      // console.log("id :",id)
      console.log('fname :', firstname);
      console.log('lname :', lastname);
      console.log('dob :', dob);
      // console.log('email :',email);
      console.log('gender :', gender);
      console.log('matrimony :', matrimony);
      console.log('mobileno :', mobileno);
      console.log('datofjoining :', dateofjoining);
      console.log('presentaddress :', presentaddress);
      console.log('permanentaddress :', permanentaddress);
      console.log('PF :', PF);
      console.log('emergencyname :', emergencyname);
      console.log('relation :', relation);
      console.log('emergencycontact :', emergencycontact);
      console.log('emergencyaddress :', emergencyaddress);

      return res.json({ token, user: { firstname, lastname, dob, gender, matrimony, dateofjoining, presentaddress, permanentaddress, PF, emergencyname, relation, emergencycontact, emergencyaddress } })
    })

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    service: 'gmail',
    auth: {
      user: 'shivamkosti570@gmail.com',
      pass: '008602750983'
    }
  });

  var mailOption = {
    from: 'shivamkosti570@gmail.com',
    to: e, mail,
    subject: 'send mail',
    text: `<p> we have received a request to have your password reset for <b>KOOKY ACCOUNT</b>.
    if you did not make this request ,plese ignore this email.<br>
    <br> To reset your password,plese <a href = "#"><b>visit the link</b></a> </p> <hr>
    <h3><b> Having trouble?</b></h3>
    <p>if the above link does not work try copying this link into your browser.</p>
    <p>${otp}</p></hr>
    <h3><b> Question ?<b></h3>
    <p>plese let us know if there's anything we can help you with by replying to this email or by emailing <b>Kooky.com</b></p>`
  };

  transporter.sendMail(mailOption, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log('Email Sent successfully :' + info.response)
    }
  });

})

// GET ALL DATA
router.get('/getall/employee', (req, res) => {
  if (req.body.role === "user") {
    console.log("user");
    return res.status(403).json({
      error: "Admin resourse! Access denied"
    });
  } else {
    // res.writeHead(200, { 'Content-Type': 'text/json' });
    connection.query('Select * from joining', (err, result) => {
      if (err) {
        res.status(403).json({
          status: false
        })
        console.log("error :", err);
      }
      res.status(200).json({
        status: true,
        message: "welcome to admin dashboard",
        result
      })
      // res.write(JSON.stringify(result));

      // console.log(res.write(JSON.stringify(result)))
      // res.end();

    })


  }

})

//Read single data
//router.get('/get/read/:id',verifyToken,(req,res)=>{
//     console.log(req.params.id);
//     //sql query
//     let sql = `SELECT * FROM joining WHERE id = ${req.params.id} `;

//     //run query
//     connection.query(sql,(err,result)=>{
//         if(err) throw err;
//         res.json({SUCCESS:true,result});
//         console.log("result :",result);
//     })
// })

router.get('/get/read', (req, res) => {
  let token = req.headers["x-access-token"];
  var splitToken = token.split(' ')[1];
  console.log("token :", splitToken);

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  jwt.verify(splitToken, process.env.JWT_TOKEN, (err, rows) => {
    rows;
    console.log("rows :", rows)

    if (err) {
      console.log("error :", err);
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    connection.query("SELECT * from joining WHERE email=? ", [rows], (err, response) => {
      if (err) {
        console.log("error :", err);
        res.status(400).json({ status: false })
      } else {
        res.status(201).json({ status: true })
        console.log("response :", response)
      }
    })
  })
});


//photo upload
router.post("/uploadphoto/", (req, res) => {

  //upload file
  if(req.body.photourl.startsWith("http://") != req.body.photourl){
    let date = new Date().toLocaleString();
  console.log("date :", date)
  let dataString = date.replace(" ", "-");
  console.log("dataString :", dataString)
  let dateupdate = dataString.replace(" ", "-");
  console.log("dateupdate :", dateupdate);
  var matches = req.body.photourl.match(
    /^data:([A-Za-z-+\/]+);base64,(.+)$/
  ),
    response = {};
  console.log("matches :", matches)
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  response.type = matches[1];
  console.log("response.type :", response.type);
  response.data = new Buffer.from(matches[2], "base64");
  console.log("response.data :", response.data);
  let decodedImg = response;
  console.log("decodedImg :", decodedImg)
  let imageBuffer = decodedImg.data;
  console.log("imageBuffer :", imageBuffer);
  let type = decodedImg.type;
  console.log("type :", type);
  const name = type.split("/");
  console.log("name :", name);
  const name1 = name[0];
  console.log("name1 :", name1);
  let extension = mime.getExtension(type);
  console.log("extension :", extension);
  const rand = Math.ceil(Math.random() * 1000);
  console.log("random :", rand);
  //Random photo name with timeStamp so it will not overide previous images.
  const fileName = `photo_${Date.now()}.${extension}`;
  console.log("fileName :", fileName);
  const path3 = path.resolve(`./public/images`);
  console.log("path3 :", path3);
  const localpath = `${path3}/photo/`;
  console.log("localpath :", localpath);
  if (!fs.existsSync(localpath)) {
    fs.mkdirSync(localpath, { recursive: true });
  }
  fs.writeFileSync(
    `${localpath}` + fileName,
    imageBuffer,
    "utf8"
  );
  const photourl = `${req.protocol}://${req.hostname}:${process.env.PORT}/images/photo/${fileName}`;
  //console.log("photourl :", photourl);
  connection.query("UPDATE joining SET photourl=? WHERE email=?", [photourl,req.body.email], (err, result) => {
    console.log("result :", result);
    console.log("req.body.email :", req.body.email)
    // console.log("req.body.photo :",req.body.photo)
    if (err) {
      // res.status(401).json({ status: false })
      console.log("error :", err);
    }
    else {
      // res.status(200).json({ status: true })
      console.log("result :", result);
    }
  })
    
  }

  return res.status(200).json({
      status:true,

  })

  
})

// upload highschool,highersecondry,graduation,postgraduation
router.post("/upload/hs/hrs/grd/pgrd", (req, res) => {

  if (req.body.highschoolurl) {
    console.log("file1 :");
    //console.log("req.body.highschool :",req.body.highschool)
    let date = new Date().toLocaleString();
    console.log("date :", date)
    let dataString = date.replace(" ", "-");
    console.log("dataString :", dataString)
    let dateupdate = dataString.replace(" ", "-");
    console.log("dateupdate :", dateupdate);
    var matches = req.body.highschoolurl.match(
      /^data:([A-Za-z-+\/]+);base64,(.+)$/
    ),
      response = {};
    if (matches.length !== 3) {
      console.log("matches.length :", matches.length)

      return new Error("Invalid input string");
    }
    response.type = matches[1];
    console.log("response.type :", response.type);
    response.data = new Buffer.from(matches[2], "base64");
    console.log("response.data :", response.data);
    let decodedImg = response;
    console.log("decodedImg :", decodedImg)
    let imageBuffer = decodedImg.data;
    console.log("imageBuffer :", imageBuffer);
    let type = decodedImg.type;
    console.log("type :", type);
    const name = type.split("/");
    console.log("name :", name);
    const name1 = name[0];
    console.log("name1 :", name1);
    let extension = mime.getExtension(type);
    console.log("extension :", extension);
    const rand = Math.ceil(Math.random() * 1000);
    console.log("random :", rand);
    //Random photo name with timeStamp so it will not overide previous images.
    const fileName = `photo_${Date.now()}.${extension}`;
    console.log("fileName :", fileName);
    const path3 = path.resolve(`./public/images`);
    console.log("path3 :", path3);
    const localpath = `${path3}/photo/`;
    console.log("localpath :", localpath);
    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath, { recursive: true });
    }
    fs.writeFileSync(
      `${localpath}` + fileName,
      imageBuffer,
      "utf8"
    );
    const highschoolurl = `${req.protocol}://${req.hostname}:${process.env.PORT}/images/photo/${fileName}`;
    //console.log("highschoolurl :",highschoolurl);  
    connection.query("UPDATE joining SET highschoolurl=? WHERE email=?", [highschoolurl, req.body.email], (err, result) => {
      console.log("result :", result);
      console.log("req.body.email :", req.body.email)
      // console.log("req.body.photo :",req.body.photo)
      if (err) {
        // res.status(401).send({SUCCESS:false})
        console.log("error :", err);
      }
      else {
        // res.status(200).send({SUCCESS:true})
        console.log("result :", result);
      }
    })

  }
  if (req.body.highersecondryurl) {
    console.log("file2:");
    //console.log("req.body.highersecondry :",req.body.highersecondry);
    let date = new Date().toLocaleString();
    console.log("date :", date)
    let dataString = date.replace(" ", "-");
    console.log("dataString :", dataString)
    let dateupdate = dataString.replace(" ", "-");
    console.log("dateupdate :", dateupdate);
    var matches = req.body.highersecondryurl.match(
      /^data:([A-Za-z-+\/]+);base64,(.+)$/
    ),
      response = {};
    if (matches.length !== 3) {
      // console.log("matches.length :",matches.length);

      return new Error("Invalid input string");
    }
    response.type = matches[1];
    console.log("response.type :", response.type);
    response.data = new Buffer.from(matches[2], "base64");
    console.log("response.data :", response.data);
    let decodedImg = response;
    console.log("decodedImg :", decodedImg)
    let imageBuffer = decodedImg.data;
    console.log("imageBuffer :", imageBuffer);
    let type = decodedImg.type;
    console.log("type :", type);
    const name = type.split("/");
    console.log("name :", name);
    const name1 = name[0];
    console.log("name1 :", name1);
    let extension = mime.getExtension(type);
    console.log("extension :", extension);
    const rand = Math.ceil(Math.random() * 1000);
    console.log("random :", rand);
    //Random photo name with timeStamp so it will not overide previous images.
    const fileName = `photo_${Date.now()}.${extension}`;
    console.log("fileName :", fileName);
    const path3 = path.resolve(`./public/images`);
    console.log("path3 :", path3);
    const localpath = `${path3}/photo/`;
    console.log("localpath :", localpath);
    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath, { recursive: true });
    }
    fs.writeFileSync(
      `${localpath}` + fileName,
      imageBuffer,
      "utf8"
    );
    const highersecondryurl = `${req.protocol}://${req.hostname}:${process.env.PORT}/images/photo/${fileName}`;
    //console.log("highersecondryurl :",highersecondryurl);  
    connection.query("UPDATE joining SET highersecondryurl=? WHERE email=?", [highersecondryurl, req.body.email], (err, result) => {
      console.log("result :", result);
      console.log("req.body.email :", req.body.email)
      // console.log("req.body.photo :",req.body.photo)
      if (err) {
        // res.status(401).send({SUCCESS:false})
        console.log("error :", err);
      }
      else {
        // res.status(200).send({SUCCESS:true})
        console.log("result :", result);
      }
    })

  }
  if (req.body.graduationurl) {
    console.log("file3:")
    //console.log("req.body.graduation :",req.body.graduation);
    let date = new Date().toLocaleString();
    console.log("date :", date)
    let dataString = date.replace(" ", "-");
    console.log("dataString :", dataString)
    let dateupdate = dataString.replace(" ", "-");
    console.log("dateupdate :", dateupdate);
    var matches = req.body.graduationurl.match(
      /^data:([A-Za-z-+\/]+);base64,(.+)$/
    ),
      response = {};
    if (matches.length !== 3) {
      // console.log("matches.length :",matches.length)

      return new Error("Invalid input string");
    }
    response.type = matches[1];
    console.log("response.type :", response.type);
    response.data = new Buffer.from(matches[2], "base64");
    console.log("response.data :", response.data);
    let decodedImg = response;
    console.log("decodedImg :", decodedImg)
    let imageBuffer = decodedImg.data;
    console.log("imageBuffer :", imageBuffer);
    let type = decodedImg.type;
    console.log("type :", type);
    const name = type.split("/");
    console.log("name :", name);
    const name1 = name[0];
    console.log("name1 :", name1);
    let extension = mime.getExtension(type);
    console.log("extension :", extension);
    const rand = Math.ceil(Math.random() * 1000);
    console.log("random :", rand);
    //Random photo name with timeStamp so it will not overide previous images.
    const fileName = `photo_${Date.now()}.${extension}`;
    console.log("fileName :", fileName);
    const path3 = path.resolve(`./public/images`);
    console.log("path3 :", path3);
    const localpath = `${path3}/photo/`;
    console.log("localpath :", localpath);
    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath, { recursive: true });
    }
    fs.writeFileSync(
      `${localpath}` + fileName,
      imageBuffer,
      "utf8"
    );
    const graduationurl = `${req.protocol}://${req.hostname}:${process.env.PORT}/images/photo/${fileName}`;
    //console.log("graduationurl :",graduationurl);  
    connection.query("UPDATE joining SET graduationurl=? WHERE email=?", [graduationurl, req.body.email], (err, result) => {
      console.log("result :", result);
      console.log("req.body.email :", req.body.email)
      // console.log("req.body.photo :",req.body.photo)
      if (err) {
        res.status(401).send({ SUCCESS: false })
        console.log("error :", err);
      }
      else {
        // res.status(200).send({SUCCESS:true})
        console.log("result :", result);
      }
    })

  }
  if (req.body.postgraduationurl) {
    console.log("file4 :")
    //console.log("req.body.postgraduation :",req.body.postgraduation);
    let date = new Date().toLocaleString();
    console.log("date :", date)
    let dataString = date.replace(" ", "-");
    console.log("dataString :", dataString)
    let dateupdate = dataString.replace(" ", "-");
    console.log("dateupdate :", dateupdate);
    var matches = req.body.postgraduationurl.match(
      /^data:([A-Za-z-+\/]+);base64,(.+)$/
    ),
      response = {};
    if (matches.length !== 3) {
      // console.log("matches.length :",matches.length);

      return new Error("Invalid input string");
    }
    response.type = matches[1];
    console.log("response.type :", response.type);
    response.data = new Buffer.from(matches[2], "base64");
    console.log("response.data :", response.data);
    let decodedImg = response;
    console.log("decodedImg :", decodedImg)
    let imageBuffer = decodedImg.data;
    console.log("imageBuffer :", imageBuffer);
    let type = decodedImg.type;
    console.log("type :", type);
    const name = type.split("/");
    console.log("name :", name);
    const name1 = name[0];
    console.log("name1 :", name1);
    let extension = mime.getExtension(type);
    console.log("extension :", extension);
    const rand = Math.ceil(Math.random() * 1000);
    console.log("random :", rand);
    //Random photo name with timeStamp so it will not overide previous images.
    const fileName = `photo_${Date.now()}.${extension}`;
    console.log("fileName :", fileName);
    const path3 = path.resolve(`./public/images`);
    console.log("path3 :", path3);
    const localpath = `${path3}/photo/`;
    console.log("localpath :", localpath);
    if (!fs.existsSync(localpath)) {
      fs.mkdirSync(localpath, { recursive: true });
    }
    fs.writeFileSync(
      `${localpath}` + fileName,
      imageBuffer,
      "utf8"
    );
    const postgraduationurl = `${req.protocol}://${req.hostname}:${process.env.PORT}/images/photo/${fileName}`;
    //console.log("postgraduationurl :",postgraduationurl);  
    connection.query("UPDATE joining SET postgraduationurl=? WHERE email=?", [postgraduationurl, req.body.email], (err, result) => {
      console.log("result :", result);
      console.log("req.body.email :", req.body.email)
      // console.log("req.body.photo :",req.body.photo)
      if (err) {
        // res.status(401).send({SUCCESS:false})
        console.log("error :", err);
      }
      else {
        // res.status(200).send({SUCCESS:true})
        console.log("result :", result);
      }
    })

  }
  return res.status(200).json({
    status: "success",
  });

})


// router.post('/upload/image',uploadImage ,(req,res)=>{
//   console.log("req.body :",req.body);
//   connection.query(
//       "insert into joining(photo) value(?)",
//       [            
//           req.body.photo,


//       ],
//       (err,result)=>{
//         console.log("error :",err);
//         console.log("result :",result);
//           if(err){


//               res.status(404).json({SUCCESS:false})
//           }else{
//               res.status(200).json({SUCCESS:true});
//               console.log(result)
//           }
//       }
//   )
// });

//CREATE EMPLOYEE
router.post('/create/employee', (req, res) => {
  connection.query("INSERT INTO joining (firstname,lastname,dob,email,gender,matrimony,mobileno,dateofjoining,presentaddress,permanentaddress,bankname,ifsc,bankaccountno,PF,emergencyname,emergencycontact,emergencyaddress,relation) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      req.body.firstname,
      req.body.lastname,
      req.body.dob,
      req.body.email,
      req.body.gender,
      req.body.matrimony,
      req.body.mobileno,
      req.body.dateofjoining,
      req.body.presentaddress,
      req.body.permanentaddress,
      req.body.bankname,
      req.body.ifsc,
      req.body.bankaccountno,
      req.body.PF,
      req.body.emergencyname,
      req.body.emergencycontact,
      req.body.emergencyaddress,
      req.body.relation
    ], (err, user) => {
      if (err) {
        res.status(401).json({
          status: false
        });
        console.log("error :", err);
      } else {
        res.status(201).json({
          status: true
        });
        console.log("user :", user);
      }
    })
})

//UPDATE Employee Details
router.put('/update/empdetails/:id', (req, res, next) => {
  console.log("req.params.id :", req.params.id);

  if (req.body.role === "user") {
    console.log("user");
    return res.status(403).json({
      error: "Admin resourse! Access denied"
    });
  } else {

  //upload file
  let date = new Date().toLocaleString();
  console.log("date :", date)
  let dataString = date.replace(" ", "-");
  console.log("dataString :", dataString)
  let dateupdate = dataString.replace(" ", "-");
  console.log("dateupdate :", dateupdate);
  var matches = req.body.photo.match(
    /^data:([A-Za-z-+\/]+);base64,(.+)$/
  ),
    response = {};
  console.log("matches :", matches)
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  response.type = matches[1];
  console.log("response.type :", response.type);
  response.data = new Buffer.from(matches[2], "base64");
  console.log("response.data :", response.data);
  let decodedImg = response;
  console.log("decodedImg :", decodedImg)
  let imageBuffer = decodedImg.data;
  console.log("imageBuffer :", imageBuffer);
  let type = decodedImg.type;
  console.log("type :", type);
  const name = type.split("/");
  console.log("name :", name);
  const name1 = name[0];
  console.log("name1 :", name1);
  let extension = mime.getExtension(type);
  console.log("extension :", extension);
  const rand = Math.ceil(Math.random() * 1000);
  console.log("random :", rand);
  //Random photo name with timeStamp so it will not overide previous images.
  const fileName = `photo_${Date.now()}.${extension}`;
  console.log("fileName :", fileName);
  const path3 = path.resolve(`./public/images`);
  console.log("path3 :", path3);
  const localpath = `${path3}/photo/`;
  console.log("localpath :", localpath);
  if (!fs.existsSync(localpath)) {
    fs.mkdirSync(localpath, { recursive: true });
  }
  fs.writeFileSync(
    `${localpath}` + fileName,
    imageBuffer,
    "utf8"
  );
  const photourl = `${req.protocol}://${req.hostname}:${process.env.PORT}/images/photo/${fileName}`;
  // console.log("photourl :", photourl);
    var x = req.body;
    var firstname = x.firstname;
    var lastname = x.lastname;
    var dob = x.dob;
    var email = x.email;
    var gender = x.gender;
    var matrimony = x.matrimony;
    var mobileno = x.mobileno;
    var dateofjoining = x.dateofjoining;
    var presentaddress = x.presentaddress;
    var permanentaddress = x.permanentaddress;
    // var photourl = x.photourl;

    connection.query(`Update joining SET firstname=?,lastname=?,dob=?,email=?,gender=?,matrimony=?,mobileno=?,dateofjoining=?,presentaddress=?,permanentaddress=?,photourl=? WHERE id='${req.params.id}'`
      , [firstname, lastname, dob, email, gender, matrimony, mobileno, dateofjoining, presentaddress, permanentaddress, photourl],
      function (err, result) {
        if (err){
          res.status(401).json({
            status:false
          });
          console.log("error :",err);
        }else{
          res.status(200).json({
            status: true,
            message: "welcome to admin dashboard",
            response: 'User has been updated successfully',
            id: req.params.id
          })
          console.log("result :", result);
        }
        // res.json({ status: true, message: 'User has been updated successfully', id: req.params.id })
        
      })    
  }

});

//Update bank details
router.put('/update/bankdetails/:id', (req, res, next) => {
  console.log("req.params.id :", req.params.id);
  if (req.body.role === "user") {
    console.log("user");
    return res.status(403).json({
      error: "Admin resourse! Access denied"
    });
  } else {
    var x = req.body;
    var bankname = x.bankname;
    var ifsc = x.ifsccode;
    var bankaccountno = x.bankaccount;
    connection.query(`Update joining SET bankname=?,ifsc=?,bankaccountno=? WHERE id='${req.params.id}'`
      , [bankname, ifsc, bankaccountno],
      function (err, result) {
        if (err) {
          res.status(401).json({
            status: false
          })
          console.log("error :", err);
        } else {
          res.status(200).json({
            status: true,
            message: "welcome to admin dashboard",
            response: 'User has been updated successfully'
          })
        }
        // res.json({ status: true, message: 'User has been updated successfully' })
        console.log("result :", result);
      })

  }

});

//update emergency details
router.put('/update/emergencydetails/:id', (req, res, next) => {
  console.log("req.params.id :", req.params.id);

  //admin middleware
  if (req.body.role === "user") {
    console.log("user");
    return res.status(403).json({
      error: "Admin resourse! Access denied"
    });
  } else {
    var x = req.body;
    var PF = x.PF;
    var emergencyname = x.emergencyname;
    var emergencycontact = x.emergencycontact;
    var emergencyaddress = x.emergencyaddress;
    connection.query(`Update joining SET PF=?,emergencyname=?,emergencycontact=?,emergencyaddress=? WHERE id='${req.params.id}'`
      , [PF, emergencyname, emergencycontact, emergencyaddress],
      function (err, result) {
        if (err) {
          res.status(401).json({
            status: false
          });
          console.log("error :", err);
        } else {
          res.status(200).json({
            status: true,
            response: "User has been updated successfully",
            message: "welcome to admin dashboard"
          })
        }
        console.log("result :", result)
        // res.json({ status: true, message: 'User has been updated successfully' })

      })

  }

})

//ADMIN delete single data
router.delete('/delete/empoloyee/:id', (req, res) => {
  console.log("req.params.id :", req.params.id);
  //admin middleware
  if (req.body.role === 'user') {
    console.log("user");
    res.status(403).json({
      error: "Admin resource! Access denied"
    })
  } else {
    //sql query
    let sql = `DELETE FROM joining
      WHERE id = ${req.params.id}`;

    //run query
    connection.query(sql, (err, result) => {
      if (err) throw err;
      // res.json({ status: true, message: "delete successfully" });
      console.log("result :", result);

    })

    res.status(201).json({
      SUCCESS: true,
      response: "delete successfully",
      message: "Welcome to admin dashboard"
    })
  }


})

module.exports = router
