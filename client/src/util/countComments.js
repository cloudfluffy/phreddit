export default function countComments(commentIDs) {
    let count = commentIDs.length;

    for (let commentID of commentIDs) {
        count += countComments(commentID.commentIDs);
    }

    return count;
}
