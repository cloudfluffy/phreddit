import axios from 'axios';
import { useEffect, useState } from 'react';
import { NEWCOMMENT } from '../display.js';
import '../stylesheets/Postpageview.css';
import countComments from '../util/countComments.js';
import getTimestamp from '../util/getTimestamp.js';
import Comment from './Comment.js';
import Content from './Content.js';

axios.defaults.withCredentials = true;

export default function Postpageview(props) {
    const { displayPostID } = props;
    const { setDisplay, setCommentToID } = props;

    const [post, setPost] = useState(null);
    const [community, setCommunity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [postResponse, communityResponse] = await Promise.all([
                axios.get(`http://localhost:8000/posts/${displayPostID}`),
                axios.get(`http://localhost:8000/posts/${displayPostID}/community`)
            ]);
            setPost(postResponse.data);
            setCommunity(communityResponse.data);

            setIsLoading(false);
        })();
    }, []);

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
                setDisplay={setDisplay}
                setCommentToID={setCommentToID} />);
            renderComments(commentID.commentIDs, depth + 1, comments);
        }

        return comments;
    }

    return (
        <>
            {!isLoading && <>
                <div className='Postpageview'>
                    <p className='info'>{community.name} • {getTimestamp(post.postedDate)}</p>
                    <p className='info'>{post.postedBy}</p>
                    <h2>{post.title}</h2>
                    {post.linkFlairID && <p className='linkflair'>{post.linkFlairID.content}</p>}
                    <Content className='content' content={post.content} />
                    <p className='info'>{post.views} view(s) {countComments(post.commentIDs)} comment(s)</p>
                    <button className='btn' onClick={() => {
                        setCommentToID({
                            _id: post._id,
                            isPost: true
                        });

                        setDisplay(NEWCOMMENT);
                    }}>Add a Comment</button>
                </div>
                <hr />
                {renderComments(post.commentIDs, 0, [])}
            </>
            }
        </>
    );
}
