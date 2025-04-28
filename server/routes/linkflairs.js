const express = require('express');

const LinkFlair = require('../models/linkflairs');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const linkFlairs = await LinkFlair.find({});
        res.status(200).json(linkFlairs);
    } catch (error) {
        console.error('Error fetching link flairs:', error);
        res.status(500).json({ message: 'Error fetching link flairs.' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { content } = req.body;

        const linkFlair = new LinkFlair({ content });

        const savedLinkFlair = await linkFlair.save();

        res.status(200).json({ linkFlairID: savedLinkFlair._id });
    } catch (error) {
        console.error('Error creating link flair:', error);
        res.status(500).json({ message: 'Error creating link flair.' });
    }
});

module.exports = router;
