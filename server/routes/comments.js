const express = require('express');

const Comment = require('../models/comments');
const Post = require('../models/posts');
const User = require('../models/users');

const { authenticate, deleteCommentAndItsReplies } = require('../util');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { content, commentToInfo } = req.body;
        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let match;

        if (!content?.trim() || !commentToInfo) {
            return res.status(400).json({ message: 'Content, information on what and where the comment is commenting to, and the post ID that the comment is commenting under is required.' });
        }

        while ((match = hyperlinkRegex.exec(content)) !== null) {
            if (!match[1].trim() || !match[2].match(/^https?:\/\//)) {
                return res.status(400).json({ message: 'The hyperlink name is empty or the URL did not start with "https://" or "http://".' });
            }
        }

        const contentLength = content.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;

        if (!contentLength) {
            return res.status(400).json({ message: 'The content should not be empty.' });
        }

        if (contentLength > 500) {
            return res.status(400).json({ message: 'The content should not exceed 500 characters in length.' });
        }

        const comment = new Comment({
            content,
            postID: commentToInfo.postID,
            commentedBy: user._id
        });

        const savedComment = await comment.save();

        if (commentToInfo.isPost) {
            await Promise.all([
                Post.findOneAndUpdate({ _id: commentToInfo._id }, { $push: { commentIDs: savedComment._id } }),
                User.updateOne({ _id: user._id }, { $push: { commentIDs: savedComment._id } })
            ]);
        } else {
            await Promise.all([
                Comment.findOneAndUpdate({ _id: commentToInfo._id }, { $push: { commentIDs: savedComment._id } }),
                User.updateOne({ _id: user._id }, { $push: { commentIDs: savedComment._id } })
            ])
        }

        return res.status(200).json({ message: 'Comment created successfully.' });
    } catch (error) {
        console.error('Error at POST /comments: ', error);
        return res.status(500).json({ message: 'Internal server error while creating comment.' });
    }
});

router.get('/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId).populate({
            path: 'postID',
            select: 'title'
        });

        if (!comment) {
            return res.status(400).json({ message: 'Comment does not exist.' });
        }

        return res.status(200).json({ comment });
    } catch (error) {
        console.error('Error at GET /comments/:commentId: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving comment.' });
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

router.put('/:commentId/edit', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { commentId } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(400).json({ message: 'Comment does not exist.' });
        }

        if (!comment.commentedBy.equals(user._id) && !user.isAdmin) {
            return res.status(403).json({ message: "You're not the creator of the comment." });
        }

        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let match;

        if (!content?.trim()) {
            return res.status(400).json({ message: 'Content, information on what and where the comment is commenting to, and the post ID that the comment is commenting under is required.' });
        }

        while ((match = hyperlinkRegex.exec(content)) !== null) {
            if (!match[1].trim() || !match[2].match(/^https?:\/\//)) {
                return res.status(400).json({ message: 'The hyperlink name is empty or the URL did not start with "https://" or "http://".' });
            }
        }

        const contentLength = content.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;

        if (!contentLength) {
            return res.status(400).json({ message: 'The content should not be empty.' });
        }

        if (contentLength > 500) {
            return res.status(400).json({ message: 'The content should not exceed 500 characters in length.' });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { content },
            { new: true }
        );

        return res.status(200).json({ message: 'Successfully edited the comment.', comment: updatedComment });
    } catch (error) {
        console.error('Error at PUT /comments/:commentId/edit: ', error);
        return res.status(500).json({ message: 'Internal server error while editing comment.' });
    }
});

router.delete('/:commentId', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(400).json({ message: 'Comment does not exist.' });
        }

        if (!comment.commentedBy.equals(user._id) && !user.isAdmin) {
            return res.status(403).json({ message: "You're not the creator of the comment." });
        }

        await deleteCommentAndItsReplies(comment);

        return res.status(200).json({ message: 'Successfully deleted the comment.' });
    } catch (error) {
        console.error('Error at DELETE /comments/:commentId: ', error);
        return res.status(500).json({ message: 'Internal server error while deleting comment.' });
    }
});

module.exports = router;
