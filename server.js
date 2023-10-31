const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const express = require("express");
const path = require("path");
const morgan = require("morgan"); 
const app = express();
const session = require('express-session');
const cookieParser = require("cookie-parser");


// db 
const connectDB = require('./server/db/db');

// env
dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 5000;



// middleware
app.use(morgan("tiny"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

// Configure session middleware
app.use(session({
    secret: 'sky',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        maxAge: oneDay}
  }));




//set view engine
app.set('view engine', 'ejs');


//mongoDB call COnnection/ DB Function call
connectDB();



//load assests
app.use('/css',express.static(path.resolve(__dirname,"assets/css")));
app.use('/img',express.static(path.resolve(__dirname,"assets/img")));
app.use('/js',express.static(path.resolve(__dirname,"assets/js")));


//load routers
app.use("/",require('./server/routes/routes'));

app.listen(PORT,()=>{
    console.log(`Server is running on port http://localhost:${PORT} 👍`);
})