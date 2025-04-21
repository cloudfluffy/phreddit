const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/phreddit')
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(`MongoDB connection error: ${error}.`));

const cors = require('cors');
const express = require('express');

const app = express();

const community_routes = require('./routes/communities');
const linkflair_routes = require('./routes/linkflairs');
const post_routes = require('./routes/posts');
const comment_routes = require('./routes/comments');

app.use(cors());

app.use(express.json());

app.use('/communities', community_routes);

app.use('/linkflairs', linkflair_routes);

app.use('/posts', post_routes);

app.use('/comments', comment_routes);

const server = app.listen(8000, () => {
    console.log('Server listening on port 8000...');
});

process.on('SIGINT', () => {
    server.close(async error => {
        if (error) {
            console.error('Error while closing the server:', error);
            process.exit(1);
        }

        try {
            await mongoose.disconnect();
        } catch (error) {
            console.error('Error while disconnecting MongoDB:', error);
            process.exit(1);
        }

        console.log('Server closed. Database instance disconnected.');
        process.exit(0);
    });
});
