import axios from 'axios';
import { useEffect, useState } from 'react';
import { NEWCOMMENT, NEWCOMMUNITY, NEWPOST } from '../../display.js';
import '../../stylesheets/parts/Listitem.css';
import errorFlash from '../../util/errorFlash.js';
import Comfirmbutton from './Comfirmbutton.js';
import Content from './Content.js';

export default function Listitem(props) {
    const { communityID, postID, commentID } = props;
    const { setDisplay, setClientInfo, setFlash, setCommunityToEdit, setPostToEdit, setCommentToEdit } = props;

    const [community, setCommunity] = useState(null);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                if (communityID) {
                    const { data: { community } } = await axios.get(`http://localhost:8000/communities/${communityID}`);

                    setCommunity(community);
                }

                if (postID) {
                    const { data: { post } } = await axios.get(`http://localhost:8000/posts/${postID}`);

                    setPost(post);
                }

                if (commentID) {
                    const { data: { comment } } = await axios.get(`http://localhost:8000/comments/${commentID}`);

                    setComment(comment);
                }
            } catch (error) {
                errorFlash(error, setFlash);
            }
        }
        )();
    }, []);

    return (
        <div
            className='Listitem'
            tabIndex='0'
            onClick={() => {
                if (communityID) {
                    setCommunityToEdit(community);
                    setDisplay(NEWCOMMUNITY);
                }

                if (postID) {
                    setPostToEdit(post)
                    setDisplay(NEWPOST);
                }

                if (commentID) {
                    setCommentToEdit(comment);
                    setDisplay(NEWCOMMENT);
                }
            }}>
            {community && <>
                <h3>{community.name}</h3>
            </>}

            {post && <>
                <h3>{post.title}</h3>
            </>}

            {comment && <>
                <div>
                    <h3>{comment.postID.title}</h3>
                    <Content
                        className='info'
                        content={comment.content}
                        limit={20} />
                </div>
            </>}

            <Comfirmbutton
                content='Delete'
                onClick={async () => {
                    try {
                        if (communityID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/communities/${communityID}`);

                            const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                            setClientInfo(clientInfo);

                            setFlash({ isSuccess: true, message });
                        }

                        if (postID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/posts/${postID}`);

                            const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                            setClientInfo(clientInfo);

                            setFlash({ isSuccess: true, message });
                        }

                        if (commentID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/comments/${commentID}`);

                            const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                            setClientInfo(clientInfo);

                            setFlash({ isSuccess: true, message });
                        }
                    } catch (error) {
                        errorFlash(error, setFlash);
                    }
                }} />
        </div>
    )
}
