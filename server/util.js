const jwt = require('jsonwebtoken');

const Comment = require('./models/comments');
const Community = require('./models/communities');
const Post = require('./models/posts');
const User = require('./models/users');

const { JWT_SECRET } = require('./environment');

async function populateCommentIDs(toPopulate) {
    await toPopulate.populate('commentIDs');
    await Promise.all(toPopulate.commentIDs.map(commentID => populateCommentIDs(commentID)));
};

async function populateUserDisplayNameForComment(commentToPopulate) {
    await commentToPopulate.populate({ path: 'commentedBy', select: 'displayName' });
    await Promise.all(commentToPopulate.commentIDs.map(commentID => populateUserDisplayNameForComment(commentID)));
}

function newestPosts(posts) {
    const copy = Array.from(posts);

    copy.sort(({ postedDate: a }, { postedDate: b }) => {
        a = new Date(a);
        b = new Date(b);

        if (a.getTime() < b.getTime()) {
            return 1;
        } else if (a.getTime() === b.getTime()) {
            return 0;
        } else {
            return -1;
        }
    });

    return copy;
};

function oldestPosts(posts) {
    const copy = Array.from(posts);

    copy.sort(({ postedDate: a }, { postedDate: b }) => {
        a = new Date(a);
        b = new Date(b);

        if (a.getTime() < b.getTime()) {
            return -1;
        } else if (a.getTime() === b.getTime()) {
            return 0;
        } else {
            return 1;
        }
    });

    return copy;
};

async function activePosts(posts) {
    const copy = Array.from(posts);

    await Promise.all(copy.map(post => populateCommentIDs(post)));

    function mostRecentComment(commentIDs) {
        const queue = Array.from(commentIDs);
        let mostRecent = Number.MIN_SAFE_INTEGER;

        for (let i = 0; i < queue.length; i++) {
            mostRecent = Math.max(mostRecent, (new Date(queue[i].commentedDate)).getTime());

            for (let commentID of queue[i].commentIDs) {
                queue.push(commentID);
            }
        }

        return mostRecent;
    }

    copy.sort((a, b) => {
        const mostRecentA = mostRecentComment(a.commentIDs);
        const mostRecentB = mostRecentComment(b.commentIDs);

        if (mostRecentA < mostRecentB) {
            return 1;
        } else if (mostRecentA === mostRecentB) {
            a = new Date(a.postedDate);
            b = new Date(b.postedDate);

            if (a.getTime() < b.getTime()) {
                return 1;
            } else if (a.getTime() === b.getTime()) {
                return 0;
            } else {
                return -1;
            }
        } else {
            return -1;
        }
    });

    return copy;
};

async function searchPosts(searchQuery, posts) {
    let pattern = searchQuery.split(' ').filter(term => term).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    if (pattern.length === 0) {
        return [];
    }

    pattern = pattern.reduce((previousValue, currentValue) => `${previousValue}|${currentValue}`);
    const regex = new RegExp(pattern, 'i');

    await Promise.all(posts.map(post => populateCommentIDs(post)));

    function searchComments(commentIDs) {
        const queue = Array.from(commentIDs);

        for (let i = 0; i < queue.length; i++) {
            if (queue[i].content.match(regex)) {
                return true;
            }

            for (let commentID of queue[i].commentIDs) {
                queue.push(commentID);
            }
        }

        return false;
    }

    const searchResult = [];

    for (let post of posts) {
        if (post.title.match(regex)) {
            searchResult.push(post);
            continue;
        }

        if (post.content.match(regex)) {
            searchResult.push(post);
            continue;
        }

        if (searchComments(post.commentIDs)) {
            searchResult.push(post);
            continue;
        }
    }

    return searchResult;
}

async function authenticate(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Request denied. No token provided.' });
    }

    try {
        const { userId } = jwt.verify(token, JWT_SECRET);

        try {
            const user = await User.findById(userId);

            if (!user) {
                return res.status(401).json({ message: 'Request denied. User not found.' });
            }

            req.user = user;

            return next();
        } catch (error) {
            console.error('Error at authenticate: ', error);
            return res.status(500).json({ message: 'Internal server error while retrieving user.' });
        }
    } catch (error) {
        console.error('JWT verification failed at authenticate: ', error);
        return res.status(401).json({ message: 'Request denied. Invalid or expired token.' });
    }
}

async function attachUserIfAuthenticated(req, res, next) {
    const token = req.cookies.token;

    if (token) {
        try {
            const { userId } = jwt.verify(token, JWT_SECRET);

            try {
                const user = await User.findById(userId);

                if (user) {
                    req.user = user;
                }
            } catch (error) {
                console.error('Error at attachUserIfAuthenticated: ', error);
                return res.status(500).json({ message: 'Internal server error while retrieving user.' });
            }
        } catch (error) {
            console.error('JWT verification failed at attachUserIfAuthenticated: ', error);
        }
    }

    return next();
}

async function retrievePosts(req, res, sort) {
    const { user } = req;

    let posts = await Post.find({}).populate([{
        path: 'communityID',
        select: 'name members'
    }, {
        path: 'postedBy',
        select: 'displayName'
    }, {
        path: 'linkFlairID'
    }]);

    await Promise.all(posts.map(post => populateCommentIDs(post)));
    await Promise.all(posts.flatMap(post => post.commentIDs.map(commentID => populateUserDisplayNameForComment(commentID))));

    posts = await sort(posts);

    let postsFromJoinedCommunities = [];
    let postsFromOtherCommunities = [];

    if (user) {
        postsFromJoinedCommunities = posts.filter(post => user.communityIDs.includes(post.communityID._id));
        postsFromOtherCommunities = posts.filter(post => !user.communityIDs.includes(post.communityID._id));
    }

    return res.status(200).json({
        message: 'Successfully retrieved posts.',
        posts,
        postsFromJoinedCommunities,
        postsFromOtherCommunities
    });
}

async function retrieveQueryPosts(req, res, sort) {
    const { user } = req;
    const { query } = req.query;

    let posts = await Post.find({}).populate([{
        path: 'communityID',
        select: 'name members'
    }, {
        path: 'postedBy',
        select: 'displayName'
    }, {
        path: 'linkFlairID'
    }]);
    posts = await searchPosts(query, posts);

    await Promise.all(posts.map(post => populateCommentIDs(post)));
    await Promise.all(posts.flatMap(post => post.commentIDs.map(commentID => populateUserDisplayNameForComment(commentID))));

    posts = await sort(posts);

    let postsFromJoinedCommunities = [];
    let postsFromOtherCommunities = [];

    if (user) {
        postsFromJoinedCommunities = posts.filter(post => user.communityIDs.includes(post.communityID._id));
        postsFromOtherCommunities = posts.filter(post => !user.communityIDs.includes(post.communityID._id));
    }

    return res.status(200).json({
        message: 'Successfully retrieved posts',
        posts,
        postsFromJoinedCommunities,
        postsFromOtherCommunities
    });
}

async function retrievePostsOfCommunity(req, res, sort) {
    const { communityId } = req.params;

    let { postIDs: posts } = await Community.findById(communityId).populate('postIDs');

    posts = await Post.populate(posts, [{
        path: 'postedBy',
        select: 'displayName'
    }, {
        path: 'linkFlairID'
    }]);

    await Promise.all(posts.map(post => populateCommentIDs(post)));
    await Promise.all(posts.flatMap(post => post.commentIDs.map(commentID => populateUserDisplayNameForComment(commentID))));

    posts = await sort(posts);

    return res.status(200).json({ message: 'Successfully retrieved posts.', posts });
}

async function deleteComment(comment) {
    await Promise.all([
        Comment.deleteOne({ _id: comment._id }),
        User.updateOne({ _id: comment.commentedBy }, { $pull: { commentIDs: comment._id, upvotedCommentIDs: comment._id, downvotedCommentIDs: comment._id } }),
        Post.updateOne({ _id: comment.postID }, { $pull: { commentIDs: comment._id } })
    ]);
}

async function getAllNestedComments(comment) {
    const stack = [comment];
    const allComments = [];

    while (stack.length > 0) {
        const current = stack.pop();
        await current.populate('commentIDs');

        allComments.push(current);

        for (let commentID of current.commentIDs) {
            stack.push(commentID);
        }
    }

    return allComments;
}

async function deleteCommentAndItsReplies(comment) {
    const comments = await getAllNestedComments(comment);
    await Promise.all(comments.map(comment => deleteComment(comment)));
}

async function deletePostAndItsComments(post) {
    await post.populate('commentIDs');

    await Promise.all([
        Post.deleteOne({ _id: post._id }),
        User.updateOne({ _id: post.postedBy }, { $pull: { postIDs: post._id, upvotedPostIDs: post._id, downvotedPostIDs: post._id } }),
        Community.updateOne({ _id: post.communityID }, { $pull: { postIDs: post._id } }),
        ...post.commentIDs.map(commentID => deleteCommentAndItsReplies(commentID))
    ]);
}

async function deleteCommunityAndItsPosts(community) {
    await community.populate('postIDs');

    await Promise.all([
        Community.deleteOne({ _id: community._id }),
        User.updateMany({ communityIDs: community._id }, { $pull: { communityIDs: community._id } }),
        ...community.postIDs.map(postID => deletePostAndItsComments(postID))
    ]);
}

async function deleteUser(user) {
    let communities = await Community.find({});

    await Promise.all(communities.map(community => Community.updateOne({ _id: community._id }, { $pull: { members: user._id } })));

    communities = communities.filter(community => community.owner.equals(user._id));

    await Promise.all(communities.map(community => deleteCommunityAndItsPosts(community)));

    user = await User.findById(user._id).populate('postIDs');

    await Promise.all(user.postIDs.map(postID => deletePostAndItsComments(postID)));

    user = await User.findById(user._id).populate('commentIDs');

    await Promise.all(user.commentIDs.map(commentID => deleteCommentAndItsReplies(commentID)));

    await User.deleteOne({ _id: user._id });
}

module.exports = {
    populateCommentIDs,
    populateUserDisplayNameForComment,
    newestPosts,
    oldestPosts,
    activePosts,
    searchPosts,
    authenticate,
    attachUserIfAuthenticated,
    retrievePosts,
    retrieveQueryPosts,
    retrievePostsOfCommunity,
    deleteCommentAndItsReplies,
    deletePostAndItsComments,
    deleteCommunityAndItsPosts,
    deleteUser
};
