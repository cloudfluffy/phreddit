import axios from 'axios';
import { useEffect, useState } from 'react';
import { COMMENTS, COMMUNITIES, POSTS } from '../../listing.js';
import errorFlash from '../../util/errorFlash.js';
import Header from '../parts/Header.js';
import Listitem from '../parts/Listitem.js';

export default function Userprofilepageview(props) {
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setFlash, setCommunityToEdit, setPostToEdit, setCommentToEdit } = props;

    const [communities, setCommunities] = useState([]);
    const [listing, setListing] = useState(POSTS);

    useEffect(() => {
        (async () => {
            try {
                const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                setClientInfo(clientInfo);

                if (listing === COMMUNITIES) {
                    let { data: { communities } } = await axios.get('http://localhost:8000/communities');

                    communities = communities.filter(community => community.owner._id === clientInfo._id);

                    setCommunities(communities);
                }
            } catch (error) {
                console.log(error);
                errorFlash(error, setFlash);
            }
        })();
    }, [listing])

    return (
        <>
            <Header
                title='User Profile'
                isUserProfile={true}
                clientInfo={clientInfo}
                listing={listing}
                setListing={setListing} />

            {listing === COMMUNITIES && (communities.length === 0 ? <p>You don't have any communities.</p> : communities.map(community => <Listitem
                key={community._id}
                communityID={community._id}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommunityToEdit={setCommunityToEdit} />))}

            {listing === POSTS && (clientInfo.postIDs.length === 0 ? <p>You don't have any posts.</p> : clientInfo.postIDs.map(postID => <Listitem
                key={postID}
                postID={postID}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setPostToEdit={setPostToEdit} />))}

            {listing === COMMENTS && (clientInfo.commentIDs.length === 0 ? <p>You don't have any comments.</p> : clientInfo.commentIDs.map(commentID => <Listitem
                key={commentID}
                commentID={commentID}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommentToEdit={setCommentToEdit} />))}
        </>
    );
}
