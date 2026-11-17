const mongoose = require('mongoose');

const { PORT, MONGODB_URL, CLIENT_ORIGIN } = require('./environment');

mongoose.connect(MONGODB_URL)
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
    origin: CLIENT_ORIGIN,
    credentials: true
}));

app.use(cookieParser());

app.use(express.json());

app.use('/comments', commentRoutes);

app.use('/communities', communityRoutes);

app.use('/linkflairs', linkFlairRoutes);

app.use('/posts', postRoutes);

app.use('/users', userRoutes);

const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
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
