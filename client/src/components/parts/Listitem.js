import axios from 'axios';
import { useEffect, useState } from 'react';
import { NEWCOMMENT, NEWCOMMUNITY, NEWPOST, WELCOME } from '../../display.js';
import { POSTS } from '../../listing.js';
import '../../stylesheets/parts/Listitem.css';
import errorFlash from '../../util/errorFlash.js';
import Confirmbutton from './Confirmbutton.js';
import Content from './Content.js';

export default function Listitem(props) {
    const { userID, communityID, postID, commentID } = props;
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setFlash, setCommunityToEdit, setPostToEdit, setCommentToEdit, setDisplayUser, setListing, setRefresh } = props;

    const [user, setUser] = useState(null);
    const [community, setCommunity] = useState(null);
    const [post, setPost] = useState(null);
    const [comment, setComment] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                if (userID) {
                    const { data: { user } } = await axios.get(`http://localhost:8000/users/${userID}`);

                    setUser(user);
                }

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
                if (userID) {
                    if (userID !== clientInfo._id) {
                        setDisplayUser(user);
                        setListing(POSTS);
                    } else {
                        setFlash({ isSuccess: true, message: "You're already on your admin profile page view." })
                    }
                }

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
            {user && <div>
                <p>Display Name: {user.displayName}</p>
                <p>Email: {user.email}</p>
                <p>Reputation: {user.reputation}</p>
            </div>}

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

            <Confirmbutton
                content='Delete'
                onClick={async () => {
                    try {
                        if (userID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/users/${userID}`);

                            if (userID === clientInfo._id) {
                                setClientInfo(null);
                                setDisplay(WELCOME);
                            } else {
                                setRefresh({});
                            }

                            setFlash({ isSuccess: true, message });
                        }

                        if (communityID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/communities/${communityID}`);

                            setRefresh({});

                            setFlash({ isSuccess: true, message });
                        }

                        if (postID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/posts/${postID}`);

                            setRefresh({});

                            setFlash({ isSuccess: true, message });
                        }

                        if (commentID) {
                            const { data: { message } } = await axios.delete(`http://localhost:8000/comments/${commentID}`);

                            setRefresh({});

                            setFlash({ isSuccess: true, message });
                        }
                    } catch (error) {
                        errorFlash(error, setFlash);
                    }
                }} />
        </div>
    )
}
