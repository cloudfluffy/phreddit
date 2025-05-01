import { useState } from 'react';
import { COMMUNITY, HOME, LOGIN, NEWCOMMENT, NEWCOMMUNITY, NEWPOST, NEWUSER, POST, SEARCHRESULTS, USERPROFILE, WELCOME } from '../display.js';
import '../stylesheets/Main.css';
import Communitypageview from './Communitypageview.js';
import Homepageview from './Homepageview.js';
import Loginpageview from './Loginpageview.js';
import Newcommentpageview from './Newcommentpageview.js';
import Newcommunitypageview from './Newcommunitypageview.js';
import Newpostpageview from './Newpostpageview.js';
import Newuserpageview from './Newuserpageview.js';
import Postpageview from './Postpageview.js';
import Searchresultspageview from './Searchresultspageview.js';
import Userprofilepageview from './Userprofilepageview.js';
import Welcomepageview from './Welcomepageview.js';

export default function Main(props) {
    const { display, displayPosts, displayCommunity, query } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity, setClientInfo } = props;

    const [displayPostID, setDisplayPostID] = useState(null);
    const [commentToID, setCommentToID] = useState(null);

    return (
        <div className='Main'>
            {display === HOME && <Homepageview
                display={display}
                displayPosts={displayPosts}
                setDisplay={setDisplay}
                setDisplayPostID={setDisplayPostID}
                setDisplayPosts={setDisplayPosts} />}

            {display === COMMUNITY && <Communitypageview
                display={display}
                displayPosts={displayPosts}
                displayCommunity={displayCommunity}
                setDisplay={setDisplay}
                setDisplayPostID={setDisplayPostID}
                setDisplayPosts={setDisplayPosts} />}

            {display === SEARCHRESULTS && <Searchresultspageview
                display={display}
                displayPosts={displayPosts}
                query={query}
                setDisplay={setDisplay}
                setDisplayPostID={setDisplayPostID}
                setDisplayPosts={setDisplayPosts} />}

            {display === POST && <Postpageview
                displayPostID={displayPostID}
                setDisplay={setDisplay}
                setCommentToID={setCommentToID} />}

            {display === NEWCOMMUNITY && <Newcommunitypageview
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts}
                setDisplayCommunity={setDisplayCommunity} />}

            {display === NEWCOMMENT && <Newcommentpageview
                commentToID={commentToID}
                setDisplay={setDisplay} />}

            {display === NEWPOST && <Newpostpageview
                setDisplay={setDisplay}
                setDisplayPosts={setDisplayPosts} />}

            {display === WELCOME && <Welcomepageview
                setDisplay={setDisplay}
            />}

            {display === LOGIN && <Loginpageview
                setDisplay={setDisplay}
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
