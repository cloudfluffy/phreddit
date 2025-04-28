const express = require('express');

const Community = require('../models/communities');
const Post = require('../models/posts');

const { newestPosts, oldestPosts, activePosts, populateCommentIDs, searchPosts } = require('../util');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { title, content, linkFlairID, postedBy } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'title is required.' });
        }

        if (!content) {
            return res.status(400).json({ message: 'content is required.' });
        }

        if (!linkFlairID) {
            return res.status(400).json({ message: 'linkFlairID is required.' });
        }

        if (!postedBy) {
            return res.status(400).json({ message: 'postedBy (user ID) is required.' });
        }

        const post = new Post({ title, content, linkFlairID, postedBy });

        const savedPost = await post.save();

        return res.status(200).json({ postID: savedPost._id });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ message: 'Error creating post.' });
    }
});

router.get('/newest', async (req, res) => {
    try {
        let posts = await Post.find({});
        posts = newestPosts(posts);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/oldest', async (req, res) => {
    try {
        let posts = await Post.find({});
        posts = oldestPosts(posts);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/active', async (req, res) => {
    try {
        let posts = await Post.find({});
        posts = await activePosts(posts);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/:postId', async (req, res) => {
    try {
        let post = await Post.findOne({ _id: req.params.postId }).populate('linkFlairID');
        await populateCommentIDs(post);
        return res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        return res.status(500).json({ message: 'Error fetching post.' });
    }
});

router.get('/:postId/community', async (req, res) => {
    try {
        const community = await Community.findOne({ postIDs: req.params.postId });
        return res.status(200).json(community);
    } catch (error) {
        console.error('Error fetching community:', error);
        return res.status(500).json({ message: 'Error fetching community.' });
    }
});

router.put('/:postId/views', async (req, res) => {
    try {
        const result = await Post.updateOne({ _id: req.params.postId }, { $inc: { views: 1 } });
        return res.status(200).json({ message: 'Post views incremented successfully.', result })
    } catch (error) {
        console.error('Error incrementing post views:', error);
        return res.status(500).json({ message: 'Error incrementing post views.' })
    }
});

router.get('/search/:query/newest', async (req, res) => {
    try {
        let posts = await Post.find({});
        posts = await searchPosts(req.params.query, posts);
        posts = newestPosts(posts);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/search/:query/oldest', async (req, res) => {
    try {
        let posts = await Post.find({});
        posts = await searchPosts(req.params.query, posts);
        posts = oldestPosts(posts);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/search/:query/active', async (req, res) => {
    try {
        let posts = await Post.find({});
        posts = await searchPosts(req.params.query, posts);
        posts = await activePosts(posts);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json({ message: 'Error fetching posts.' });
    }
});

module.exports = router;
