// const nodemailer = require('nodemailer');
// // const Email = require('../models/emailModel');
// var smtpTransport = require('nodemailer-smtp-transport');
// const connection = require('./routers/connection');

// const sendEmail = async (req,res,options) => {
// //   const emailsettings = await Email.findById({
// //     _id: '6017c839e79cb10cf82bb6c1',
// //   });

// //connection.query(`SELECT * FROM empdetail WHERE id = 7`)
//   let host = 'smtp gmail.com';
//   let user = 'shivamkosti570@gmail.com';
//   let pass = '008602750983';

//   var transporter = nodemailer.createTransport(
//     smtpTransport({
//       service: 'smtp gmail.com',
//       auth: {
//         user: user,
//         pass: pass,
//       },
//     })
//   );

//   //2 define email options
//   const mailOptions = {
//     from: `shivamkosti570@gmail.com`,
//     to: options.email,
//     subject: options.subject,
//     html: options.message,
//   };
//   //3 Actually send the email

//   await transporter.sendMail(mailOptions);
// };

// module.exports = sendEmail;

// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     host:'smtp.gmail.com',
//     port:587,
//     secure:false,
//     service:'gmail',
//     auth:{
//         user:'shivamkosti570@gmail.com',
//         pass:'008602750983'
//     }
// });

// var mailOption = {
//     from : 'shivamkosti570@gmail.com',
//     to :'corporate19shivamkosta@gmail.com',
//     subject:'Sending Email using Nodejs',
//     text:`Hi,Dear thank you for your nide node.js tutorial 
//             I will donate 10$ for this app `
// };

// transporter.sendMail(mailOption,function(err,info){
//     if(err) {
//         console.log(err);
//     }else{
//         console.log('Email Sent successfully :'+info.response)
//     }
// });

