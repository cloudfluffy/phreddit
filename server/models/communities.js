const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;

const CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
        validate: [
            {
                validator: name => name.trim().length > 0,
                message: 'The community name should not be empty.'
            },
            {
                validator: name => name.trim().length <= 100,
                message: 'The community name should not exceed 100 characters.'
            }
        ]
    },
    description: {
        type: String,
        required: true,
        validate: [
            {
                validator: description => {
                    return [...description.matchAll(hyperlinkRegex)].every(match => match[1].trim().length > 0);
                },
                message: 'The hyperlink name should not be empty.'
            },
            {
                validator: description => {
                    return [...description.matchAll(hyperlinkRegex)].every(match => match[2].match(/^https?:\/\//));
                },
                message: 'The URL should start with "https://" or "http://".'
            },
            {
                validator: description => description.trim().length > 0,
                message: 'The description should not be empty.'
            },
            {
                validator: description => description.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length <= 500,
                message: 'The description should not exceed 500 characters in length.'
            }
        ]
    },
    postIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
        default: []
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    members: {
        type: [{
            type: String
        }],
        required: true,
        validate: [{
            validator: members => members.length >= 1,
            message: 'Community must have at least one member.'
        }]
    }
}, {
    toJSON: { virtuals: true }
});

CommunitySchema.virtual('url').get(function () {
    return this._id;
});

CommunitySchema.virtual('memberCount').get(function () {
    return this.members.length;
});

module.exports = mongoose.model('Community', CommunitySchema);
