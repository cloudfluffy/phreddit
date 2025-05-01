import axios from 'axios';
import { useEffect, useState } from 'react';
import { POST } from '../display.js';
import '../stylesheets/Post.css';
import countComments from '../util/countComments.js';
import getTimestamp from '../util/getTimestamp.js';
import Content from './Content.js';

axios.defaults.withCredentials = true;

export default function Post(props) {
    const { postID, showCommunity } = props;
    const { setDisplay, setDisplayPostID } = props;

    const [post, setPost] = useState(null);
    const [community, setCommunity] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (showCommunity) {
                const [postResponse, communityResponse] = await Promise.all([
                    axios.get(`http://localhost:8000/posts/${postID}`),
                    axios.get(`http://localhost:8000/posts/${postID}/community`)
                ]);
                setPost(postResponse.data);
                setCommunity(communityResponse.data);
            } else {
                const response = await axios.get(`http://localhost:8000/posts/${postID}`);
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
                    await axios.put(`http://localhost:8000/posts/${post._id}/views`);

                    setDisplayPostID(post._id);

                    setDisplay(POST);
                }}>
                <p className='info'>{showCommunity && `${community.name} •`} {post.postedBy} • {getTimestamp(post.postedDate)}</p>
                <h3 className='title'>{post.title}</h3>
                {post.linkFlairID && <p className='linkflair'>{post.linkFlairID.content}</p>}
                <Content className='content' content={post.content} limit={80} />
                <p className='info'>{post.views} view(s) {countComments(post.commentIDs)} comment(s)</p>
            </div>}
        </>
    );
}
