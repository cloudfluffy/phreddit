const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const Comment = require('./models/comments');
const Community = require('./models/communities');
const LinkFlair = require('./models/linkflairs');
const Post = require('./models/posts');
const User = require('./models/users');

const args = process.argv.slice(2);
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (args.length < 4) {
    console.error('You should provide four arguments.');
    console.error('The first argument should be a MongoDB URL.');
    console.error('The second argument should be the email address for the admin account.');
    console.error('The third argument should be the display name for the admin account.');
    console.error('The fourth argument should be the password for the admin account.');
    process.exit(1);
}

if (!args[0].startsWith('mongodb')) {
    console.error('The first argument should be a MongoDB URL.');
    process.exit(1);
}

if (!emailRegex.test(args[1])) {
    console.error('The second argument should be a valid email address.');
    process.exit(1);
}

main();

async function main() {
    // mongodb://127.0.0.1:27017/phreddit
    try {
        await mongoose.connect(args[0]);
        console.log('MongoDB connected.\n');
    } catch (error) {
        console.error(`MongoDB connection error: ${error}.`)
        process.exit(1);
    }

    await Promise.all([Comment.deleteMany({}), Community.deleteMany({}), LinkFlair.deleteMany({}), Post.deleteMany({}), User.deleteMany({})]);
    console.log('Emptied Comment collection.\nEmptied Community collection.\nEmptied LinkFlair collection.\nEmptied Post collection.\nEmptied User collection.\n');

    const users = {};

    const savedUsers = await initializeUsers([
        {
            firstName: 'Liam',
            lastName: 'Carter',
            email: 'rollo@phreddit.com',
            displayName: 'rollo',
            password: '1234'
        },
        {
            firstName: 'Ava',
            lastName: 'Mitchell',
            email: 'shemp@phreddit.com',
            displayName: 'shemp',
            password: '1234'
        },
        {
            firstName: 'Noah',
            lastName: 'Bennett',
            email: 'catlady13@phreddit.com',
            displayName: 'catlady13',
            password: '1234'
        },
        {
            firstName: 'Sophia',
            lastName: 'Hayes',
            email: 'astyanax@phreddit.com',
            displayName: 'astyanax',
            password: '1234'
        },
        {
            firstName: 'Ethan',
            lastName: 'Brooks',
            email: 'truckfan69@phreddit.com',
            displayName: 'truckfan69',
            password: '1234'
        },
        {
            firstName: 'Mia',
            lastName: 'Sullivan',
            email: 'MarcoArelius@phreddit.com',
            displayName: 'MarcoArelius',
            password: '1234'
        },
        {
            firstName: 'Lucas',
            lastName: 'Parker',
            email: 'outtheretruth47@phreddit.com',
            displayName: 'outtheretruth47',
            password: '1234'
        },
        {
            firstName: 'Isabella',
            lastName: 'Cooper',
            email: 'bigfeet@phreddit.com',
            displayName: 'bigfeet',
            password: '1234'
        },
        {
            firstName: 'Bad',
            lastName: 'Reputation',
            email: 'badreputation@phreddit.com',
            displayName: 'badreputation',
            password: '1234',
            reputation: 40
        }
    ]);

    savedUsers.forEach(savedUser => users[savedUser.displayName] = savedUser);

    const lf1 = await createLinkFlair({ content: 'The jerkstore called...' });
    const lf3 = await createLinkFlair({ content: 'The walk among us' });

    await Promise.all([
        createCommunity({
            name: 'Am I the Jerk?',
            description: 'A practical application of the principles of justice.',
            startDate: 'August 10, 2024 04:18:00',
            members: [users[args[2]], users.rollo, users.shemp, users.catlady13, users.astyanax, users.truckfan69],
            owner: users[args[2]],
            postIDs: [{
                title: 'AITJ: I parked my cybertruck in the handicapped spot to protect it from bitter, jealous losers.',
                content: 'Recently I went to the store in my brand new Tesla cybertruck. I know there are lots of haters out there, so I wanted to make sure my truck was protected. So I parked it so it overlapped with two of those extra-wide handicapped spots. When I came out of the store with my beef jerky someone in a wheelchair was shouting at me. So tell me prhreddit, was I the jerk?',
                postedDate: 'August 23, 2024 01:19:00',
                views: 14,
                linkFlairID: lf1,
                postedBy: users.truckfan69,
                commentIDs: [{
                    content: 'There is no higher calling than the protection of Tesla products. God bless you sir and God bless Elon Musk. Oh, NTJ.',
                    commentedDate: 'August 23, 2024 08:22:00',
                    commentedBy: users.shemp,
                    commentIDs: [{
                        content: 'My brother in Christ, are you ok? Also, YTJ.',
                        commentedDate: 'August 23, 2024 09:31:00',
                        commentedBy: users.rollo
                    }]
                }, {
                    content: 'Obvious rage bait, but if not, then you are absolutely the jerk in this situation. Please delete your Tron vehicle and leave is in peace. YTJ.',
                    commentedDate: 'August 23, 2024 10:57:00',
                    commentedBy: users.astyanax
                }]
            }]
        }),
        createCommunity({
            name: 'The History Channel',
            description: 'A fantastical reimagining of our past and present.',
            startDate: 'May 4, 2024 08:32:00',
            members: [users[args[2]], users.MarcoArelius, users.astyanax, users.outtheretruth47, users.bigfeet],
            owner: users[args[2]],
            postIDs: [{
                title: 'Remember when this was a HISTORY channel?',
                content: 'Does anyone else remember when they used to show actual historical content on this channel and not just an endless stream of alien encounters, conspiracy theories, and cryptozoology? I do.\nBut, I am pretty sure I was abducted last night just as described in that show from last week, "Finding the Alien Within". Just thought I\'d let you all know.',
                postedDate: 'September 9, 2024 14:24:00',
                views: 1023,
                linkFlairID: lf3,
                postedBy: users.MarcoArelius,
                commentIDs: [{
                    content: 'The truth is out there.',
                    commentedDate: 'September 10, 2024 6:41:00',
                    commentedBy: users.astyanax,
                    commentIDs: [{
                        content: 'I want to believe.',
                        commentedDate: 'September 10, 2024 07:18:00',
                        commentedBy: users.outtheretruth47,
                        commentIDs: [{
                            content: 'Generic poster slogan #42',
                            commentedDate: 'September 10, 2024 09:43:00',
                            commentedBy: users.bigfeet
                        }]
                    }]
                }, {
                    content: 'The same thing happened to me. I guest this channel does still show real history.',
                    commentedDate: 'September 09, 2024 017:03:00',
                    commentedBy: users.bigfeet
                }]
            }]
        })
    ]);

    const commentCollection = await Comment.find({});

    for (let comment of commentCollection) {
        console.log(`Comment ${comment._id}:`);
        console.log(`\tcontent: ${comment.content}`);
        console.log(`\tcommentedDate: ${comment.commentedDate}`);
        console.log(`\tvoteCount: ${comment.voteCount}`);
        console.log(`\tcommentedBy: ${comment.commentedBy}`);
        console.log(`\tcommentIDs: [${comment.commentIDs}]\n`);
    }

    const communityCollection = await Community.find({});

    for (let community of communityCollection) {
        console.log(`Community ${community._id}:`);
        console.log(`\tname: ${community.name}`);
        console.log(`\tdescription: ${community.description}`);
        console.log(`\tstartDate: ${community.startDate}`);
        console.log(`\towner: ${community.owner}`);
        console.log(`\tmembers: [${community.members}]`);
        console.log(`\tpostIDs: ${community.postIDs}`);
        console.log(`\tmemberCount: ${community.memberCount}\n`);
    }

    const linkFlairCollection = await LinkFlair.find({});

    for (let linkFlair of linkFlairCollection) {
        console.log(`LinkFlair ${linkFlair._id}:`);
        console.log(`\tcontent: ${linkFlair.content}\n`);
    }

    const postCollection = await Post.find({});

    for (let post of postCollection) {
        console.log(`Post ${post._id}:`);
        console.log(`\ttitle: ${post.title}`);
        console.log(`\tcontent: ${post.content}`);
        console.log(`\tpostedDate: ${post.postedDate}`);
        console.log(`\tviews: ${post.views}`);
        console.log(`\tvoteCount: ${post.voteCount}`);
        console.log(`\tcommunityID: ${post.communityID}`);
        console.log(`\tpostedBy: ${post.postedBy}`);
        console.log(`\tlinkFlairID: ${post.linkFlairID}`);
        console.log(`\tcommentIDs: [${post.commentIDs}]\n`);
    }

    const userCollection = await User.find({});

    for (let user of userCollection) {
        console.log(`User ${user._id}:`);
        console.log(`\tfirstName: ${user.firstName}`);
        console.log(`\tlastName: ${user.lastName}`);
        console.log(`\temail: ${user.email}`);
        console.log(`\tdisplayName: ${user.displayName}`);
        console.log(`\tpasswordHash: ${user.passwordHash}`);
        console.log(`\tmemberSince: ${user.memberSince}`);
        console.log(`\treputation: ${user.reputation}`);
        console.log(`\tisAdmin: ${user.isAdmin}`);
        console.log(`\tcommunityIDs: [${user.communityIDs}]`);
        console.log(`\tpostIDs: [${user.postIDs}]`);
        console.log(`\tupvotedPostIDs: [${user.upvotedPostIDs}]`);
        console.log(`\tdownvotedPostIDs: [${user.downvotedPostIDs}]`);
        console.log(`\tcommentIDs: [${user.commentIDs}]`);
        console.log(`\tupvotedCommentIDs: [${user.upvotedCommentIDs}]`);
        console.log(`\tdownvotedCommentIDs: [${user.downvotedCommentIDs}]\n`);
    }

    process.exit(0);
}

async function createCommunity(community) {
    try {
        const newCommunity = new Community({
            name: community.name,
            description: community.description,
            startDate: new Date(community.startDate),
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
            postedDate: new Date(post.postedDate),
            views: post.views,
            communityID: post.communityID,
            postedBy: post.postedBy
        });

        if (post.linkFlairID) {
            newPost.linkFlairID = post.linkFlairID;
        }

        if (post.commentIDs) {
            newPost.commentIDs = await Promise.all(post.commentIDs.map(commentID => createComment(commentID)));
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
            commentedDate: new Date(comment.commentedDate),
            commentedBy: comment.commentedBy
        });

        if (comment.commentIDs) {
            newComment.commentIDs = await Promise.all(comment.commentIDs.map(commentID => createComment(commentID)));
        }

        const savedComment = await newComment.save();
        await User.findByIdAndUpdate(comment.commentedBy._id, { $push: { commentIDs: savedComment } });

        return savedComment;
    } catch (error) {
        console.error('Error at createComment: ', error);
        process.exit(1);
    }
}

async function createUser(user) {
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(user.password, saltRounds);

        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            displayName: user.displayName,
            passwordHash: passwordHash
        });

        if (user.reputation) {
            newUser.reputation = user.reputation;
        }

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

async function initializeUsers(users) {
    try {
        const savedAdmin = await createUser({
            firstName: 'Phreddit',
            lastName: 'Admin',
            email: args[1],
            displayName: args[2],
            password: args[3],
            reputation: 1000,
            isAdmin: true
        });

        const savedUsers = await Promise.all(users.map(user => createUser(user)));

        return [savedAdmin, ...savedUsers];
    } catch (error) {
        console.error('Error at initializeUsers: ', error);
        process.exit(1);
    }
}

async function createLinkFlair(linkFlair) {
    try {
        const newLinkFlair = new LinkFlair({
            content: linkFlair.content
        });

        const savedLinkFlair = await newLinkFlair.save();

        return savedLinkFlair;
    } catch (error) {
        console.error('Error at createLinkFlair: ', error);
        process.exit(1);
    }
}
