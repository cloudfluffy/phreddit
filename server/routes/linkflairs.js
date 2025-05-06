const express = require('express');

const LinkFlair = require('../models/linkflairs');

const { authenticate } = require('../util');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const linkFlairs = await LinkFlair.find({}).sort({ content: 1 });
        return res.status(200).json({ message: 'Successfully retrieved link flair.', linkFlairs });
    } catch (error) {
        console.error('Error at GET /linkflairs: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving link flairs.' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: 'Content is required.' });
        }

        const linkFlair = new LinkFlair({ content });
        const savedLinkFlair = await linkFlair.save();

        return res.status(201).json({ message: 'Successfully created link flair.', linkFlairID: savedLinkFlair._id });
    } catch (error) {
        console.error('Error at POST /linkflairs: ', error);
        return res.status(500).json({ message: 'Internal server error while creating link flair.' });
    }
});

module.exports = router;
