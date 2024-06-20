const express = require('express');
// const bcrypt = require('bcrypt');
const router = express.Router();
const mongodb = require('../utils/mongodb.js');

router.post('/login', async (req, res) => {
    try {
        const mail = req.body.mail;
        const password = req.body.password;
        console.log("login ->", mail, password);

        if (req.session.authenticated) {
            res.json(req.session)
        } else {
            if (!mail) {
                res.status(400).json({message: 'Email is required', error: true});
                return;
            }

            if (!password) {
                res.status(400).json({message: 'Password is required', error: true});
                return;
            }

            const data = await mongodb.LoadCollection('admins');
            const userData = await data.findOne({mail: mail});
            if (userData) { 
                if (password === userData.password) {
                    req.session.authenticated = true;
                    req.session.userData = userData;
                    // res.json(req.session);
                    res.status(200).json({message: 'Logged in', userData: userData, error: false});
                } else {
                    res.status(401).json({message: 'Invalid password', error: true});
                }
            } else {
                res.status(401).json({message: 'Email not found', error: true});
            }
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({message: 'Server error', error: true});
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({message: 'Logged out', error: false});
});

router.post("/register", async (req, res, next) => {
    try {
        const mail = req.body.mail;
        const password = req.body.password;
        const name = req.body.username;
        console.log("register ->", mail, password, name)

        if (!mail) {
            return res.status(400).json({ message: 'Email is required', error: true });
        }

        if (!password) {
            return res.status(400).json({ message: 'Password is required', error: true });
        }

        if (!name) {
            return res.status(400).json({ message: 'Name is required', error: true });
        }

        const data = await mongodb.LoadCollection('admins');
        const userData = await data.findOne({ mail: mail });

        if (userData) {
            return res.status(400).json({ message: 'Email already in use', error: true });
        } else {
            await data.insertOne({ mail: mail, password: password, username: name, admin: 0 });
            return res.status(200).json({ message: 'User created', error: false });
        }
    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error', error: true });
    }
});


module.exports = router;