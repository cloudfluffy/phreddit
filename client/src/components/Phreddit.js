import axios from 'axios';
import { useEffect, useState } from 'react';
import { WELCOME } from '../display.js';
import '../stylesheets/Phreddit.css';
import Banner from './Banner.js';
import Main from './Main.js';
import Navbar from './Navbar.js';

axios.defaults.withCredentials = true;

export default function Phreddit() {
    const [display, setDisplay] = useState(WELCOME);
    const [displayPosts, setDisplayPosts] = useState(null);
    const [displayCommunity, setDisplayCommunity] = useState(null);
    const [query, setQuery] = useState(null);
    const [clientInfo, setClientInfo] = useState({ isLoggedIn: false, displayName: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const [displayPostsResponse, isLoggedInResponse] = await Promise.all([
                axios.get('http://localhost:8000/posts/newest'),
                axios.get('http://localhost:8000/users/loggedIn')
            ]);

            setDisplayPosts(displayPostsResponse.data);

            let displayName = '';

            if (isLoggedInResponse.data) {
                const response = await axios.get('http://localhost:8000/users/info');
                displayName = response.data.displayName;
            }

            setClientInfo({ isLoggedIn: isLoggedInResponse.data, displayName: displayName });

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
                    setQuery={setQuery}
                    setClientInfo={setClientInfo} />
                <div className='container'>
                    <Navbar
                        display={display}
                        displayCommunity={displayCommunity}
                        setDisplay={setDisplay}
                        setDisplayPosts={setDisplayPosts}
                        setDisplayCommunity={setDisplayCommunity} />
                    <Main
                        display={display}
                        displayPosts={displayPosts}
                        displayCommunity={displayCommunity}
                        query={query}
                        setDisplay={setDisplay}
                        setDisplayPosts={setDisplayPosts}
                        setDisplayCommunity={setDisplayCommunity}
                        setClientInfo={setClientInfo} />
                </div>
            </>}
        </div>
    );
}
