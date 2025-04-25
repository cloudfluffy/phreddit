const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;

const CommentSchema = new Schema({
    content: {
        type: String,
        required: true,
        validate: [
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
            },
            {
                validator: content => content.trim().length > 0,
                message: 'The content should not be empty.'
            },
            {
                validator: content => content.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length <= 500,
                message: 'The content should not exceed 500 characters in length.'
            }
        ]
    },
    commentedDate: {
        type: Date,
        default: Date.now
    },
    voteCount: {
        type: Number,
        default: 0
    },
    commentedBy: {
        type: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        required: true
    },
    commentIDs: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],
        default: []
    }
});

module.exports = mongoose.model('Comment', CommentSchema);
