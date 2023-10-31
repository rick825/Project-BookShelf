🔅Summary
- This is a simple Book Management website, where we can add our books with description.

✔It has a login and Registration Page.
✨The user can register by providing their name, mobile and email.
🔑After registration the user will be redirected to login page where they login using otp to there mobile.
📚Once logged in, there will be  home page where explore button is there , the user can see all registered books in here.
📚User can also add there books there.
🌐Each book have title, author and summary.


🔅API endpoints and their usage

✔route.post('/api/user', controller.create);
 - To Create/Register a user.
✔route.post('/api/sendotp',controller.sendotp);
 - To Send an OTP.
✔route.post('/api/verifyOtp',controller.verifyOtp);
 - To verify the OTP.
✔route.get('/api/profile',controller.profile);
 - For User profile
✔route.post('/api/addbooks',controller.addBooks);
 - To Add books by the user
✔route.post('/api/updateredirect',controller.updateredirect);
 - Redirecting to Update page with the ID of the specific book.
✔route.post('/api/updatebooks',controller.updatebooks);
 - For Updating Books.
✔route.post('/api/deletebook',controller.deletebook);
 - For Deleting Books
✔route.post('/api/bookdetails',controller.bookdetails); 
 - To See book details, specially for books added by other users.  

🔅Instructions to set up and run the application locally
  
  - Just need 'npm' in the system and in the project directory "npm start" will make it run.
  - But for login and registration, it will not work , because i am using a third party "OTP generating API" which is Twillio, so for getting otp in the random mobile phone, i have get it verify with the twillio client.
  - In My case i have my mobile number verified with twillio client, you can just enter the number and hit send otp , otp will be there in the console use it and you are good to go.

  

🐱‍🏍Technologies Used
: HTML, CSS, JavaScipt, Node Js, Mongo and EJS
🌟Live Demo Link  
: https://youtu.be/vxBb60xChUM
👤Author
: Akash Kumar Das

