const jwt = require("jsonwebtoken");
const jwt_decode = ('jwt-decode');
// Access user info from localstorage


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
        console.log("rows :", rows)
        if (err) {
            console.log("error :", err);
            return res.status(401).send({
                message: "Unauthorized!"
            });
        }
        next();
    });
    let data = splitToken;
    let buff = new Buffer(data, 'base64');
    let text = buff.toString('ascii');

    console.log(" converted from Base64 to ASCII is " + text);
};
module.exports = verifyToken;

//https://bezkoder.com/node-js-jwt-authentication-mysql/