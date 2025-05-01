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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const response = await axios.get('http://localhost:8000/posts/newest');
            setDisplayPosts(response.data);

            setIsLoading(false);
        })();
    }, []);

    return (
        <div className='Phreddit'>
            {!isLoading && <>
                <Banner
                    display={display}
                    setDisplay={setDisplay}
                    setDisplayPosts={setDisplayPosts}
                    setQuery={setQuery} />
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
                        setDisplayCommunity={setDisplayCommunity} />
                </div>
            </>}
        </div>
    );
}
