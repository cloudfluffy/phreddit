const express = require('express');

const Community = require('../models/communities');

const { newest_posts, oldest_posts, active_posts } = require('../util');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const communities = await Community.find({});
        res.status(200).json(communities);
    } catch (error) {
        console.error('Error fetching communities:', error);
        res.status(500).json({ message: 'Error fetching communities.' })
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description, members } = req.body;

        const community = new Community({ name, description, members });

        await community.save();

        res.status(200).json({ community });
    } catch (error) {
        console.error('Error creating community:', error);
        res.status(500).json({ message: 'Error creating community.' });
    }
});

router.put('/:communityId/posts', async (req, res) => {
    try {
        const { communityId } = req.params;
        const { postID } = req.body;

        await Community.updateOne({ _id: communityId }, { $push: { postIDs: postID } });

        res.status(200).json({ message: 'Post added to the community successfully.' });
    } catch (error) {
        console.error('Error adding post to the community:', error);
        res.status(500).json({ message: 'Error adding post to the community.' });
    }
});

router.get('/:communityId/posts/newest', async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = newest_posts(community.postIDs);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/:communityId/posts/oldest', async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = oldest_posts(community.postIDs);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
});

router.get('/:communityId/posts/active', async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = await active_posts(community.postIDs);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Error fetching posts.' });
    }
});

module.exports = router;
