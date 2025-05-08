import { useEffect, useState } from 'react';
import { COMMUNITY, HOME, LOGIN, NEWCOMMENT, NEWCOMMUNITY, NEWPOST, NEWUSER, POST, SEARCHRESULTS, USERPROFILE, WELCOME } from '../../display.js';
import '../../stylesheets/layout/Main.css';
import Communitypageview from '../pageviews/Communitypageview.js';
import Homepageview from '../pageviews/Homepageview.js';
import Loginpageview from '../pageviews/Loginpageview.js';
import Newcommentpageview from '../pageviews/Newcommentpageview.js';
import Newcommunitypageview from '../pageviews/Newcommunitypageview.js';
import Newpostpageview from '../pageviews/Newpostpageview.js';
import Newuserpageview from '../pageviews/Newuserpageview.js';
import Postpageview from '../pageviews/Postpageview.js';
import Searchresultspageview from '../pageviews/Searchresultspageview.js';
import Userprofilepageview from '../pageviews/Userprofilepageview.js';
import Welcomepageview from '../pageviews/Welcomepageview.js';

export default function Main(props) {
    const { display, displayPosts, displayPostsFromJoinedCommunities, displayPostsFromOtherCommunities, displayCommunity, query, clientInfo } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setDisplayCommunity, setClientInfo, setFlash } = props;

    const [displayPostID, setDisplayPostID] = useState(null);
    const [commentToInfo, setCommentToInfo] = useState(null);

    const [communityToEdit, setCommunityToEdit] = useState(null);
    const [postToEdit, setPostToEdit] = useState(null);
    const [commentToEdit, setCommentToEdit] = useState(null);

    useEffect(() => {
        if (display !== NEWCOMMUNITY) {
            setCommunityToEdit(null);
        }

        if (display !== NEWPOST) {
            setPostToEdit(null);
        }

        if (display !== NEWCOMMENT) {
            setCommentToEdit(null);
        }
    }, [display])

    return (
        <div className='Main'>
            {display === HOME && <Homepageview
                display={display}
                displayPosts={displayPosts}
                displayPostsFromJoinedCommunities={displayPostsFromJoinedCommunities}
                displayPostsFromOtherCommunities={displayPostsFromOtherCommunities}
                clientInfo={clientInfo}
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                setClientInfo={setClientInfo}
                setDisplayPostID={setDisplayPostID}
                setFlash={setFlash} />}

            {display === COMMUNITY && <Communitypageview
                display={display}
                displayPosts={displayPosts}
                displayCommunity={displayCommunity}
                clientInfo={clientInfo}
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayCommunity={setDisplayCommunity}
                setClientInfo={setClientInfo}
                setDisplayPostID={setDisplayPostID}
                setFlash={setFlash} />}

            {display === SEARCHRESULTS && <Searchresultspageview
                display={display}
                displayPosts={displayPosts}
                displayPostsFromJoinedCommunities={displayPostsFromJoinedCommunities}
                displayPostsFromOtherCommunities={displayPostsFromOtherCommunities}
                clientInfo={clientInfo}
                query={query}
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                setClientInfo={setClientInfo}
                setDisplayPostID={setDisplayPostID}
                setFlash={setFlash} />}

            {display === POST && <Postpageview
                displayPostID={displayPostID}
                clientInfo={clientInfo}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setCommentToInfo={setCommentToInfo}
                setFlash={setFlash} />}

            {display === NEWCOMMUNITY && <Newcommunitypageview
                communityToEdit={communityToEdit}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setDisplayCommunity={setDisplayCommunity}
                setFlash={setFlash} />}

            {display === NEWCOMMENT && <Newcommentpageview
                commentToEdit={commentToEdit}
                commentToInfo={commentToInfo}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash} />}

            {display === NEWPOST && <Newpostpageview
                postToEdit={postToEdit}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash} />}

            {display === WELCOME && <Welcomepageview
                clientInfo={clientInfo}
                setDisplay={setDisplay} />}

            {display === LOGIN && <Loginpageview
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash} />}

            {display === NEWUSER && <Newuserpageview
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash} />}

            {display === USERPROFILE && <Userprofilepageview
                clientInfo={clientInfo}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setFlash={setFlash}
                setCommunityToEdit={setCommunityToEdit}
                setPostToEdit={setPostToEdit}
                setCommentToEdit={setCommentToEdit} />}
        </div>
    );
}
