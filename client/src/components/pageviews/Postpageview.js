import axios from 'axios';
import { useEffect, useState } from 'react';
import { NEWCOMMENT } from '../../display.js';
import '../../stylesheets/pageviews/Postpageview.css';
import countComments from '../../util/countComments.js';
import getTimestamp from '../../util/getTimestamp.js';
import Button from '../parts/Button.js';
import Comment from '../parts/Comment.js';
import Content from '../parts/Content.js';
import Linkflair from '../parts/Linkflair.js';
import Votebuttons from '../parts/Votebuttons.js';

axios.defaults.withCredentials = true;

export default function Postpageview(props) {
    const { displayPostID, clientInfo } = props;
    const { setDisplay, setClientInfo, setCommentToID } = props;

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { data: { post } } = await axios.get(`http://localhost:8000/posts/${displayPostID}`);

            setPost(post);

            setIsLoading(false);
        })();
    }, [clientInfo]);

    function renderComments(commentIDs, depth, comments) {
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
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setCommentToID={setCommentToID} />);
            renderComments(commentID.commentIDs, depth + 1, comments);
        }

        return comments;
    }

    return (
        <>
            {!isLoading && <>
                <div className='Postpageview'>
                    <p className='info'>{post.communityID.name} • {getTimestamp(post.postedDate)}</p>
                    <p className='info'>{post.postedBy.displayName}</p>
                    <h2>{post.title}</h2>
                    {post.linkFlairID && <Linkflair content={post.linkFlairID.content} />}
                    <Content className='content' content={post.content} />
                    <div className='infos'>
                        <Votebuttons
                            isPost={true}
                            votable={post}
                            clientInfo={clientInfo}
                            setClientInfo={setClientInfo} />

                        <Button
                            disable={!clientInfo}
                            type='small'
                            content='Add a Comment'
                            onClick={() => {
                                setCommentToID({
                                    _id: post._id,
                                    isPost: true
                                });

                                setDisplay(NEWCOMMENT);
                            }} />

                        <p>{post.views} view(s)</p>
                        <p>{countComments(post.commentIDs)} comment(s)</p>
                    </div>
                </div>
                <hr />
                {renderComments(post.commentIDs, 0, [])}
            </>
            }
        </>
    );
}
