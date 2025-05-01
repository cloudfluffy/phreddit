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
    let pattern = searchQuery.split(' ').filter(term => term);

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

module.exports = { populateCommentIDs, populateUserDisplayNameForComment, newestPosts, oldestPosts, activePosts, searchPosts };
