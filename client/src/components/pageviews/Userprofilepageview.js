import axios from 'axios';
import { useEffect, useState } from 'react';
import { COMMENTS, COMMUNITIES, POSTS } from '../../listing.js';
import errorFlash from '../../util/errorFlash.js';
import Header from '../parts/Header.js';
import Listitem from '../parts/Listitem.js';

export default function Userprofilepageview(props) {
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setFlash, setCommunityToEdit, setPostToEdit, setCommentToEdit } = props;

    const [listing, setListing] = useState(POSTS);

    useEffect(() => {
        (async () => {
            try {
                const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                setClientInfo(clientInfo);
            } catch (error) {
                errorFlash(error, setFlash);
            }
        })();
    }, [clientInfo, listing])

    return (
        <>
            <Header
                title='User Profile'
                isUserProfile={true}
                clientInfo={clientInfo}
                listing={listing}
                setListing={setListing} />

            {listing === COMMUNITIES && clientInfo.communityIDs.map(communityID => <Listitem
                key={communityID}
                communityID={communityID}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommunityToEdit={setCommunityToEdit} />)}

            {listing === POSTS && clientInfo.postIDs.map(postID => <Listitem
                key={postID}
                postID={postID}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setPostToEdit={setPostToEdit} />)}

            {listing === COMMENTS && clientInfo.commentIDs.map(commentID => <Listitem
                key={commentID}
                commentID={commentID}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommentToEdit={setCommentToEdit} />)}
        </>
    );
}
