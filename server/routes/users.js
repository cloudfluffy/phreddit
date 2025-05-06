const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');

const User = require('../models/users');

const { authenticate, attachUserIfAuthenticated } = require('../util');

const router = express.Router();

const { JWT_SECRET } = require('../environment');

const cookieConfig = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 60000 * 60 * 24
};

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, displayName, password, confirmPassword } = req.body;
        const emailRegex = /(^[^\s@]+)@[^\s@]+\.[^\s@]+$/;

        if (!firstName || !lastName || !email || !displayName || !password || !confirmPassword) {
            return res.status(400).json({ message: 'First name, last name, email, display name, password, and confirm password are required.' })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }

        if (password != confirmPassword) {
            return res.status(400).json({ message: 'Password and confirmation do not match.' });
        }

        const emailId = email.match(emailRegex)[1];

        if (password.toLowerCase().includes(firstName.toLowerCase())) {
            return res.status(400).json({ message: 'The password should not contain your first name.' });
        }

        if (password.toLowerCase().includes(lastName.toLowerCase())) {
            return res.status(400).json({ message: 'The password should not contain your last name.' });
        }

        if (password.toLowerCase().includes(displayName.toLowerCase())) {
            return res.status(400).json({ message: 'The password should not contain your display name.' });
        }

        if (password.toLowerCase().includes(emailId.toLowerCase())) {
            return res.status(400).json({ message: 'The password should not contain your email ID.' });
        }

        const [existingUserEmail, existingUserDisplayName] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ displayName })
        ]);

        if (existingUserEmail || existingUserDisplayName) {
            return res.status(400).json({
                message: 'Email or display name already in use.',
                emailNotUnique: existingUserEmail ? true : false,
                displayNameNotUnique: existingUserDisplayName ? true : false
            });
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

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error at POST /users/register: ', error);
        return res.status(500).json({ message: 'Internal server error while registering user.' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.passwordHash);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: existingUser._id }, JWT_SECRET, { expiresIn: 60000 * 60 * 24 });

        res.cookie('token', token, cookieConfig);

        return res.status(200).json({ message: 'Logged in successfully.', clientInfo: existingUser });
    } catch (error) {
        console.error('Error at POST /users/login: ', error);
        return res.status(500).json({ message: 'Internal server error while logging in user.' });
    }
});

router.get('/logout', (req, res) => {
    res.cookie('token', '', { ...cookieConfig, expires: new Date(0) });
    return res.status(200).json({ message: 'Logged out successfully.' });
});

router.get('/loggedIn', attachUserIfAuthenticated, async (req, res) => {
    const { user } = req;
    return res.status(200).json({ message: user ? `Welcome back ${user.displayName}!` : 'Client is not logged in.', clientInfo: user });
});

router.get('/info', authenticate, async (req, res) => {
    const { user } = req;
    return res.status(200).json({ message: 'Successfully retrieved client information.', clientInfo: user });
});

module.exports = router;
