const express = require('express');
const router = express.Router();
const connection = require('./connection');
const upload = require('./imageupload');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check
const verifyToken = require('../auth/auth');
const fs = require('fs');
const mime = require('mime');
const { match } = require('assert');
const { response } = require('express');

router.post("/login", (req, res) => {
  var e = req.body.email;
  console.log(e);
  connection.query(
    "SELECT * from joining WHERE email=?",
    [req.body.email],
    (err, rows) => {
      if (err) {
        console.log(err);
      }
      console.log(rows, rows.length);
      if (rows.length > 0) {
        console.log(" existing user");
        var otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);
         //generate a signed token with user email with secret
         const token = jwt.sign(req.body.email, process.env.JWT_TOKEN);
         console.log("generate token :", token);
 
         //save token in cookies
         res.cookie("token", token, { expire: new Date() + 9999 });
         
        connection.query("UPDATE joining SET otp =?,token=? WHERE email=?", [otp,token,req.body.email],(err, results) => {
          console.log(results)
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
            console.log(err);
          } else {
            console.log("Email Sent successfully :" + info.response);
          }
        });
      } else {
        console.log("new user");
        let otp = Math.floor(100000 + Math.random() * 900000);
        console.log(otp);

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
              connection.query("UPDATE joining SET otp =?,token=? WHERE email=?", [otp,token,req.body.email],(err, results) => {
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
              status:"success",
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
router.post("/verification",(req,res)=>{    
    connection.query("SELECT * from joining WHERE email=?",
    [req.body.email],(err,rows)=>{
        // console.log(rows);
        // console.log("length :",rows.length)
        console.log(rows[0].otp)
        // console.log(rows[0].otp)
        if(rows && rows[0].otp == req.body.otp ){
            console.log("true")
            res.status(200).json({status:"You have successfully verified"})
        }else{
            res.status(400).json({status:"failur",message:"Incorrect otp please enter your correct otp"})
        }        
    })
})

router.post('/email/',(req,res)=>{
     var e = req.body.email;
     console.log(e);
    
    var otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
   
   var mail = connection.query(
    "insert into joining(email) value(?)",
    [         
        req.body.email,    
    ],(err,user)=>{
        console.log("mail :",mail,otp);   
    if(err) {
            res.status(400).json({
                error : 'Email not found'
            })
        }

        //generate a signed token with user email with secret
        const token = jwt.sign({email:req.body.email },process.env.JWT_TOKEN);
        console.log("generate token :",token);

        //save token in cookies
        res.cookie("token",token,{expire : new Date() + 9999});

        //return response with user and token to frontend client
       const { firstname,lastname,dob,gender,matrimony,mobileno,dateofjoining,presentaddress,permanentaddress,PF,emergencyname,relation,emergencycontact,emergencyaddress } = user;
        // console.log("id :",id)
        console.log('fname :',firstname);
        console.log('lname :',lastname);
        console.log('dob :',dob);
        // console.log('email :',email);
        console.log('gender :',gender);
        console.log('matrimony :',matrimony);
        console.log('mobileno :',mobileno);
        console.log('datofjoining :',dateofjoining);
        console.log('presentaddress :',presentaddress);
        console.log('permanentaddress :',permanentaddress);
        console.log('PF :',PF);
        console.log('emergencyname :',emergencyname);
        console.log('relation :',relation);
        console.log('emergencycontact :',emergencycontact);
        console.log('emergencyaddress :',emergencyaddress);

        return res.json({token , user:{ firstname, lastname,dob,gender,matrimony,dateofjoining,presentaddress,permanentaddress,PF,emergencyname,relation,emergencycontact,emergencyaddress }})
    })

const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    service:'gmail',
    auth:{
        user:'shivamkosti570@gmail.com',
        pass:'008602750983'
    }
});

var mailOption = {
    from : 'shivamkosti570@gmail.com',
    to :e,mail,
    subject:'send mail',
     text : `<p> we have received a request to have your password reset for <b>KOOKY ACCOUNT</b>.
    if you did not make this request ,plese ignore this email.<br>
    <br> To reset your password,plese <a href = "#"><b>visit the link</b></a> </p> <hr>
    <h3><b> Having trouble?</b></h3>
    <p>if the above link does not work try copying this link into your browser.</p>
    <p>${otp}</p></hr>
    <h3><b> Question ?<b></h3>
    <p>plese let us know if there's anything we can help you with by replying to this email or by emailing <b>Kooky.com</b></p>`
};

transporter.sendMail(mailOption,function(err,info){
    if(err) {
        console.log(err);
    }else{
        console.log('Email Sent successfully :'+info.response)
    }
});
  
})

// GET API
router.get('/get/employee',verifyToken,(req,res,next)=>{
    console.log('get api is running');
    res.writeHead(200,{'Content-Type':'text/json'});
    connection.query('Select * from joining',(err,result)=>{
        if(err) throw err;
        res.write(JSON.stringify(result));      
        
        console.log(res.write(JSON.stringify(result)))
        res.end();
    } )
})

//Read single data
// router.get('/get/read/:id',verifyToken,(req,res)=>{
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

router.get('/get/read',(req,res)=>{
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
        connection.query("SELECT * from joining WHERE email=? ",[rows],(err,response)=>{
            if(err) {
                console.log("error :",err);
                res.status(400).json({status:false})
            }else{
                res.status(201).json({status:true})
                console.log("response :",response)
            }
        })
    })
})

//upload file
router.post('/upload',upload.any(),(req,res,next)=>{
    console.log("req.body :",req.body);
    connection.query(
        "insert into joining(photo) value(?)",
        [            
            req.body.photo,
                  

        ],
        (err,result)=>{
          console.log("error :",err);
          console.log("result :",result);
            if(err){
              
                
                res.status(404).json({SUCCESS:false})
            }else{
                res.status(200).json({SUCCESS:true});
                console.log(result)
            }
        }
    )
});

const uploadImage =  (req, res, next) => {
  // to declare some path to store your converted image
  const matches = req.body.photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  console.log("matches :",matches);
  const response = {};
  console.log("response :",response);
   
  if (matches.length !== 3) {
  return new Error('Invalid input string');
  }
   
  response.type = matches[1];
  response.data = new Buffer(matches, 'base64');
  let decodedImg = response;
  let imageBuffer = decodedImg.data;
  let type = decodedImg.type;
  let extension = mime.extension(type);
  let fileName = "image." + extension;
  try {
  fs.writeFileSync("./images/" + fileName, imageBuffer, 'utf-8');
  return res.send({"status":"success"});
  } catch (e) {
  next(e);
  }
  }

  
  router.post('/upload/image',uploadImage ,(req,res)=>{
    console.log("req.body :",req.body);
    connection.query(
        "insert into joining(photo) value(?)",
        [            
            req.body.photo,
                  

        ],
        (err,result)=>{
          console.log("error :",err);
          console.log("result :",result);
            if(err){
              
                
                res.status(404).json({SUCCESS:false})
            }else{
                res.status(200).json({SUCCESS:true});
                console.log(result)
            }
        }
    )
  });

//UPDATE Employee Details
router.put('/update/empdetails/:id',(req,res,next)=>{
    console.log(req.params.id);

    var x = req.body;
    var firstname = x.firstname;
    var lastname = x.lastname;
    var dob = x.dob;
    var email = x.email;
    var gender = x.gender;
    var matrimony = x.matrimony;
    var mobile = x.mobile;
    var dateofjoining = x.dateofjoining;
    var presentaddress = x.presentaddress;
    var permanentaddress = x.permanentaddress;


    connection.query(`Update joining SET fname=?,lname=?,dob=?,email=?,gender=?,matrimony=?,mobile=?,dateofjoining=?,presentaddress=?,permanentaddress=? WHERE id='${req.params.id}'`
    ,[firstname,lastname,dob,email,gender,matrimony,mobile,dateofjoining,presentaddress,permanentaddress],
    function(err,result){
        if(err) throw err;
        res.json({SUCCESS:true,message:'User has been updated successfully',id:req.params.id})
        console.log(result)
    })

});

//Update bank details
router.put('/update/bankdetails/:id',(req,res,next)=>{
    console.log(req.params.id);
    
    var x = req.body;
    var bankname = x.bankname;
    var ifsc = x.ifsccode;
    var bankaccount = x.bankaccount;
    

    connection.query(`Update joining SET bankname=?,ifsc=?,bankaccount=? WHERE id='${req.params.id}'`
    ,[bankname,ifsc,bankaccount],
    function(err,result){
        if(err) throw err;
        res.json({SUCCESS:true,message:'User has been updated successfully'})
        console.log(result)
    })
});

//update emergency details
router.put('/update/emergencydetails/:id',(req,res,next)=>{
    console.log(req.params.id);
    
    var x = req.body;
    var PF = x.PF;
    var emergencyname = x.emergencyname;
    var emergencycontact = x.emergencycontact;
    var emergencyaddress = x.emergencyaddress;
    

    connection.query(`Update joining SET PF=?,emergencyname=?,emergencycontact=?,emergencyaddress=? WHERE id='${req.params.id}'`
    ,[PF,emergencyname,emergencycontact,emergencyaddress],
    function(err,result){
        if(err) throw err;
        res.json({SUCCESS:true,message:'User has been updated successfully'})
        console.log(result)
    })
})

//delete single data
router.delete('/delete/empoloyee/:id',(req,res)=>{
    console.log(req.params.id);
    //sql query
    let sql = `DELETE FROM joining
               WHERE id = ${req.params.id}`;
    
    //run query
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.json({SUCCESS:true,message:"delete successfully"});
        console.log(result)
    })
})

module.exports=router
