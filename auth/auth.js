const jwt = require("jsonwebtoken");
const connection = require("../routers/connection");

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    var splitToken = token.split(' ')[1];
    console.log("token :", splitToken);

    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }

    jwt.verify(splitToken, process.env.JWT_TOKEN, (err, rows) => {
        let data = rows;
        console.log("data :", data)

        if (err) {
            console.log("error :", err);
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }      
        connection.query("SELECT * from joining WHERE email=`data`",(err,response)=>{
            if(err) {
                console.log("error :",err);
                res.status(400).json({status:false})
            }else{
                res.status(201).json({status:true})
                console.log(response)
            }
        })
        next();
    });
    

    
    // let data = splitToken;
    // let buff = new Buffer(data, 'base64');
    // let text = buff.toString('ascii');

    // console.log(data + "converted from Base64 to ASCII is " + text);
};
module.exports = verifyToken;

//https://bezkoder.com/node-js-jwt-authentication-mysql/