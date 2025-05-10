const express = require('express');

const Community = require('../models/communities');
const User = require('../models/users');

const { newestPosts, oldestPosts, activePosts, authenticate, attachUserIfAuthenticated, retrievePostsOfCommunity, deleteCommunityAndItsPosts } = require('../util');

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
        return retrievePostsOfCommunity(req, res, newestPosts);
    } catch (error) {
        console.error('Error at GET /:communityId/posts/newest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:communityId/posts/oldest', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrievePostsOfCommunity(req, res, oldestPosts);
    } catch (error) {
        console.error('Error at GET /:communityId/posts/oldest: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.get('/:communityId/posts/active', attachUserIfAuthenticated, async (req, res) => {
    try {
        return retrievePostsOfCommunity(req, res, activePosts);
    } catch (error) {
        console.error('Error at GET /:communityId/posts/active: ', error);
        return res.status(500).json({ message: 'Internal server error while retrieving posts.' });
    }
});

router.post('/', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { name, description } = req.body;
        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let match;

        if (!name?.trim() || !description?.trim()) {
            return res.status(400).json({ message: 'Name and description are required.' });
        }

        while ((match = hyperlinkRegex.exec(description)) !== null) {
            if (!match[1].trim() || !match[2].match(/^https?:\/\//)) {
                return res.status(400).json({ message: 'The hyperlink name is empty or the URL did not start with "https://" or "http://".' });
            }
        }

        const descriptionLength = description.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;

        if (!descriptionLength) {
            return res.status(400).json({ message: 'The content should not be empty.' });
        }

        if (descriptionLength > 500) {
            return res.status(400).json({ message: 'The content should not exceed 500 characters in length.' });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({ message: 'The community name should not exceed 100 characters in length.' });
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

router.put('/:communityId/edit', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { communityId } = req.params;
        const { name, description } = req.body;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist.' });
        }

        if (!community.owner.equals(user._id) && !user.isAdmin) {
            return res.status(403).json({ message: "You're not the owner of the community." });
        }

        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let match;

        if (!name?.trim() || !description?.trim()) {
            return res.status(400).json({ message: 'Name and description are required.' });
        }

        while ((match = hyperlinkRegex.exec(description)) !== null) {
            if (!match[1].trim() || !match[2].match(/^https?:\/\//)) {
                return res.status(400).json({ message: 'The hyperlink name is empty or the URL did not start with "https://" or "http://".' });
            }
        }

        const descriptionLength = description.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;

        if (!descriptionLength) {
            return res.status(400).json({ message: 'The content should not be empty.' });
        }

        if (descriptionLength > 500) {
            return res.status(400).json({ message: 'The content should not exceed 500 characters in length.' });
        }

        if (name.trim().length > 100) {
            return res.status(400).json({ message: 'The community name should not exceed 100 characters in length.' });
        }

        const existingCommunity = await Community.findOne({ name });

        if (!existingCommunity._id.equals(communityId) && existingCommunity) {
            return res.status(400).json({ message: 'Community name already in use.', nameNotUnique: true });
        }

        const updatedCommunity = await Community.findByIdAndUpdate(
            communityId,
            { name, description },
            { new: true }
        ).populate({
            path: 'owner',
            select: 'displayName'
        });

        return res.status(200).json({ message: 'Successfully edited the community.', community: updatedCommunity });
    } catch (error) {
        console.error('Error at PUT /communities/:communityId/edit: ', error);
        return res.status(500).json({ message: 'Internal server error while editing community.' });
    }
});

router.delete('/:communityId', authenticate, async (req, res) => {
    try {
        const { user } = req;
        const { communityId } = req.params;

        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(400).json({ message: 'Community does not exist' });
        }

        if (!community.owner.equals(user._id) && !user.isAdmin) {
            return res.status(403).json({ message: "You're not the owner of the community." });
        }

        await deleteCommunityAndItsPosts(community);

        return res.status(200).json({ message: 'Successfully deleted the community.' });
    } catch (error) {
        console.error('Error at DELETE /communities/:communityId: ', error);
        return res.status(500).json({ message: 'Internal server error while deleting community.' });
    }
});

module.exports = router;
