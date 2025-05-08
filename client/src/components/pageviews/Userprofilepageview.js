import { useState } from 'react';
import { COMMENTS, COMMUNITIES, POSTS } from '../../listing.js';
import Header from '../parts/Header.js';
import Listitem from '../parts/Listitem.js';

export default function Userprofilepageview(props) {
    const { clientInfo } = props;
    const { setFlash } = props;

    const [listing, setListing] = useState(POSTS);

    return (
        <>
            <Header
                title='User Profile'
                isUserProfile={true}
                clientInfo={clientInfo}
                setListing={setListing} />

            {listing === COMMUNITIES && clientInfo.communityIDs.map(communityID => <Listitem
                communityID={communityID}
                setFlash={setFlash} />)}

            {listing === POSTS && clientInfo.postIDs.map(postID => <Listitem
                postID={postID}
                setFlash={setFlash} />)}

            {listing === COMMENTS && clientInfo.commentIDs.map(commentID => <Listitem
                commentID={commentID}
                setFlash={setFlash} />)}
        </>
    );
}
