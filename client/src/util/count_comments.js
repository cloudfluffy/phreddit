export default function count_comments(commentIDs) {
    let count = commentIDs.length;

    for (let commentID of commentIDs) {
        count += count_comments(commentID.commentIDs);
    }

    return count;
}
