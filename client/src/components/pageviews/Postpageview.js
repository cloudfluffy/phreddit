import api from '../../api.js';
import { useEffect, useState } from 'react';
import { NEWCOMMENT } from '../../display.js';
import '../../stylesheets/pageviews/Postpageview.css';
import countComments from '../../util/countComments.js';
import errorFlash from '../../util/errorFlash.js';
import getTimestamp from '../../util/getTimestamp.js';
import Button from '../parts/Button.js';
import Comment from '../parts/Comment.js';
import Content from '../parts/Content.js';
import Linkflair from '../parts/Linkflair.js';
import Votebuttons from '../parts/Votebuttons.js';

export default function Postpageview(props) {
    const { displayPostID, clientInfo } = props;
    const { setDisplay, setClientInfo, setCommentToInfo, setFlash } = props;

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: { post } } = await api.get(`/posts/${displayPostID}`);

                setPost(post);
            } catch (error) {
                errorFlash(error, setFlash);
            }

            setIsLoading(false);
        })();
    }, [clientInfo, displayPostID, setFlash]);

    function renderComments(commentIDs, depth, comments) {
        if (!commentIDs) {
            return;
        }

        commentIDs.sort((a, b) => {
            a = new Date(a.commentedDate);
            b = new Date(b.commentedDate);
            if (a < b) {
                return 1;
            } else if (a === b) {
                return 0;
            } else {
                return -1;
            }
        });

        for (let commentID of commentIDs) {
            comments.push(<Comment
                key={commentID._id}
                comment={commentID}
                depth={depth}
                clientInfo={clientInfo}
                displayPostID={displayPostID}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setCommentToInfo={setCommentToInfo}
                setFlash={setFlash} />);
            renderComments(commentID.commentIDs, depth + 1, comments);
        }

        return comments;
    }

    return (
        <>
            {!isLoading && <>
                <div className='Postpageview'>
                    <p className='info'>{post?.communityID?.name} • {getTimestamp(post?.postedDate)}</p>
                    <p className='info'>{post?.postedBy?.displayName}</p>
                    <h2>{post?.title}</h2>
                    {post?.linkFlairID && <Linkflair content={post?.linkFlairID?.content} />}
                    <Content className='content' content={post?.content} />
                    <div className='infos'>
                        <Votebuttons
                            isPost={true}
                            votable={post}
                            clientInfo={clientInfo}
                            setClientInfo={setClientInfo}
                            setFlash={setFlash} />

                        <Button
                            disable={!clientInfo}
                            type='small'
                            content='Add a Comment'
                            onClick={() => {
                                setCommentToInfo({
                                    _id: post?._id,
                                    isPost: true,
                                    postID: displayPostID
                                });

                                setDisplay(NEWCOMMENT);
                            }} />

                        <p>{post?.views} view(s)</p>
                        <p>{countComments(post?.commentIDs)} comment(s)</p>
                    </div>
                </div>
                <hr />
                {renderComments(post?.commentIDs, 0, [])}
            </>
            }
        </>
    );
}
