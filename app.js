const express = require('express');
const bodyParser = require('body-parser');
// const uploadimage = require('./routers/file');

const app = express();
require('dotenv').config();




//import router
const employeeRouter = require('./routers/employee');

app.get('/',(req,res)=>{
    res.send('Hello world');
})

//use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use('/api',employeeRouter);
// app.post('/upload/image',uploadimage);


const port = process.env.PORT || 5000
app.listen(port,()=>console.log(`Server is running on port ${port}`));

