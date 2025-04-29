const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');

const User = require('../models/users.js');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, displayName, password, comfirmPassword } = req.body;
        const emailRegex = /(^[^\s@]+)@[^\s@]+\.[^\s@]+$/;

        if (!firstName) {
            return res.status(400).json('firstName is required.');
        }

        if (!lastName) {
            return res.status(400).json('lastName is required.');
        }

        if (!email) {
            return res.status(400).json('email is required.');
        }

        if (!displayName) {
            return res.status(400).json('displayName is required.');
        }

        if (!password) {
            return res.status(400).json('password is required.');
        }

        if (!comfirmPassword) {
            return res.status(400).json('comfirmPassword is required.');
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json('email is not in a valid email format.');
        }

        if (password != comfirmPassword) {
            return res.status(400).json('password and comfirmPassword do not match.');
        }

        const emailID = email.match(emailRegex)[1];

        if (password.toLowerCase().includes(firstName.toLowerCase())) {
            return res.status(400).json('The password should not contain the first name.');
        }

        if (password.toLowerCase().includes(lastName.toLowerCase())) {
            return res.status(400).json('The password should not contain the last name.');
        }

        if (password.toLowerCase().includes(displayName.toLowerCase())) {
            return res.status(400).json('The password should not contain the display name.');
        }

        if (password.toLowerCase().includes(emailID.toLowerCase())) {
            return res.status(400).json('The password should not contain the emailID.');
        }

        let existingUser = await User.findOne({ email });
        const emailNotUnique = existingUser ? true : false;

        existingUser = await User.findOne({ displayName });
        const displayNameNotUnique = existingUser ? true : false;

        if (emailNotUnique || displayNameNotUnique) {
            res.status(400).json({ emailNotUnique, displayNameNotUnique });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName,
            lastName,
            email,
            displayName,
            passwordHash
        });

        const savedUser = await newUser.save();

        const token = jwt.sign({ userID: savedUser._id }, JWT_SECRET, { expiresIn: 60000 });

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 60000
        });

        return res.status(200).json('User registered successfully.');
    } catch (error) {
        console.err('Error registering user: ', error);
        return res.status(500).json('Error registering user.');
    }
});

router.post('/login', async (req, res) => {

});

module.exports = router;
