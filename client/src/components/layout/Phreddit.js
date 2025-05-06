import axios from 'axios';
import { useEffect, useState } from 'react';
import { WELCOME } from '../../display.js';
import '../../stylesheets/layout/Phreddit.css';
import errorFlash from '../../util/errorFlash.js';
import Banner from './Banner.js';
import Flash from './Flash.js';
import Main from './Main.js';
import Navbar from './Navbar.js';

axios.defaults.withCredentials = true;

export default function Phreddit() {
    const [display, setDisplay] = useState(WELCOME);
    const [displayPosts, setDisplayPosts] = useState([]);
    const [displayPostsFromJoinedCommunities, setDisplayPostsFromJoinedCommunities] = useState([]);
    const [displayPostsFromOtherCommunities, setDisplayPostsFromOtherCommunities] = useState([]);
    const [displayCommunity, setDisplayCommunity] = useState(null);
    const [query, setQuery] = useState('');
    const [clientInfo, setClientInfo] = useState(null);
    const [flash, setFlash] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: { message, clientInfo } } = await axios.get('http://localhost:8000/users/loggedIn');

                setClientInfo(clientInfo);

                if (clientInfo) {
                    setFlash({ isSuccess: true, message });
                }
            } catch (error) {
                errorFlash(error, setFlash);
            }

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
                    setQuery={setQuery}
                    setClientInfo={setClientInfo}
                    setFlash={setFlash} />
                {flash && <Flash
                    isSuccess={flash.isSuccess}
                    message={flash.message}
                    setFlash={setFlash}
                />}
                <div className='container'>
                    <Navbar
                        display={display}
                        displayCommunity={displayCommunity}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setDisplayCommunity={setDisplayCommunity}
                        setFlash={setFlash} />
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
                        setClientInfo={setClientInfo}
                        setFlash={setFlash} />
                </div>
            </>}
        </div>
    );
}
