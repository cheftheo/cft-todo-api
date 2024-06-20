const express = require('express');
// const bcrypt = require('bcrypt');
const router = express.Router();
const mongodb = require('../utils/mongodb.js');

router.get('/getposts', async (req, res) => {
    try {
        console.log('Get Posts')
        const data = await mongodb.LoadCollection('posts');
        const posts = await data.find().toArray();
        res.json(posts);
    } catch (error) {
        console.error('Get Posts Error:', error);
        res.status(500).json({message: 'Server error', error: true});
    }
});

module.exports = router;