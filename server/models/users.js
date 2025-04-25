const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator: email => emailRegex.test(email),
                message: "The email address format is invalid."
            }
        ]
    },
    displayName: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    memberSince: {
        type: Date,
        default: Date.now
    },
    reputation: {
        type: Number,
        default: 100
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    communityIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Community'
        }],
        default: []
    },
    postIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },
    upvotedPostIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },
    downvotedPostIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },
    commentIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    },
    upvotedCommentIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    },
    downvotedCommentIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    }
});

module.exports = mongoose.model('User', UserSchema);
