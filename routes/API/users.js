const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

//@route    Post api/users
//@desc     Register user route
//@access   Public
router.post('/',[
     check('name', "name is required")
        .not()
        .isEmpty(),
    check('email', 'Please provide valid email').isEmail(),
    check(
        'password',
        'Please enter a password with at least 6 chars')
        .isLength({ min: 6})

], 
async (req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }
    const{ name, email, password} = req.body
    try{
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({errors: [{ msg: 'User already exists'}] })
        }
        const avatar = gravatar.url(email,{
            s:"200",
            r:"pg",
            d:"mm"
        })

        user = new User({
            name,
            email,
            password,
            avatar
        })

        const salt = await bcrypt.genSalt(10);

        user.password  = await bcrypt.hash(password, salt);

        await user.save();

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