const express = require('express');
const requset = require('request')
const router = express.Router();
const auth = require('../../middleware/auth');
const config = require('config')
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
        
        //Update profile
        let profile = await Profile.findOneAndUpdate(
            {user: req.user.id},
            {$set: profileFields},
            {new: true, upsert: true}
        )

        res.json(profile)
        console.log("Profile Updated")
           
        
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

//@route    Delete api/profile/
//@desc     Delete user profiles
//@access   Private
router.delete('/', auth, async (req, res)=> {

    try{
        //Remove Users posts
        
        //Delete users profile
        await Profile.findOneAndRemove({ user: req.user.id})
        //Delete User
        await User.findByIdAndRemove({_id: req.user.id});

        res.json({msg: "User Deleted"})
        
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route    Put api/profile/experience
//@desc     Add user experiernce
//@access   Private
router.put('/experience', [ auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})

        profile.experience.unshift(newExp)
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route    Delete api/profile/experience/:exp_id
//@desc     Delete user experiernce
//@access   Private
router.delete('/experience/:exp_id', auth, async (req, res)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})

        //Get expeince from profile
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


//@route    Put api/profile/education
//@desc     Delete user experiernce
//@access   Private
router.put('/education', [ auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
    check('from', 'From is required').not().isEmpty()
]], async (req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const newSchool = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})

        profile.education.unshift(newSchool)
        await profile.save();
        res.json(profile)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

//@route    Delete api/profile/experience/:edu_id
//@desc     Delete user experiernce
//@access   Private
router.delete('/education/:edu_id', auth, async (req, res)=> {
    try {
        const profile = await Profile.findOne({user: req.user.id})

        //Get expeince from profile
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();
        res.json(profile)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})
//@route    GET api/profile/github/:username
//@desc     GET gihub repos
//@access   Public
router.get('/github/:username', async (req, res)=>{
    try {
        const options= {
            uri: `htps://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('gitubClientId')}&client_secret=${config.get('githubSecret')}`,
            method:"GET",
            headers: {'user-agent': 'node.js'}
        }
        requset(options, (error, response, body) => {
            if(error) console.error(error);

            if(response.statusCode !== 200){
                res.status(404).json({msg:"Github profile not found"})
            }
            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error")
    }
})

module.exports = router;