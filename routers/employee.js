const express = require('express');
const router = express.Router();
const connection = require('./connection');
const upload = require('./imageupload');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken"); // to generate signed token
const expressJwt = require("express-jwt"); // for authorization check

router.post('/email',(req,res)=>{
     var e = req.body.email;
     console.log(e);
    
    var otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);
   
   var mail = connection.query(
    "insert into joining(email) value(?)",
    [            
        
        req.body.email,
             

    ],(err,user)=>{
        console.log("mail :",mail);   
    if(err) {
            res.status(400).json({
                error : 'Email not found'
            })
        }

        //generate a signed token with user email with secret
        const token = jwt.sign({ name:'shivam' },process.env.JWT_TOKEN);
        console.log("generate token :",token);

        //save token in cookies
        res.cookie("token",token,{expire : new Date() + 9999});

        //return response with user and token to frontend client
        const { firstname,lastname,dob,email,gender,matrimony,mobileno,dateofjoining,presentaddress,permanentaddress,PF,emergencyname,relation,emergencycontact,emergencyaddress } = user;
        //console.log("id :",id)
        console.log('fname :',firstname);
        console.log('lname :',lastname);
        console.log('dob :',dob);
        console.log('email :',email);
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

        return res.json({token , user:{ firstname,lastname,dob,email,gender,matrimony,dateofjoining,presentaddress,permanentaddress,PF,emergencyname,relation,emergencycontact,emergencyaddress }})
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

// router.post('/upload',(req,res)=>{
//     message='';
//     if (!req.files)
// 				return res.status(400).send('No files were uploaded.');
 
// 		var file = req.files.photo;
// 		var photo=file.photo;
 
// 	  	 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
//               file.mv('uploads/'+file.name, function(err) {
                             
// 	              if (err)   
 
// 	                return res.status(500).send(err);
//       					var sql = "INSERT INTO `empdetail`(`photo`) VALUES ('" + photo + "')";
 
//     						var query = connection.query(sql, function(err, result) {
//     							 if(err) throw err;
//                                  res.json({SUCCESS:true})
//                                  console.log("result: ",result)
//                                  console.log("query: ",query);
//     						});
// 					   });
//           } else {
//             message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
//             res.json({message: message});
//           }
   
// })

// router.post('/upload',upload.any('photo'),(req,res)=>{
//     if(req.file.filename){
//         res.status(201).json({
//             message:'image upload successfully',
//             url:req.file.filename
//         });
//     }else{
//           res.status(500).json({
//               message:'Something went wrong!'
//           })
//     }
// });


// function upload(req,res){
//     if(req.file.filename){
//         res.status(201).json({
//             message:'image upload successfully',
//             url:req.file.filename
//         });
//     }else{
//           res.status(500).json({
//               message:'Something went wrong!'
//           })
//     }
// }

router.post('/upload/image',(req,res)=>{

})
// GET API
router.get('/get/employee',(req,res,next)=>{
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
router.get('/get/read/:id',(req,res)=>{
    console.log(req.params.id);
    //sql query
    let sql = `SELECT * FROM joining WHERE id = ${req.params.id} `;

    //run query
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.json({SUCCESS:true,result});
        console.log("result :",result);
    })
})


// router.post(
//     "/login",
//     async (req, res, next) => {
//       const user = connection.query(`insert into empdetail (email) value(?) `,
//         [req.body.email]
//       )
//       if (!user) {
//         return next(new AppError("there is no user with email address", 200));
//       }
//       var otp = Math.floor(100000 + Math.random() * 900000);
//       console.log(otp);
//       //    const resetToken = createPasswordResetToken(otp);
//       //await user.save({ validateBeforeSave: false });
//       const message = `<p> we have received a request to have your password reset for <b>KOOKY ACCOUNT</b>.
//       if you did not make this request ,plese ignore this email.<br>
//       <br> To reset your password,plese <a href = "#"><b>visit the link</b></a> </p> <hr>
//       <h3><b> Having trouble?</b></h3>
//       <p>if the above link does not work try copying this link into your browser.</p>
//       <p>${otp}</p></hr>
//       <h3><b> Question ?<b></h3>
//       <p>plese let us know if there's anything we can help you with by replying to this email or by emailing <b>Kooky.com</b></p>`;
//       try {
//         await sendmail({
//           email: user.email,
//           subject: `Hi,${user.name},here's how to reset your password.(valid for 10 mins)`,
//           message,
//         });
//         // const updateOtp = await Registration.findByIdAndUpdate(
//         //   { _id: user._id },
//         //   {
//         //     $set: {
//         //       otp: otp,
//         //     },
//         //   }
//         // );
//         res.status(200).json({
//           status: "success",
//           message: "otp sent to email",
//         });
//       } catch (err) {
//         console.log(err);
//         // user.passwordResetToken = undefined;
//         // user.passwordResetExpres = undefined;
//         // await user.save({ validateBeforesave: false });
//         return next(
//           new AppError("There was an error sending the email .try again later !")
//         );
//       }
//     })
  

//Create Employee details
router.post('/empdetails',(req,res,next)=>{
    console.log(req.body);
    connection.query(
        "insert into joining(firstname,lastname,dob,email,gender,matrimony,mobile,dateofjoining,presentaddress,permanentaddress,bankname,ifsc,bankaccountno,relation,PF,emergencyname,emergencycontact,emergencyaddress) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [            
            req.body.firstname,
            req.body.lastname,
            req.body.dob,
            req.body.email,
            req.body.gender,
            req.body.matrimony,
            req.body.mobile,
            req.body.dateofjoining,
            req.body.presentaddress,
            req.body.permanentaddress,
            req.body.bankname,
            req.body.ifsc,
            req.body.bankaccountno,  
            req.body.relation,
            req.body.PF,
            req.body.emergencyname,
            req.body.emergencycontact,
            req.body.emergencyaddress       

        ],
        (err,result)=>{
            if(err){
                
                res.status(404).json({SUCCESS:false})
                console.log(err)
            }else{
                res.status(200).json({SUCCESS:true});
                console.log(result)
            }
        }
    )
});

router.post('/upload',upload.any(),(req,res,next)=>{
    console.log(req.body);
    connection.query(
        "insert into joining(photo,highschool,highersecondry,graduation,postgraduation) values(?,?,?,?,?)",
        [            
            req.body.photo,
            req.body.highschool,
            req.body.highersecondry,
            req.body.graduation,
            req.body.postgraduation       

        ],
        (err,result)=>{
            if(err){
                
                res.status(404).json({SUCCESS:false})
                console.log(err)
            }else{
                res.status(200).json({SUCCESS:true});
                console.log(result)
            }
        }
    )
});

// //Create Bank Account details
// router.post('/bankdetails/:id',(req,res,next)=>{
//     console.log('bankaccount api is running')
//     console.log(req.params.id);
//     //sql query
//     let sql = `INSERT INTO empdetail(bankname,ifsccode,bankaccount)
//                VALUES('${req.body.bankname}','${req.body.ifsccode}','${req.body.bankaccount}')
//                WHERE id = '${req.params.id}'`;
    
//     //run query
//     connection.query(sql,(err,result)=>{
//         if(err) throw err;
//         res.status(200).json({SUCCESS:true})
//         console.log(result);  
//     })
// })

// // Create Emergency Contact Details
// router.post('/emergencydetails',(req,res,next)=>{
//     console.log(req.params.id);
    
//     //sql query
//     let sql = `INSERT INTO empdetail(fname,relation,mobile,address),
//                VALUES('${req.body.fname}','${req.body.relation}','${req.body.mobile}','${req.body.presentaddress}')
//                WHERE id = '${req.params.id}'`;
    
//     //run query
//     connection.query(sql,(err,result)=>{
//         if(err) throw err;
//         res.status(200).json({SUCCESS:true})
//         console.log(result);  
//     })

        
// });


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

module.exports=router;
