const express = require('express');

const Community = require('../models/communities');
const Post = require('../models/posts');
const User = require('../models/users');

const { newestPosts, oldestPosts, activePosts, populateCommentIDs, populateUserDisplayNameForComment, authenticate, attachUserIfAuthenticated, retrievePosts, retrieveQueryPosts } = require('../util');

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { title, content, communityID, linkFlairID } = req.body;

        if (!title || !content || !communityID) {
            return res.status(400).json({ message: 'Title, content, and community ID are required.' });
        }

        const post = new Post({
            title,
            content,
            communityID,
            postedBy: user,
            linkFlairID: linkFlairID || null
        });

        const savedPost = await post.save();

        await Promise.all([
            Community.updateOne({ _id: communityID }, { $push: { postIDs: savedPost._id } }),
            User.updateOne({ _id: user._id }, { $push: { postIDs: savedPost._id } })
        ])

        return res.status(201).json({ message: 'Post created successfully.' });
    } catch (error) {
        console.error('Error at POST /posts: ', error);
        return res.status(500).json({ message: 'Internal server error while creating post.' });
    }
});

router.get('/newest', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrievePosts(req, res, newestPosts);
    } catch (error) {
        console.error('Error at GET /posts/newest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/oldest', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrievePosts(req, res, oldestPosts);
    } catch (error) {
        console.error('Error at GET /posts/oldest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/active', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrievePosts(req, res, activePosts);
    } catch (error) {
        console.error('Error at GET /posts/active: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/search/:query/newest', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrieveQueryPosts(req, res, newestPosts);
    } catch (error) {
        console.error('Error at GET /posts/search/:query/newest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/search/:query/oldest', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrieveQueryPosts(req, res, oldestPosts);
    } catch (error) {
        console.error('Error at GET /posts/search/:query/oldest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/search/:query/active', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrieveQueryPosts(req, res, activePosts);
    } catch (error) {
        console.error('Error at GET /posts/search/:query/active: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findOne({ _id: postId }).populate([{
            path: 'communityID',
            select: 'name members'
        }, {
            path: 'postedBy',
            select: 'displayName'
        }, {
            path: 'linkFlairID'
        }]);

        await populateCommentIDs(post);
        await Promise.all(post.commentIDs.map(commentID => populateUserDisplayNameForComment(commentID)));

        return res.status(200).json({ post });
    } catch (error) {
        console.error('Error at GET /posts/:postId: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving post.' });
    }
});

router.put('/:postId/views', async (req, res) => {
    try {
        const { postId } = req.params;

        await Post.updateOne({ _id: postId }, { $inc: { views: 1 } });

        return res.status(200).json({ message: 'Post views incremented successfully.' });
    } catch (error) {
        console.error('Error at PUT /posts/:postId/views: ', error);
        return res.status(500).json({ message: 'Internal server error while incrementing post views.' });
    }
});

router.put('/:postId/upvote', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { postId } = req.params;

        if (user.reputation < 50) {
            return res.status(403).json({ message: 'Users with a reputation below 50 are unable to vote.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ message: 'Post does not exist.' });
        }

        if (user.upvotedPostIDs.includes(post._id)) {
            await Promise.all([
                User.updateOne({ _id: user._id }, { $pull: { upvotedPostIDs: post._id } }),
                Post.updateOne({ _id: post._id }, { $inc: { voteCount: -1 } }),
                User.updateOne({ _id: post.postedBy }, { $inc: { reputation: -5 } })
            ]);
        } else {
            if (user.downvotedPostIDs.includes(post._id)) {
                await Promise.all([
                    User.updateOne({ _id: user._id }, {
                        $push: { upvotedPostIDs: post._id },
                        $pull: { downvotedPostIDs: post._id }
                    }),
                    Post.updateOne({ _id: post._id }, { $inc: { voteCount: 2 } }),
                    User.updateOne({ _id: post.postedBy }, { $inc: { reputation: 15 } })
                ]);
            } else {
                await Promise.all([
                    User.updateOne({ _id: user._id }, { $push: { upvotedPostIDs: post._id } }),
                    Post.updateOne({ _id: post._id }, { $inc: { voteCount: 1 } }),
                    User.updateOne({ _id: post.postedBy }, { $inc: { reputation: 5 } })
                ]);
            }
        }

        return res.status(200).json({ message: 'Successfully processed post upvote.' });
    } catch (error) {
        console.error('Error at PUT /posts/:postId/upvote: ', error);
        return res.status(500).json({ message: 'Internal server error while processing post upvote.' });
    }
});

router.put('/:postId/downvote', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { postId } = req.params;

        if (user.reputation < 50) {
            return res.status(403).json({ message: 'Users with a reputation below 50 are unable to vote.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(400).json({ message: 'Post does not exist.' });
        }

        if (user.downvotedPostIDs.includes(post._id)) {
            await Promise.all([
                User.updateOne({ _id: user._id }, { $pull: { downvotedPostIDs: post._id } }),
                Post.updateOne({ _id: post._id }, { $inc: { voteCount: 1 } }),
                User.updateOne({ _id: post.postedBy }, { $inc: { reputation: 10 } })
            ]);
        } else {
            if (user.upvotedPostIDs.includes(post._id)) {
                await Promise.all([
                    User.updateOne({ _id: user._id }, {
                        $push: { downvotedPostIDs: post._id },
                        $pull: { upvotedPostIDs: post._id }
                    }),
                    Post.updateOne({ _id: post._id }, { $inc: { voteCount: -2 } }),
                    User.updateOne({ _id: post.postedBy }, { $inc: { reputation: -15 } })
                ]);
            } else {
                await Promise.all([
                    User.updateOne({ _id: user._id }, { $push: { downvotedPostIDs: post._id } }),
                    Post.updateOne({ _id: post._id }, { $inc: { voteCount: -1 } }),
                    User.updateOne({ _id: post.postedBy }, { $inc: { reputation: -10 } })
                ]);
            }
        }

        return res.status(200).json({ message: 'Successfully processed post downvote.' });
    } catch (error) {
        console.error('Error at PUT /posts/:postId/downvote: ', error);
        return res.status(500).json({ message: 'Internal server error while processing post downvote.' });
    }
});

module.exports = router;
