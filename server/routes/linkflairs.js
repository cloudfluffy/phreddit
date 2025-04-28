const express = require('express');

const LinkFlair = require('../models/linkflairs');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const linkFlairs = await LinkFlair.find({});
        return res.status(200).json(linkFlairs);
    } catch (error) {
        console.error('Error fetching link flairs:', error);
        return res.status(500).json('Error fetching link flairs.');
    }
});

router.post('/', async (req, res) => {
    try {
        const { content } = req.body;

        if (!content) {
            return res.status(400).json('content is required.');
        }

        const linkFlair = new LinkFlair({ content });

        const savedLinkFlair = await linkFlair.save();

        return res.status(200).json(savedLinkFlair._id);
    } catch (error) {
        console.error('Error creating link flair:', error);
        return res.status(500).json('Error creating link flair.');
    }
});

module.exports = router;
