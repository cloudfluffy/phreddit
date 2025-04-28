const express = require('express');

const Comment = require('../models/comments');
const Post = require('../models/posts');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find({});
        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return res.status(500).json('Error fetching comments.');
    }
})

router.post('/', async (req, res) => {
    try {
        const { content, commentedBy, commentToID } = req.body;

        if (!content) {
            return res.status(400).json('content is required.');
        }

        if (!commentedBy) {
            return res.status(400).json('commentedBy (user ID) is required.');
        }

        if (!commentToID) {
            return res.status(400).json('commentToID (target ID and isPost) is required.');
        }

        const comment = new Comment({ content, commentedBy });

        const savedComment = await comment.save();

        if (commentToID.isPost) {
            await Post.findOneAndUpdate({ _id: commentToID._id }, { $push: { commentIDs: savedComment._id } });
        } else {
            await Comment.findOneAndUpdate({ _id: commentToID._id }, { $push: { commentIDs: savedComment._id } });
        }

        return res.status(200).json('Comment created successfully.');
    } catch (error) {
        console.error('Error creating comment:', error);
        return res.status(500).json('Error creating comment.');
    }
});

module.exports = router;
