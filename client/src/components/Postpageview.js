import axios from 'axios';
import { useEffect, useState } from 'react';
import { NEWCOMMENT } from '../display.js';
import '../stylesheets/Postpageview.css';
import count_comments from '../util/count_comments.js';
import get_timestamp from '../util/get_timestamp.js';
import Comment from './Comment.js';
import Content from './Content.js';

export default function Postpageview(props) {
    const { displayPostID } = props;
    const { setDisplay, setCommentToID } = props;

    const [post, setPost] = useState(null);
    const [community, setCommunity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [post_response, community_response] = await Promise.all([
                axios.get(`http://127.0.0.1:8000/posts/${displayPostID}`),
                axios.get(`http://127.0.0.1:8000/posts/${displayPostID}/community`)
            ]);
            setPost(post_response.data);
            setCommunity(community_response.data);

            setIsLoading(false);
        })();
    }, []);

    function render_comments(commentIDs, depth, comments) {
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
            render_comments(commentID.commentIDs, depth + 1, comments);
        }

        return comments;
    }

    return (
        <>
            {!isLoading && <>
                <div className='Postpageview'>
                    <p className='info'>{community.name} • {get_timestamp(post.postedDate)}</p>
                    <p className='info'>{post.postedBy}</p>
                    <h3>{post.title}</h3>
                    {post.linkFlairID && <p className='linkflair'>{post.linkFlairID.content}</p>}
                    <Content className='content' content={post.content} />
                    <p className='info'>{post.views} view(s) {count_comments(post.commentIDs)} comment(s)</p>
                    <button className='btn' onClick={() => {
                        setCommentToID({
                            _id: post._id,
                            is_post: true
                        });

                        setDisplay(NEWCOMMENT);
                    }}>Add a Comment</button>
                </div>
                <hr />
                {render_comments(post.commentIDs, 0, [])}
            </>
            }
        </>
    )
}
