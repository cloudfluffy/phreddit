const express = require('express');

const Community = require('../models/communities');
const User = require('../models/users');

const { newestPosts, oldestPosts, activePosts, authenticate, attachUserIfAuthenticated } = require('../util');

const router = express.Router();

router.get('/', attachUserIfAuthenticated, async (req, res) => {
    try {
        const { user } = req;

        const communities = await Community.find({}).sort({ name: 1 }).populate({
            path: 'owner',
            select: 'displayName'
        });

        let joinedCommunities = [];
        let otherCommunities = [];

        if (user) {
            joinedCommunities = communities.filter(community => user.communityIDs.includes(community._id));
            otherCommunities = communities.filter(community => !user.communityIDs.includes(community._id));
        }

        return res.status(200).json({
            message: 'Successfully retrieved communities.',
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

        const community = await Community.findById(communityId).populate({
            path: 'owner',
            select: 'displayName'
        });

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        return res.status(200).json({ message: 'Successfully retrieved community.', community });
    } catch (error) {
        console.error('Error at GET /communities/:communityId: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving community.' });
    }
});

router.get('/:communityId/posts/newest', attachUserIfAuthenticated, async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = newestPosts(community.postIDs);
        return res.status(200).json({ message: 'Successfully retrieved posts.', posts });
    } catch (error) {
        console.error('Error at GET /:communityId/posts/newest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:communityId/posts/oldest', attachUserIfAuthenticated, async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = oldestPosts(community.postIDs);
        return res.status(200).json({ message: 'Successfully retrieved posts.', posts });
    } catch (error) {
        console.error('Error at GET /:communityId/posts/oldest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:communityId/posts/active', attachUserIfAuthenticated, async (req, res) => {
    try {
        const community = await Community.findOne({ _id: req.params.communityId }).populate('postIDs');
        const posts = await activePosts(community.postIDs);
        return res.status(200).json({ message: 'Successfully retrieved posts.', posts });
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
            return res.status(400).json({ message: 'Name and description are required.' });
        }

        const existingCommunity = await Community.findOne({ name });

        if (existingCommunity) {
            return res.status(400).json({ message: 'Community name already in use.', nameNotUnique: true });
        }

        const newCommunity = new Community({
            name,
            description,
            owner: user._id
        });

        newCommunity.members.push(user._id);

        const savedCommunity = await newCommunity.save();

        const [community] = await Promise.all([
            Community.findById(savedCommunity._id).populate({
                path: 'owner',
                select: 'displayName'
            }),
            User.updateOne({ _id: user._id }, { $push: { communityIDs: savedCommunity._id } })
        ]);

        return res.status(201).json({ message: 'Community created successfully.', community });
    } catch (error) {
        console.error('Error at POST /communities: ', error);
        return res.status(500).json({ message: 'Internal server error while creating community.' });
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
            return res.status(409).json({ message: 'User is already a member of the community.' });
        }

        await Promise.all([
            Community.updateOne({ _id: community._id }, { $push: { members: user } }),
            User.updateOne({ _id: user._id }, { $push: { communityIDs: community._id } })
        ])

        return res.status(200).json({ message: 'Successfully joined the community.' });
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
            return res.status(409).json({ message: 'User is currently not a member of the community.' });
        }

        await Promise.all([
            Community.updateOne({ _id: community._id }, { $pull: { members: user._id } }),
            User.updateOne({ _id: user._id }, { $pull: { communityIDs: community._id } })
        ])

        return res.status(200).json({ message: 'Successfully left the community.' });
    } catch (error) {
        console.error('Error at PUT /communities/:communityId/leave: ', error);
        return res.status(500).json({ message: 'Internal server error while removing user from the community.' });
    }
});

module.exports = router;
