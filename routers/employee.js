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

//CREATE API
router.post('/submit',(req,res,next)=>{
    console.log(req.body);
    connection.query(
        "insert into empdetail(fname,lname,dob,email,gender,matrimony,mobile,doj,presentaddress,permanentaddress,bankname,ifsccode,bankaccount) value(?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            // req.files[0].originalname,
            // req.files[1].originalname,
            // req.files[2].originalname,
            // req.files[3].originalname,
            // req.files[4].originalname,
            

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

//UPDATE API
router.put('/update/employee/:id',(req,res,next)=>{
    console.log(req.params.id);
    
    //sql query
    let sql = `UPDATE empdetail SET  
               fname = ${req.body.fname}               
               WHERE id = ${req.params.id}`;

    //run query
    connection.query(sql,(err,result)=>{
        if(err) throw err;
        res.json({SUCCESS:true,message:'data updated'});
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
