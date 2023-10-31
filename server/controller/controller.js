const {Userdb,Otpdb, Bookdb} = require('../model/model');
const twilio = require('twilio');
const crypto = require('crypto');

const sessions = {};

// API

// CREATE
exports.create = (req,res) =>{
    if(!req.body){
        res.status(400).send({message:"Content can not be empty"});
        alert("message:Content can not be empty")
        return;
    }
    const user=new Userdb ({
        fname : req.body.fname ,
        lname  : req.body.lname ,
        mobileNumber: req.body.mobileNumber,
        email  : req.body.email,
    });



    console.log('user',user);

    user.save(user).then(data => {
        console.log(`${JSON.stringify(data)}`);
        res.redirect('/login');
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "some error occured while create"
        })
   })
}



const client = twilio('ACcf2c0b946bbbb731a2a3a684255ee8a3', '16d8bf83ed50378e0afa295302ade53e');

function generateOTP() {
 return Math.floor(1000 + Math.random() * 9000).toString();
  }

const otps = {};

//send OTP
exports.sendotp = async (req,res) =>{
    console.log("running 1");
    try {
    const { mobileNumber } = req.body;
    const user = await Userdb.findOne({mobileNumber})    
    if(user){
        console.log("users->",user)
    }else{

        return res.status(401).render('register')
        // res.render('register',{mobileNumber});
    }
    
  // otp generation 
    const otp = generateOTP();
    
    otps[mobileNumber] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, 
    };
    
    console.log("running 2");

    await client.messages.create({
      body: `This Your OTP is: ${otp}`,
      from: '+12762888605',
      to: `+91${mobileNumber}`,
    });
     
      // Create a new Otpdb document
      const otpauth = new Otpdb({
        mobileNumber: mobileNumber,
        otp: otps[mobileNumber].otp,
        expiresAt: otps[mobileNumber].expiresAt,
      });


    
      req.session.mobileNumber = mobileNumber;
      req.session.otp = otps[mobileNumber].otp; 
      console.log("Mobile Number in sendotp:", mobileNumber);
      console.log("Mobile Number in session:", req.session.mobileNumber);
      console.log("OTP in session:", req.session.otp);
      // Save the document to the database (assuming you have this logic)
      console.log("Session Data:", req.session);
      res.redirect('/verify');
      await otpauth.save();
      
    } catch (error) {
        console.log(error);
    }
}

// Verify OTP
exports.verifyOtp = async (req, res) => {
    try {
       const mobileNumber = req.session.mobileNumber;
       console.log("OTP in session:", req.session.otp);
       console.log("mobileNumber->",req.session.mobileNumber);
       console.log("Session Data:", req.session);
      const { otp } = req.body;
      console.log(otp);
      const otpDocument = await Otpdb.findOne({ mobileNumber: mobileNumber, otp:otp });
  
      if (!otpDocument) {
        return res.status(401).json({ message: 'Invalid OTP' });
      }
  
      const currentTimestamp = new Date();
      if (currentTimestamp > otpDocument.expiresAt) {
        return res.status(401).json({ message: 'OTP has expired' });
      }

      const user = await Userdb.findOne({mobileNumber: mobileNumber}); 
      const sessionId = crypto.randomBytes(16).toString('hex');
      sessions[sessionId]= user._id;
      req.session.sessionId = sessionId;
      req.session.userId = user._id;
      console.log("User->",req.session.userId);
      console.log('OTP verified successfully');
      res.redirect('/home');
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

//Add Books
exports.addBooks=  async (req,res)=>{
    if(!req.body){
        res.status(400).send({message:"Content can not be empty"});
        alert("message:Content can not be empty")
        return;
    }

    const userid = req.session.userId;

    const getuser = await Userdb.findOne({_id:userid});
    if(!getuser){
    return res.status(400).send("User Not Found in Add Books");
    }else{
    console.log("User found in Add Books->",getuser);
    }

    const book = new Bookdb ({
        title : req.body.title ,
        author  : req.body.author ,
        summary : req.body.summary,
        ownerId  : userid,
    });

    book.save(book).then(data => {
        console.log(`${JSON.stringify(data)}`);
        res.redirect('/mybooks');
    })
    .catch(err=>{
        res.status(500).send({
            message: err.message || "some error occured while create"
        })
   })
}

//Update Books
exports.updateredirect = async(req,res) =>{
  console.log("Update redirect Books");
  console.log("req body",req.body.bookid);
  req.session.bookid = req.body.bookid;
  const book = await Bookdb.findOne({_id:req.body.bookid})
  res.render('updatebooks',{book}); 
}

exports.updatebooks = async (req,res) =>{
   try {
     const bookid = req.session.bookid;
     console.log("Book Id-->",bookid);
     let updatedBook = {
      title : req.body.title ,
      author  : req.body.author ,
      summary : req.body.summary,
     };

     await  Bookdb.findByIdAndUpdate(bookid,updatedBook);
     res.redirect('/mybooks')

   } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
   }
}

//Delete Books
exports.deletebook = async(req,res)=>{
 try {
    const bookid = req.body.bookid;
    console.log("Book ID-->",bookid);
    const book = await Bookdb.findOne({_id:bookid});
    const result = await Bookdb.deleteOne({ _id: bookid });

    res.redirect('/mybooks');

 } catch (error) {
       console.error(error);
        res.status(500).send('Internal Server Error');
 }
}

//Show Details
exports.bookdetails = async (req,res)=>{
  try {
    console.log("Running");
    const bookid = req.body.bookid;
    console.log("Book ID--->",bookid);
     const book = await Bookdb.findOne({_id:bookid}).populate('ownerId');

     res.render('bookdetails',{book});
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
}


// READ
exports.findAll = (req,res) =>{
    userDB.find()
    .then(user=>{
        res.send(user)
    }).catch(err=>{
        res.status(500).send({message: err.message || "Error while retrieving user info"});
    })   
}

//profile
exports.profile = (req,res) =>{
    const sessionId = req.session.sessionId;
    if (sessionId) {
    console.log("ID",sessionId);

    res.status(201).redirect(`/profile`);
    }else{
        console.log('Session ID not found');
    res.send('Session ID not found');
    } 
}

  
// update profile
exports.update = async (req ,res)=> {
    try{
    const updateId = req.session.userId;
    console.log(`Update Id ${updateId}`);
    const updatedItem = {
        fname: req.body.fname,
        lname:req.body.lname,
        email: req.body.email,
        password: req.body.password,
        cpassword: req.body.cpassword
      };
   
     await  Userdb.findByIdAndUpdate(updateId, updatedItem);
      res.redirect(`/profile`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
}