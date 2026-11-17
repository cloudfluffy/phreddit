const http = require('http');

const bcryptjs = require('bcryptjs');

const mongoose = require('mongoose');

const Comment = require('./models/comments');
const Community = require('./models/communities');
const Post = require('./models/posts');
const User = require('./models/users');

const comments = [];

test('server deletes user, post, comments, and community with proper authentication', async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/phreddit');
        console.log('MongoDB connected.\n');
    } catch (error) {
        console.error(`MongoDB connection error: ${error}.`)
        process.exit(1);
    }

    const admin = await createUser({
        firstName: 'JestTest',
        lastName: 'JestTest',
        email: 'jesttest@phreddit.com',
        displayName: 'jesttest',
        password: '1234',
        isAdmin: true
    });

    const community = await createCommunity({
        name: 'JestTest',
        description: 'JestTest',
        members: [admin],
        owner: admin,
        postIDs: [{
            title: 'JestTest',
            content: 'JestTest',
            postedBy: admin,
            commentIDs: [{
                content: 'JestTest',
                commentedBy: admin,
                commentIDs: [{
                    content: 'JestTest',
                    commentedBy: admin
                }, {
                    content: 'JestTest',
                    commentedBy: admin,
                    commentIDs: [{
                        content: 'JestTest',
                        commentedBy: admin,
                        commentIDs: [{
                            content: 'JestTest',
                            commentedBy: admin
                        }, {
                            content: 'JestTest',
                            commentedBy: admin
                        }]
                    }]
                }, {
                    content: 'JestTest',
                    commentedBy: admin
                }]
            }, {
                content: 'JestTest',
                commentedBy: admin
            }]
        }]
    });

    const { postIDs: [post] } = community;

    let cookie;

    await new Promise(resolve => {
        const data = JSON.stringify({
            email: 'jesttest@phreddit.com',
            password: '1234'
        });

        const req = http.request('http://localhost:8000/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, res => {
            const rawCookies = res.headers['set-cookie'];
            cookie = rawCookies?.map(cookie => cookie.split(';')[0]).join('; ');

            res.on('data', () => { });

            res.on('end', () => resolve());
        })

        req.write(data);

        req.end();
    });

    await new Promise(resolve => {
        const req = http.request(`http://localhost:8000/posts/${post._id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': cookie
            },
        }, res => {
            res.on('data', () => { });

            res.on('end', async () => {
                const responses = await Promise.all([
                    Post.findById(post._id),
                    ...comments.map(comment => Comment.findById(comment._id))
                ])

                responses.forEach(response => expect(response).toBe(null));

                const user = await User.findById(admin._id);

                expect(user.postIDs.length).toBe(0);

                expect(user.commentIDs.length).toBe(0);

                const { postIDs } = await Community.findById(community._id);

                expect(postIDs.length).toBe(0);

                resolve();
            });
        });

        req.end();
    })

    await new Promise(resolve => {
        const req = http.request(`http://localhost:8000/communities/${community._id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': cookie
            }
        }, res => {
            res.on('data', () => { });

            res.on('end', async () => {
                const existingCommunity = await Community.findById(community._id);

                expect(existingCommunity).toBe(null);

                resolve();
            });
        });

        req.end();
    });

    await new Promise(resolve => {
        const req = http.request(`http://localhost:8000/users/${admin._id}`, {
            method: 'DELETE',
            headers: {
                'Cookie': cookie
            }
        }, res => {
            res.on('data', () => { });

            res.on('end', async () => {
                const user = await User.findById(admin._id);

                expect(user).toBe(null);

                resolve();
            })
        });

        req.end();
    });

    await mongoose.connection.close();
});

async function createCommunity(community) {
    try {
        const newCommunity = new Community({
            name: community.name,
            description: community.description,
            owner: community.owner,
            members: community.members
        });

        if (community.postIDs) {
            newCommunity.postIDs = await Promise.all(community.postIDs.map(postID => {
                postID.communityID = newCommunity;
                return createPost(postID);
            }));
        }

        const savedCommunity = await newCommunity.save();
        await Promise.all(savedCommunity.members.map(member => User.findByIdAndUpdate(member._id, { $push: { communityIDs: savedCommunity } })));

        return savedCommunity;
    } catch (error) {
        console.error('Error at createCommunity: ', error);
        process.exit(1);
    }
}

async function createPost(post) {
    try {
        const newPost = new Post({
            title: post.title,
            content: post.content,
            communityID: post.communityID,
            postedBy: post.postedBy
        });

        if (post.commentIDs) {
            newPost.commentIDs = await Promise.all(post.commentIDs.map(commentID => createComment({ ...commentID, postID: newPost })));
        }

        const savedPost = await newPost.save();
        await User.findByIdAndUpdate(savedPost.postedBy._id, { $push: { postIDs: savedPost } });

        return savedPost;
    } catch (error) {
        console.error('Error at createPost: ', error);
        process.exit(1);
    }
}

async function createComment(comment) {
    try {
        const newComment = new Comment({
            content: comment.content,
            postID: comment.postID,
            commentedBy: comment.commentedBy
        });

        if (comment.commentIDs) {
            newComment.commentIDs = await Promise.all(comment.commentIDs.map(commentID => createComment({ ...commentID, postID: comment.postID })));
        }

        const savedComment = await newComment.save();
        await User.findByIdAndUpdate(comment.commentedBy._id, { $push: { commentIDs: savedComment } });

        comments.push(savedComment);

        return savedComment;
    } catch (error) {
        console.log('Error at createComment: ', error);
        process.exit(1);
    }
}

async function createUser(user) {
    try {
        const saltRounds = 10;
        const passwordHash = await bcryptjs.hash(user.password, saltRounds);

        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            displayName: user.displayName,
            passwordHash: passwordHash
        });

        if (user.isAdmin) {
            newUser.isAdmin = user.isAdmin;
        }

        const savedUser = await newUser.save();

        return savedUser;
    } catch (error) {
        console.error('Error at createUser: ', error);
        process.exit(1);
    }
}
