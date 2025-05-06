const express = require('express');

const Comment = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');

const { authenticate } = require('../util');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { content, commentToID } = req.body;

        if (!content || !commentToID) {
            return res.status(400).json({ message: 'Content and information on what and where the comment is commenting to is required.' });
        }

        const comment = new Comment({
            content,
            commentedBy: user._id
        });

        const savedComment = await comment.save();

        if (commentToID.isPost) {
            await Promise.all([
                Post.findOneAndUpdate({ _id: commentToID._id }, { $push: { commentIDs: savedComment._id } }),
                User.updateOne({ _id: user._id }, { $push: { commentIDs: savedComment._id } })
            ]);
        } else {
            await Promise.all([
                Comment.findOneAndUpdate({ _id: commentToID._id }, { $push: { commentIDs: savedComment._id } }),
                User.updateOne({ _id: user._id }, { $push: { commentIDs: savedComment._id } })
            ])
        }

        return res.status(200).json({ message: 'Comment created successfully.' });
    } catch (error) {
        console.error('Error at POST /comments: ', error);
        return res.status(500).json({ message: 'Internal server error while creating comment.' });
    }
});

router.put('/:commentId/upvote', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { commentId } = req.params;

        if (user.reputation < 50) {
            return res.status(403).json({ message: 'Users with a reputation below 50 are unable to vote.' });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(400).json({ message: 'Comment does not exist.' });
        }

        if (user.upvotedCommentIDs.includes(comment._id)) {
            await Promise.all([
                User.updateOne({ _id: user._id }, { $pull: { upvotedCommentIDs: comment._id } }),
                Comment.updateOne({ _id: comment._id }, { $inc: { voteCount: -1 } }),
                User.updateOne({ _id: comment.commentedBy }, { $inc: { reputation: -5 } })
            ]);
        } else {
            if (user.downvotedCommentIDs.includes(comment._id)) {
                await Promise.all([
                    User.updateOne({ _id: user._id }, {
                        $push: { upvotedCommentIDs: comment._id },
                        $pull: { downvotedCommentIDs: comment._id }
                    }),
                    Comment.updateOne({ _id: comment._id }, { $inc: { voteCount: 2 } }),
                    User.updateOne({ _id: comment.commentedBy }, { $inc: { reputation: 15 } })
                ]);
            } else {
                await Promise.all([
                    User.updateOne({ _id: user._id }, { $push: { upvotedCommentIDs: comment._id } }),
                    Comment.updateOne({ _id: comment._id }, { $inc: { voteCount: 1 } }),
                    User.updateOne({ _id: comment.commentedBy }, { $inc: { reputation: 5 } })
                ]);
            }
        }

        return res.status(200).json({ message: 'Successfully processed comment upvote.' });
    } catch (error) {
        console.error('Error at PUT /comments/:commentId/upvote: ', error);
        return res.status(500).json({ message: 'Internal server error while processing comment upvote.' });
    }
});

router.put('/:commentId/downvote', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { commentId } = req.params;

        if (user.reputation < 50) {
            return res.status(403).json({ message: 'Users with a reputation below 50 are unable to vote.' });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(400).json({ message: 'Comment does not exist.' });
        }

        if (user.downvotedCommentIDs.includes(comment._id)) {
            await Promise.all([
                User.updateOne({ _id: user._id }, { $pull: { downvotedCommentIDs: comment._id } }),
                Comment.updateOne({ _id: comment._id }, { $inc: { voteCount: 1 } }),
                User.updateOne({ _id: comment.commentedBy }, { $inc: { reputation: 10 } })
            ]);
        } else {
            if (user.upvotedCommentIDs.includes(comment._id)) {
                await Promise.all([
                    User.updateOne({ _id: user._id }, {
                        $push: { downvotedCommentIDs: comment._id },
                        $pull: { upvotedCommentIDs: comment._id }
                    }),
                    Comment.updateOne({ _id: comment._id }, { $inc: { voteCount: -2 } }),
                    User.updateOne({ _id: comment.commentedBy }, { $inc: { reputation: -15 } })
                ]);
            } else {
                await Promise.all([
                    User.updateOne({ _id: user._id }, { $push: { downvotedCommentIDs: comment._id } }),
                    Comment.updateOne({ _id: comment._id }, { $inc: { voteCount: -1 } }),
                    User.updateOne({ _id: comment.commentedBy }, { $inc: { reputation: -10 } })
                ]);
            }
        }

        return res.status(200).json({ message: 'Successfully processed comment downvote.' });
    } catch (error) {
        console.error('Error at PUT /comments/:commentId/downvote: ', error);
        return res.status(500).json({ message: 'Internal server error while processing comment downvote.' });
    }
});

module.exports = router;
