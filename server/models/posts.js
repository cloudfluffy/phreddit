const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true,
        validate: [
            {
                validator: title => title.trim().length > 0,
                message: 'The title should not be empty.'
            },
            {
                validator: title => title.trim().length <= 100,
                message: 'The title should not exceed 100 characters in length.'
            }
        ]
    },
    content: {
        type: String,
        required: true,
        validate: [
            {
                validator: content => content.trim().length > 0,
                message: 'The content should not be empty.'
            },
            {
                validator: content => {
                    return [...content.matchAll(hyperlinkRegex)].every(match => match[1].trim().length > 0);
                },
                message: 'The hyperlink name should not be empty.'
            },
            {
                validator: content => {
                    return [...content.matchAll(hyperlinkRegex)].every(match => match[2].match(/^https?:\/\//));
                },
                message: 'The URL should start with "https://" or "http://".'
            }
        ]
    },
    linkFlairID: {
        type: Schema.Types.ObjectId,
        ref: 'LinkFlair'
    },
    postedBy: {
        type: String,
        required: true,
        validate: [
            {
                validator: postedBy => postedBy.trim().length > 0,
                message: 'The username should not be empty.'
            }
        ]
    },
    postedDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    commentIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    },
    views: {
        type: Number,
        required: true,
        default: 0
    }
});

PostSchema.virtual('url').get(function () {
    return this._id;
});

module.exports = mongoose.model('Post', PostSchema);
