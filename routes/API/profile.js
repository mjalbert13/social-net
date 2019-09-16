const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator')

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@route    GET api/profile/me
//@desc     Get user profile
//@access   Private
router.get('/me', auth, async (req, res)=> {
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])

        if(!profile){
            return res.status(400).json({msg:"There is no profile fo user"})
        }
        res.json(profile)
    } catch(err){
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

//@route    POST api/profile/
//@desc     Create user profile
//@access   Private
router.post('/', [auth,[
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Status is required').not().isEmpty()
]], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array()})
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubpage,
        skills,
        youtube,
        facebook,
        instagram,
        linkedin, 
        twitter
    } = req.body;
    
    const profileFields = {};
    
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if(website) profileFields.website = website;
    if(location) profileFields.location = location;
    if(bio) profileFields.bio = bio;
    if(status) profileFields.status = status;
    if(githubpage) profileFields.githubpage = githubpage;
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    console.log(profileFields.skills)
    
    
    profileFields.social ={}

    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.facebook =facebook;
    if(instagram) profileFields.social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;
    if(twitter) profileFields.social.twitter = twitter;

    try{
        let profile = Profile.findOne({user: req.user.id});

        if(profile) {
            //Update profile
            let profile = await Profile.findOneAndUpdate(
                {user: req.user.id},
                {$set: profileFields},
                {new: true}
            )

            res.json(profile)
            console.log("Profile Updated")
            return
        } else {
            //Create profile
            let profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
            console.log("Profile Saved")
            return
        }
    } catch(err){
        console.error(err.message)
        res.status(500).send({msg: "Server Error"})
    }
})

//@route    Get api/profile/
//@desc     Get all user profiles
//@access   Public
router.get('/', async (req, res)=> {

    try{
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route    Get api/profile/
//@desc     Get user profile by id
//@access   Public
router.get('/user/:user_id', async (req, res)=> {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name', 'avatar'])

        if(!profile) return res.status(400).json({ msg: "There is no profile for this user"})

        res.json(profile)
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId'){
            return res.status(400).json({ msg: "There is no profile for this user"})
        }
        res.status(500).send("server Error")
    }
})

module.exports = router;