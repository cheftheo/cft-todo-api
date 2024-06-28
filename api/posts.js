const express = require('express');
const router = express.Router();
const mongodb = require('../utils/mongodb.js');

router.post('/getposts', async (req, res) => {
    try {
        const user = req.body.username

        console.log('Get Posts', user)
        const data = await mongodb.LoadCollection('users');
        const userData = await data.findOne({username: user});
        if (!userData) {
            res.status(400).json({message: 'User not found', error: true});
            return;
        }

        res.json(userData.posts);
    } catch (error) {
        console.error('Get Posts Error:', error);
        res.status(500).json({message: 'Server error', error: true});
    }
});


router.post("/updateposts", async(req, res) => {
    try {
        const user = req.body.username
        const posts = req.body.posts

        console.log('Update Posts')
        const data = await mongodb.LoadCollection('users');
        const userData = await data.findOne({username: user});

        if (!userData) {
            res.status(400).json({message: 'User not found', error: true});
            return;
        }

        const result = await data.updateOne({username: user}, {$set: {posts: posts}});
        res.json(result);
    } catch (error) {
        console.error('Update Posts Error:', error);
        res.status(500).json({message: 'Server error', error: true});
    }    
})

module.exports = router;