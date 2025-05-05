import { useState } from 'react';
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
    const { setDisplay, setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setDisplayCommunity, setClientInfo } = props;

    const [displayPostID, setDisplayPostID] = useState(null);
    const [commentToID, setCommentToID] = useState(null);

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
                setDisplayPostID={setDisplayPostID} />}

            {display === COMMUNITY && <Communitypageview
                display={display}
                displayPosts={displayPosts}
                displayCommunity={displayCommunity}
                clientInfo={clientInfo}
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayCommunity={setDisplayCommunity}
                setClientInfo={setClientInfo}
                setDisplayPostID={setDisplayPostID} />}

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
                setDisplayPostID={setDisplayPostID} />}

            {display === POST && <Postpageview
                displayPostID={displayPostID}
                clientInfo={clientInfo}
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
                setCommentToID={setCommentToID} />}

            {display === NEWCOMMUNITY && <Newcommunitypageview
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setClientInfo={setClientInfo}
                setDisplayCommunity={setDisplayCommunity} />}

            {display === NEWCOMMENT && <Newcommentpageview
                commentToID={commentToID}
                setDisplay={setDisplay} />}

            {display === NEWPOST && <Newpostpageview
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                setClientInfo={setClientInfo} />}

            {display === WELCOME && <Welcomepageview
                clientInfo={clientInfo}
                setDisplay={setDisplay}
            />}

            {display === LOGIN && <Loginpageview
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                setClientInfo={setClientInfo}
            />}

            {display === NEWUSER && <Newuserpageview
                setDisplay={setDisplay}
                setClientInfo={setClientInfo}
            />}

            {display === USERPROFILE && <Userprofilepageview
                setDisplay={setDisplay}
            />}
        </div>
    );
}
