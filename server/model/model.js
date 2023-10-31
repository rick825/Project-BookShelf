const mongoose = require('mongoose');

var userSchema =  mongoose.Schema({

     fname:{
        type: String,
        required: true,
     },
     lname:{
        type: String,
        required: true,
     },
     mobileNumber: {
      type: Number,
      required: true,
    },
    email:{
      type :String ,
      required:[true,'Email is Required'],
   },
})

var otpSchema = mongoose.Schema({
   mobileNumber: {
      type: Number,
      required: true,
    },
    otp: {
      type: Number,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    deviceToken: String,
    lat: Number,
   lng: Number,
})

var bookdb = mongoose.Schema({
   title: {
      type: String,
      required: [true, 'Title is Required']
      },
   author: {
       type: String,
       required: [true, 'Author Name is Required']
       },
   summary: {
      type: String,
      required: [true, 'Summary Required']
      },
   ownerId: {
         type: mongoose.Schema.Types.ObjectId, 
         ref: 'userdb'
   }       
})

const Userdb = mongoose.model('userdb',userSchema);
const Bookdb = mongoose.model('bookdb',bookdb);
const Otpdb = mongoose.model('OTP', otpSchema);

module.exports = {Userdb, Otpdb, Bookdb};
