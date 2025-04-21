import axios from 'axios';
import { useEffect, useState } from 'react';
import { POST } from '../display.js';
import '../stylesheets/Post.css';
import count_comments from '../util/count_comments.js';
import get_timestamp from '../util/get_timestamp.js';
import Content from './Content.js';

export default function Post(props) {
    const { postID, show_community } = props;
    const { setDisplay, setDisplayPostID } = props;

    const [post, setPost] = useState(null);
    const [community, setCommunity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (show_community) {
                const [post_response, community_response] = await Promise.all([
                    axios.get(`http://127.0.0.1:8000/posts/${postID}`),
                    axios.get(`http://127.0.0.1:8000/posts/${postID}/community`)
                ]);
                setPost(post_response.data);
                setCommunity(community_response.data);
            } else {
                const response = await axios.get(`http://127.0.0.1:8000/posts/${postID}`);
                setPost(response.data);
            }

            setIsLoading(false);
        })();
    }, []);

    return (
        <>
            {!isLoading && <div
                className='Post'
                tabIndex='0'
                onClick={async () => {
                    await axios.put(`http://127.0.0.1:8000/posts/${post._id}/views`);

                    setDisplayPostID(post._id);

                    setDisplay(POST);
                }}>
                <p className='info'>{show_community && `${community.name} •`} {post.postedBy} • {get_timestamp(post.postedDate)}</p>
                <h3 className='title'>{post.title}</h3>
                {post.linkFlairID && <p className='linkflair'>{post.linkFlairID.content}</p>}
                <Content className='content' content={post.content} limit={80} />
                <p className='info'>{post.views} view(s) {count_comments(post.commentIDs)} comment(s)</p>
            </div>}
        </>
    );
}
