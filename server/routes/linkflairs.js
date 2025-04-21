const express = require('express');

const LinkFlair = require('../models/linkflairs');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const linkflairs = await LinkFlair.find({});
        res.status(200).json(linkflairs);
    } catch (error) {
        console.error('Error fetching link flairs:', error);
        res.status(500).json({ message: 'Error fetching link flairs.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { content } = req.body;

        const linkflair = new LinkFlair({ content });

        await linkflair.save();

        res.status(200).json({ linkFlairID: linkflair._id });
    } catch (error) {
        console.error('Error creating link flair:', error);
        res.status(500).json({ message: 'Error creating link flair.' });
    }
});

module.exports = router;
