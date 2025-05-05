const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/phreddit')
    .then(() => console.log('MongoDB connected.'))
    .catch(error => console.log(`MongoDB connection error: ${error}.`));

const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();

const commentRoutes = require('./routes/comments');
const communityRoutes = require('./routes/communities');
const linkFlairRoutes = require('./routes/linkflairs');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/users.js');

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.use('/comments', commentRoutes);

app.use('/communities', communityRoutes);

app.use('/linkflairs', linkFlairRoutes);

app.use('/posts', postRoutes);

app.use('/users', userRoutes);

const server = app.listen(8000, () => {
    console.log('Server listening on port 8000...');
});

process.on('SIGINT', () => {
    server.close(async error => {
        if (error) {
            console.error('Error while closing the server: ', error);
            process.exit(1);
        }

        try {
            await mongoose.disconnect();
        } catch (error) {
            console.error('Error while disconnecting MongoDB: ', error);
            process.exit(1);
        }

        console.log('Server closed. Database instance disconnected.');
        process.exit(0);
    });
});
