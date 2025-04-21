const express = require('express');

const Comment = require('../models/comments');
const Post = require('../models/posts');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({});
        res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ message: 'Error fetching comments.' });
    }
})

router.post('/', async (req, res) => {
    try {
        const { content, commentedBy, commentToID } = req.body;

        const comment = new Comment({ content, commentedBy });

        await comment.save();

        if (commentToID.is_post) {
            await Post.findOneAndUpdate({ _id: commentToID._id }, { $push: { commentIDs: comment._id } });
        } else {
            await Comment.findOneAndUpdate({ _id: commentToID._id }, { $push: { commentIDs: comment._id } });
        }

        res.status(200).json({ message: 'Comment created successfully.' })
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Error creating comment.' });
    }
});

module.exports = router;
