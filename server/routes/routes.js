const express = require("express");
const route = express.Router();
const {Userdb,Bookdb} = require('../model/model');
const controller = require('../controller/controller');
const userDB = require('../model/model');
const twilio = require('twilio');
// const services = require('../');
const sessions = {};

route.get('/',(req,res)=>{
    console.log("Landing Page");
    res.render('index');
});

route.get('/register',(req,res)=>{
    console.log("Register Page");
    res.render('register');
})

route.get('/login',(req,res)=>{
    console.log("Login Page");
    res.render('login');
})

route.get('/verify',(req,res)=>{
    console.log("Verify Page");
    res.render('verify');
})

route.get('/addbooks',(req,res)=>{
    
    console.log("Add Books");
    res.render('addbooks');
});





route.get('/home', async (req,res)=>{
    try{
        console.log("Home Page");
        const userId = req.session.userId;
        const user = await Userdb.findOne({_id:userId});
        if(!user){
            throw new Error("User not found!");
         }else{
                console.log(req.session);
                console.log("🐱‍🏍-->",user);
                res.render('home',{user});
         }
    }catch(err){
        res.status(500).send('Error retrieving data from MongoDB');
    }
});

route.get('/mybooks',async (req,res)=>{
    try {
        console.log("MyBooks Page");
        const userId = req.session.userId;
        const books = await Bookdb.find({ownerId:userId});
        //console.log(books)
        res.render('mybooks',{books});
        } catch (error) {
            console.log(error);
            res.status(500).send('Error retrieving data from MongoDB');
        }
})

route.get('/allbooks', async (req,res)=>{
    try {
        console.log("AllBooks Page");
        const allbooks = await Bookdb.find().populate('ownerId');;
        console.log("All Books-->",allbooks,"All Books Length--->",);
        res.render('allbooks',{allbooks});
        } catch (error) {
            console.log(error);
            res.status(500).send('Error retrieving data from MongoDB');
        }

})

route.get('/profile',async (req,res)=>{
    try{
        console.log("Profile Page");
        const userId = req.session.userId;
         const user = await Userdb.findOne({_id:userId});
         if(!user){
            return res.redirect("/error")
            }else{
                
                res.render('profile', {user} ) ;
            }
           
    }catch(err){
        res.status(500).send('Error retrieving data from MongoDB');
    }
});

route.get('/update-profile', async (req,res)=>{
    try{
       const updateId = req.session.userId;
        console.log(`Update User ${updateId}`);
        const user = await userDB.findById(updateId);
        res.render('update', { user });
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
});




// API
route.post('/api/user', controller.create);
route.get('/api/user',controller.findAll);
route.post('/api/update',controller.update);
route.post('/api/sendotp',controller.sendotp);
route.post('/api/verifyOtp',controller.verifyOtp);
route.get('/api/profile',controller.profile);
route.post('/api/addbooks',controller.addBooks);
route.post('/api/updateredirect',controller.updateredirect);
route.post('/api/updatebooks',controller.updatebooks);
route.post('/api/deletebook',controller.deletebook);
route.post('/api/bookdetails',controller.bookdetails);
module.exports = route;