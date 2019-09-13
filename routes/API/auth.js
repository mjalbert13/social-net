const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/User')
const { check, validationResult } = require('express-validator/check');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs')

//@route    GET api/auth
//@desc     authenticate user
//@access   private
router.get('/', auth, async (req, res)=> {

    try{
        const user = await User.findById(req.user.id).select('-password')
        res.json(user);
    } catch(err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
});
//@route    Post api/auth
//@desc     Log user in
//@access   Private 
router.post('/',[
   check('email', 'Please provide valid email').isEmail(),
   check('password', 'Please enter a password with at least 6 chars').exists()
], 
async (req, res)=> {
   const errors = validationResult(req)
   if(!errors.isEmpty()){
       return res.status(400).json({ errors: errors.array()})
   }
   const{ email, password } = req.body
   try{
       let user = await User.findOne({ email });

       if(!user) {
           return res.status(400).json({errors: [{ msg: 'Invalid User Creds'}] })
       }

       const isMatch = await bcrypt.compare(password, user.password);

       if(!isMatch) {
        return res.status(400).json({errors: [{ msg: 'Invalid password'}] })
       }
       const payload = {
           user:{
               id: user.id
           }
       }

       jwt.sign(
           payload, 
           config.get("jwtToken"),
           { expiresIn: 3600000 },
           (err, token)=> {
               if(err) throw err;
               res.json({ token })
           })

   } catch(err){
       console.log(err.message);
       res.status(500).send('Server Error')
   }
})



module.exports = router;