import axios from 'axios';
import { useEffect, useState } from 'react';
import { WELCOME } from '../../display.js';
import '../../stylesheets/layout/Phreddit.css';
import Banner from './Banner.js';
import Main from './Main.js';
import Navbar from './Navbar.js';

axios.defaults.withCredentials = true;

export default function Phreddit() {
    const [display, setDisplay] = useState(WELCOME);
    const [displayPosts, setDisplayPosts] = useState(null);
    const [displayPostsFromJoinedCommunities, setDisplayPostsFromJoinedCommunities] = useState(null);
    const [displayPostsFromOtherCommunities, setDisplayPostsFromOtherCommunities] = useState(null);
    const [displayCommunity, setDisplayCommunity] = useState(null);
    const [query, setQuery] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/loggedIn');

            setClientInfo(clientInfo);

            setIsLoading(false);
        })();
    }, []);

    return (
        <div className='Phreddit'>
            {!isLoading && <>
                <Banner
                    display={display}
                    clientInfo={clientInfo}
                    setDisplay={setDisplay}
                    setDisplayPosts={setDisplayPosts}
                    setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                    setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                    setQuery={setQuery}
                    setClientInfo={setClientInfo} />
                <div className='container'>
                    <Navbar
                        display={display}
                        displayCommunity={displayCommunity}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setDisplayPosts={setDisplayPosts}
                        setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                        setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                        setDisplayCommunity={setDisplayCommunity} />
                    <Main
                        display={display}
                        displayPosts={displayPosts}
                        displayPostsFromJoinedCommunities={displayPostsFromJoinedCommunities}
                        displayPostsFromOtherCommunities={displayPostsFromOtherCommunities}
                        displayCommunity={displayCommunity}
                        query={query}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setDisplayPosts={setDisplayPosts}
                        setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                        setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                        setDisplayCommunity={setDisplayCommunity}
                        setClientInfo={setClientInfo} />
                </div>
            </>}
        </div>
    );
}
