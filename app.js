const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

app.get('/',(req,res)=>{
    res.send('Hello world');
})

//use middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(morgan());

//import router
const employeeRouter = require('./routers/employee');

app.use('/api',employeeRouter);


const port = process.env.PORT || 5000
app.listen(port,()=>console.log(`Server is running on port ${port}`));

