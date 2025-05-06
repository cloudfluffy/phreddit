import axios from 'axios';
import { useEffect, useState } from 'react';
import { POST } from '../../display.js';
import '../../stylesheets/parts/Post.css';
import countComments from '../../util/countComments.js';
import errorFlash from '../../util/errorFlash.js';
import getTimestamp from '../../util/getTimestamp.js';
import Content from './Content.js';
import Linkflair from './Linkflair.js';
import Votebuttons from './Votebuttons.js';

axios.defaults.withCredentials = true;

export default function Post(props) {
    const { postID, showCommunity } = props;
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setDisplayPostID, setFlash } = props;

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: { post } } = await axios.get(`http://localhost:8000/posts/${postID}`);

                setPost(post);
            } catch (error) {
                errorFlash(error, setFlash);
            }

            setIsLoading(false);
        })();
    }, [clientInfo]);

    return (
        <>
            {!isLoading && <div
                className='Post'
                tabIndex='0'
                onClick={async () => {
                    try {
                        await axios.put(`http://localhost:8000/posts/${post?._id}/views`);

                        setDisplayPostID(post?._id);

                        setDisplay(POST);
                    } catch (error) {
                        errorFlash(error, setFlash);
                    }
                }}>
                <p className='info'>{showCommunity && `${post?.communityID.name} •`} {post?.postedBy.displayName} • {getTimestamp(post?.postedDate)}</p>
                <h3 className='title'>{post?.title}</h3>
                {post?.linkFlairID && <Linkflair content={post?.linkFlairID.content} />}
                <Content
                    className='content'
                    content={post?.content}
                    limit={80} />
                <div className='infos'>
                    <Votebuttons
                        isPost={true}
                        votable={post}
                        clientInfo={clientInfo}
                        setClientInfo={setClientInfo}
                        setFlash={setFlash} />
                    <p>{post?.views} view(s)</p>
                    <p>{countComments(post?.commentIDs)} comment(s)</p>
                </div>
            </div>}
        </>
    );
}
