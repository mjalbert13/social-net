const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const Posts = require('../../models/Posts');
const Profile = require('../../models/Profile')

//@route    post api/post
//@desc     Create a new post
//@access   Private
router.post('/', [ auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async(req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost = new Posts({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        });

        const post = await newPost.save();

        res.json(post)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    Get api/post
//@desc     get all posts
//@access   Private
router.get('/', auth, async (req, res)=> {
    try {
        const posts = await Posts.find().sort({date: -1})
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    Get api/post/:id
//@desc     get post by ID
//@access   Private
router.get('/:id', auth, async (req, res)=> {
    try {
        const post = await Posts.findById(req.params.id);

        if(!post){
            res.status(404).json({msg: 'Post not found'})
        }
        res.json(post)
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

//@route    Delete api/post/:id
//@desc     Delete post
//@access   Private
router.delete('/:id', auth, async (req, res)=> {
    try {
        const post = await Posts.findById(req.params.id);

        if(!post){
            res.status(404).json({msg: 'Post not found'})
        }

        if(post.user.toString() !== req.user.id){
            return res.status(401).json({ msg: "Cannot delete this post"})
        }

        await post.remove();
        res.json({ msg: 'Post removed'})
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId'){
            res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
});

//@route    PUT api/post/unlike/:id
//@desc     unlike a post
//@access   Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if user has already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({msg: 'Post has not been liked'})
        }

        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);
        
        await post.save();
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

//@route    PUT api/post/like/:id
//@desc     like a post
//@access   Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Check if user has already liked
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({msg: 'Post already liked'})
        }

        post.likes.unshift({ user: req.user.id})
        await post.save();
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})


//@route    PUT api/post/comment/:id
//@desc     Comment a post
//@access   Private
router.post('/comment/:id', [ auth, [
    check('text', 'Text is required').not().isEmpty(),
]], async(req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        };

        post.comments.unshift(newComment);

        await post.save();

        res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

//@route    DELETE api/post/comment/:id/:comment_id
//@desc     Delete a comment
//@access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //Pull out comment to delete
        const comment =  post.comments.find(comment => comment.id === req.params.comment_id);

        if(!comment){
            return res.status(404).json({ msg: "No Comment Found"})
        }
        // Make sure corect user is deleting comment
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'User unathorized'})
        }
        // remove comment
        const removeIndex = post.comments.map(comm => comm.user.toString()).indexOf(req.user.id);

        post.comments.splice(removeIndex, 1);
        
        await post.save();

        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})

module.exports = router;