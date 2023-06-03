const express = require("express");
const router = express.Router();
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const JWT_SECRET='Thisisagood$ite'
const fetchuser=require('../middleware/fetchuser');


//Route1: Create a User using: POST "/api/auth/createuser" . No login required   //SIGNUP
router.post(
  "/createuser",
  [
    body("name", "Name must be at atleat 3 characters ").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be atleast 5 characters").isLength({ min: 5 }),
    body("cpassword", "Password must be atleast 5 characters").isLength({ min: 5 })
  ],
  async (req, res) => {
    let success=false;
    //1.If there are errors in validationResult, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({success, errors: errors.array() });
    }
    //2.(a) TRY-BLOCK
    try {
      if(req.body.password!==req.body.cpassword){
        return res
        .status(400)
        .json({success, error: "Password mismatch!" });
      }
           //(i) Check whether the user with this email exists already.
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({success, error: "User with this email already exists!" });
      }
      //(ii) If there are no such errors from user-side
      const salt=await bcrypt.genSalt(10);
      const secPass=await bcrypt.hash(req.body.password,salt)
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password:secPass,
      });
      const data={
        user:{
          id:user.id
        }}
      const authtoken=jwt.sign(data,JWT_SECRET);
      success=true
      res.json({success,authtoken});
      
    } 
      //2.(b) CATCH-BLOCK
     catch (error) {
      //(iii) If there is Internal Server Error
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }}
);



//Route2: Authenticate a user using: POST "api/auth/login" .    //LOGIN
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
      let success=false;
      //1.If there are errors in validationResult, return Bad request and the errors
      const errors=validationResult(req);
      if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
      }
      //2.(a) TRY-BLOCK
      try{
          const {email,password}=req.body;
          let user=await User.findOne({email});
          //(i) If no such user with entered email exists
          if(!user){
            return res.status(400).json({success,error:"Please try to login with correct credentials."})
          }
          //(ii) If user with the entered email exists, but the entered password is incorrect
          const passwordCompare=await bcrypt.compare(password,user.password)
          if(!passwordCompare){
            return res.status(400).json({success,error:"Please try to login with correct credentials."})
          }
          //(iii) If user with the entered email and password exists, then return the JSON authtoken
          else{
            const data={
              user:{
                id:user.id
              }
            }
            const authtoken=jwt.sign(data,JWT_SECRET);
            success=true
            res.json({success,authtoken});
          }
      }
      //2.(b) CATCH-BLOCK
      catch(error){
        //(iii) If there is Internal Server Error
        console.log(error.message);
        res.status(500).send("Internal Server Error");
      }}
  )

//Route3: Get loggedIn User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser',fetchuser,async (req, res) => {
  
  //3.(a) TRY-BLOCK
   try{
    //fetching the user id from jwt-token
     const userId=req.user.id;
     //select all the fields of the user except password
     const user=await User.findById(userId).select("-password")
     res.send(user)
    }
    //3.(b) CATCH-BLOCK
    catch(error){
      //If there is Internal Server Error
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }

})



module.exports = router;
