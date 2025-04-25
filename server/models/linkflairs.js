const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LinkFlairSchema = new Schema({
    content: {
        type: String,
        required: true,
        validate: [
            {
                validator: content => content.trim().length > 0,
                message: 'A link flair should not be empty.'
            },
            {
                validator: content => content.trim().length <= 30,
                message: 'A link flair should not exceed 30 characters in length.'
            }
        ]
    }
});

module.exports = mongoose.model('LinkFlair', LinkFlairSchema);
