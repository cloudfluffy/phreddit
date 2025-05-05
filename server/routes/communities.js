const express = require('express');

const Community = require('../models/communities');
const User = require('../models/users');

const { newestPosts, oldestPosts, activePosts, authenticate, attachUserIfAuthenticated } = require('../util');

const router = express.Router();

router.get('/', attachUserIfAuthenticated, async (req, res) => {
    try {
        const { user } = req;

        const communities = await Community.find({}).sort({ name: 1 });

        let joinedCommunities = [];
        let otherCommunities = [];

        if (user) {
            joinedCommunities = communities.filter(community => user.communityIDs.includes(community._id));
            otherCommunities = communities.filter(community => !user.communityIDs.includes(community._id));
        }

        return res.status(200).json({
            communities,
            joinedCommunities,
            otherCommunities
        });
    } catch (error) {
        console.error('Error at GET /communities: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving communities.' });
    }
});

router.get('/:communityId', async (req, res) => {
    try {
        const { communityId } = req.params;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        return res.status(200).json({ community });
    } catch (error) {
        console.error('Error at GET /communities/:communityId: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving community.' });
    }
});

router.get('/:communityId/posts/newest', attachUserIfAuthenticated, async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = newestPosts(community.postIDs);
        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error at GET /:communityId/posts/newest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:communityId/posts/oldest', attachUserIfAuthenticated, async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = oldestPosts(community.postIDs);
        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error at GET /:communityId/posts/oldest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:communityId/posts/active', attachUserIfAuthenticated, async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = await activePosts(community.postIDs);
        return res.status(200).json({ posts });
    } catch (error) {
        console.error('Error at GET /:communityId/posts/active: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingCommunity = await Community.findOne({ name });

        if (existingCommunity) {
            return res.status(400).json({ nameNotUnique: true });
        }

        const community = new Community({
            name,
            description,
            owner: user
        });

        community.members.push(user);

        const savedCommunity = await community.save();

        await User.updateOne({ _id: user._id }, { $push: { communityIDs: savedCommunity } });

        return res.status(201).json({ message: 'Community created successfully.', community: savedCommunity });
    } catch (error) {
        console.error('Error at POST /communities: ', error);
        return res.status(500).json({ message: 'Internal server error while creating community.' });
    }
});

router.put('/:communityId/posts', async (req, res) => {
    try {
        const { communityId } = req.params;
        const { postID } = req.body;

        if (!postID) {
            return res.status(400).json({ message: 'Post ID is required.' });
        }

        await Community.updateOne({ _id: communityId }, { $push: { postIDs: postID } });

        return res.status(200).json({ message: 'Post added to the community successfully.' });
    } catch (error) {
        console.error('Error at PUT /communities/:communityId/posts: ', error);
        return res.status(500).json({ message: 'Internal server error while adding post to the community.' });
    }
});

router.put('/:communityId/join', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { communityId } = req.params;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        if (community.members.includes(user._id)) {
            return res.status(200).json({ message: 'User already in the community.' });
        }

        await Promise.all([
            Community.updateOne({ _id: community._id }, { $push: { members: user } }),
            User.updateOne({ _id: user._id }, { $push: { communityIDs: community } })
        ])

        return res.status(200).json({ message: 'Successfully added user to the community.' });
    } catch (error) {
        console.error('Error at PUT /communities/:communityId/join: ', error);
        return res.status(500).json({ message: 'Internal server error while adding user to the community.' });
    }
});

router.put('/:communityId/leave', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { communityId } = req.params;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        if (!community.members.includes(user._id)) {
            return res.status(200).json({ message: 'User already not in the community.' });
        }

        await Promise.all([
            Community.updateOne({ _id: community._id }, { $pull: { members: user._id } }),
            User.updateOne({ _id: user._id }, { $pull: { communityIDs: community._id } })
        ])

        return res.status(200).json({ message: 'Successfully removed user from the community.' });
    } catch (error) {
        console.error('Error at PUT /communities/:communityId/leave: ', error);
        return res.status(500).json({ message: 'Internal server error while removing user from the community.' });
    }
});

module.exports = router;
