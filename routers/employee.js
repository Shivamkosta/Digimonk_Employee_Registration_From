const express = require('express');
const router = express.Router();
const connection = require('./connection');
const upload = require('./file');

// GET API
router.get('/get/employee',(req,res,next)=>{
    console.log('get api is running');
    res.writeHead(200,{'Content-Type':'text/json'});
    connection.query('Select * from empdetail',(err,result)=>{
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
    let sql = `SELECT * FROM empdetail WHERE id = ${req.params.id} `;

    //run query
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.json({SUCCESS:true,result});
        console.log("result :",result);
    })
})

//Create Employee details
router.post('/empdetails',(req,res,next)=>{
    console.log(req.body);
    connection.query(
        "insert into empdetail(fname,lname,dob,email,gender,matrimony,mobile,doj,presentaddress,permanentaddress,bankname,ifsccode,bankaccount) values(?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [            
            req.body.fname,
            req.body.lname,
            req.body.dob,
            req.body.email,
            req.body.gender,
            req.body.matrimony,
            req.body.mobile,
            req.body.doj,
            req.body.presentaddress,
            req.body.permanentaddress,
            req.body.bankname,
            req.body.ifsccode,
            req.body.bankaccount,          

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
    var fname = x.fname;
    var lname = x.lname;
    var dob = x.dob;
    var email = x.email;
    var gender = x.gender;
    var matrimony = x.matrimony;
    var mobile = x.mobile;
    var doj = x.doj;
    var presentaddress = x.presentaddress;
    var permanentaddress = x.permanentaddress;

    connection.query(`Update empdetail SET fname=?,lname=?,dob=?,email=?,gender=?,matrimony=?,mobile=?,doj=?,presentaddress=?,permanentaddress=? WHERE id='${req.params.id}'`
    ,[fname,lname,dob,email,gender,matrimony,mobile,doj,presentaddress,permanentaddress],
    function(err,result){
        if(err) throw err;
        res.json({SUCCESS:true,message:'User has been updated successfully'})
        console.log(result)
    })

});

//Update bank details
router.put('/update/bankdetails/:id',(req,res,next)=>{
    console.log(req.params.id);
    
    var x = req.body;
    var bankname = x.bankname;
    var ifsccode = x.ifsccode;
    var bankaccount = x.bankaccount;
    

    connection.query(`Update empdetail SET bankname=?,ifsccode=?,bankaccount=? WHERE id='${req.params.id}'`
    ,[bankname,ifsccode,bankaccount],
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
    var fname = x.fname;
    var relation = x.relation;
    var mobile = x.mobile;
    var presentaddress = x.presentaddress;
    

    connection.query(`Update empdetail SET fname=?,relation=?,mobile=?,presentaddress=? WHERE id='${req.params.id}'`
    ,[fname,relation,mobile,presentaddress],
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
    let sql = `DELETE FROM empdetail
               WHERE id = ${req.params.id}`;
    
    //run query
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.json({SUCCESS:true,message:"delete successfully"});
        console.log(result)
    })
})

module.exports=router;

// router.post('/submit',upload.any(),(req,res,next)=>{
//     connection.query(
//         "insert into empdetail(fname,lname,dob,email,gender,matrimony,mobile,doj,presentaddress,permanentaddress,photo,highschool,highersecondry,graduation,postgraduation,bankname,ifsccode,bankaccount) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
//         [
            
//             req.body.fname,
//             req.body.lname,
//             req.body.dob,
//             req.body.gender,
//             req.body.matrimony,
//             req.body.mobile,
//             req.body.doj,
//             req.body.presentaddress,
//             req.body.permanentaddress,
//             req.files[0].originalname,
//             req.files[1].originalname,
//             req.files[2].originalname,
//             req.files[3].originalname,
//             req.files[4].originalname,
//             req.body.bankname,
//             req.body.ifsccode,
//             req.body.bankaccount,
            

//         ],
//         (err,result)=>{
//             if(err){
                
//                 res.status(404).json({SUCCESS:false})
//                 console.log(err)
//             }else{
//                 res.status(200).json({SUCCESS:true});
//                 console.log(result)
//             }
//         }
//     )
// })
