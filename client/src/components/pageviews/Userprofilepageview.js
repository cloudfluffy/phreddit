import api from '../../api.js';
import { useEffect, useState } from 'react';
import { COMMENTS, COMMUNITIES, POSTS, USERS } from '../../listing.js';
import errorFlash from '../../util/errorFlash.js';
import Header from '../parts/Header.js';
import Listitem from '../parts/Listitem.js';

export default function Userprofilepageview(props) {
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setFlash, setCommunityToEdit, setPostToEdit, setCommentToEdit } = props;

    const [displayUser, setDisplayUser] = useState(clientInfo);
    const [users, setUsers] = useState([]);
    const [communities, setCommunities] = useState([]);
    const [listing, setListing] = useState(clientInfo.isAdmin ? USERS : POSTS);

    const [refresh, setRefresh] = useState({});

    useEffect(() => {
        (async () => {
            try {
                const { data: { user } } = await api.get(`/users/${displayUser._id}`);

                setDisplayUser(user);

                if (clientInfo._id === user._id) {
                    setClientInfo(user);
                }

                if (listing === COMMUNITIES) {
                    let { data: { communities } } = await api.get('/communities');

                    communities = communities.filter(community => community.owner._id === displayUser._id);

                    setCommunities(communities);
                }

                if (listing === USERS) {
                    let { data: { users } } = await api.get('/users');

                    setUsers(users);
                }
            } catch (error) {
                errorFlash(error, setFlash);
            }
        })();
    }, [listing, refresh])

    return (
        <>
            <Header
                title='User Profile'
                isUserProfile={true}
                clientInfo={clientInfo}
                displayUser={displayUser}
                listing={listing}
                setDisplayUser={setDisplayUser}
                setListing={setListing} />

            {listing === USERS && (users.length === 0 ? <p>There are no registered users.</p> : users.map(user => <Listitem
                key={user._id}
                userID={user._id}
                clientInfo={clientInfo}
                displayUser={displayUser}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setDisplayUser={setDisplayUser}
                setUsers={setUsers}
                setListing={setListing}
                setRefresh={setRefresh} />))}

            {listing === COMMUNITIES && (communities.length === 0 ? <p>{clientInfo._id === displayUser._id ? "You don't have any communities." : "This user doesn't have any communities."}</p> : communities.map(community => <Listitem
                key={community._id}
                communityID={community._id}
                clientInfo={clientInfo}
                displayUser={displayUser}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommunityToEdit={setCommunityToEdit}
                setDisplayUser={setDisplayUser}
                setRefresh={setRefresh} />))}

            {listing === POSTS && (displayUser.postIDs.length === 0 ? <p>{clientInfo._id === displayUser._id ? "You don't have any posts." : "This user doesn't have any posts."}</p> : displayUser.postIDs.map(postID => <Listitem
                key={postID}
                postID={postID}
                clientInfo={clientInfo}
                displayUser={displayUser}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setPostToEdit={setPostToEdit}
                setDisplayUser={setDisplayUser}
                setRefresh={setRefresh} />))}

            {listing === COMMENTS && (displayUser.commentIDs.length === 0 ? <p>{clientInfo._id === displayUser._id ? "You don't have any comments." : "This user doesn't have any comments."}</p> : displayUser.commentIDs.map(commentID => <Listitem
                key={commentID}
                commentID={commentID}
                clientInfo={clientInfo}
                displayUser={displayUser}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommentToEdit={setCommentToEdit}
                setDisplayUser={setDisplayUser}
                setRefresh={setRefresh} />))}
        </>
    );
}
