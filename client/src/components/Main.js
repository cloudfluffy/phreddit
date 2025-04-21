import { useState } from 'react';
import { COMMUNITY, HOME, NEWCOMMENT, NEWCOMMUNITY, NEWPOST, POST, SEARCHRESULTS } from '../display.js';
import '../stylesheets/Main.css';
import Communitypageview from './Communitypageview.js';
import Homepageview from './Homepageview.js';
import Newcommentpageview from './Newcommentpageview.js';
import Newcommunitypageview from './Newcommunitypageview.js';
import Newpostpageview from './Newpostpageview.js';
import Postpageview from './Postpageview.js';
import Searchresultspageview from './Searchresultspageview.js';

export default function Main(props) {
    const { display, displayPosts, displayCommunity, query } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity } = props;

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
        </div>
    );
}
