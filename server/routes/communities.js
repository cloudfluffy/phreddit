const express = require('express');

const Community = require('../models/communities');

const { newestPosts, oldestPosts, activePosts } = require('../util');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const communities = await Community.find({});
        return res.status(200).json(communities);
    } catch (error) {
        console.error('Error fetching communities:', error);
        return res.status(500).json('Error fetching communities.');
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description, members } = req.body;

        if (!name) {
            return res.status(400).json('name is required.');
        }

        if (!description) {
            return res.status(400).json('description is required.');
        }

        if (!members) {
            return res.status(400).json('members is required.');
        }

        const community = new Community({ name, description, members });

        const savedCommunity = await community.save();

        return res.status(200).json(savedCommunity);
    } catch (error) {
        console.error('Error creating community:', error);
        return res.status(500).json('Error creating community.');
    }
});

router.put('/:communityId/posts', async (req, res) => {
    try {
        const { communityId } = req.params;
        const { postID } = req.body;

        if (!postID) {
            return res.status(400).json('postID is required.');
        }

        await Community.updateOne({ _id: communityId }, { $push: { postIDs: postID } });

        return res.status(200).json('Post added to the community successfully.');
    } catch (error) {
        console.error('Error adding post to the community:', error);
        return res.status(500).json('Error adding post to the community.');
    }
});

router.get('/:communityId/posts/newest', async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = newestPosts(community.postIDs);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json('Error fetching posts.');
    }
});

router.get('/:communityId/posts/oldest', async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = oldestPosts(community.postIDs);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json('Error fetching posts.');
    }
});

router.get('/:communityId/posts/active', async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = await activePosts(community.postIDs);
        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json('Error fetching posts.');
    }
});

module.exports = router;
