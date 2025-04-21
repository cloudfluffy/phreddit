async function populate_commentIDs(to_populate) {
    await to_populate.populate('commentIDs');
    await Promise.all(to_populate.commentIDs.map(commentID => populate_commentIDs(commentID)));
};

function newest_posts(posts) {
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

function oldest_posts(posts) {
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

async function active_posts(posts) {
    const copy = Array.from(posts);

    await Promise.all(copy.map(post => populate_commentIDs(post)));

    function most_recent_comment(commentIDs) {
        const queue = Array.from(commentIDs);
        let most_recent = Number.MIN_SAFE_INTEGER;

        for (let i = 0; i < queue.length; i++) {
            most_recent = Math.max(most_recent, (new Date(queue[i].commentedDate)).getTime());

            for (let commentID of queue[i].commentIDs) {
                queue.push(commentID);
            }
        }

        return most_recent;
    }

    copy.sort((a, b) => {
        const most_recentA = most_recent_comment(a.commentIDs);
        const most_recentB = most_recent_comment(b.commentIDs);

        if (most_recentA < most_recentB) {
            return 1;
        } else if (most_recentA === most_recentB) {
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

async function search_posts(search_query, posts) {
    let pattern = search_query.split(' ').filter(term => term);

    if (pattern.length === 0) {
        return [];
    }

    pattern = pattern.reduce((previousValue, currentValue) => `${previousValue}|${currentValue}`);
    const regex = new RegExp(pattern, 'i');

    await Promise.all(posts.map(post => populate_commentIDs(post)));

    function search_comments(commentIDs) {
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

    const search_result = [];

    for (let post of posts) {
        if (post.title.match(regex)) {
            search_result.push(post);
            continue;
        }

        if (post.content.match(regex)) {
            search_result.push(post);
            continue;
        }

        if (search_comments(post.commentIDs)) {
            search_result.push(post);
            continue;
        }
    }

    return search_result;
}

module.exports = { populate_commentIDs, newest_posts, oldest_posts, active_posts, search_posts };
