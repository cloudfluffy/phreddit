import axios from 'axios';
import { useEffect, useState } from 'react';
import { COMMUNITY, HOME, NEWCOMMUNITY } from '../display.js';
import '../stylesheets/Navbar.css';

axios.defaults.withCredentials = true;

export default function Navbar(props) {
    const { display, displayCommunity, clientInfo } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity } = props;

    const [communities, setCommunities] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [otherCommunities, setOtherCommunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const response = await axios.get('http://localhost:8000/communities');

            setCommunities(response.data.communities);
            setJoinedCommunities(response.data.joinedCommunities);
            setOtherCommunities(response.data.otherCommunities);

            setIsLoading(false);
        })();
    }, [display]);

    return (
        <div className='Navbar'>
            <button
                className='navbar_btn'
                style={{ background: display === HOME ? '#ff4500' : '' }}
                onClick={async () => {
                    const response = await axios.get('http://localhost:8000/posts/newest')
                    setDisplayPosts(response.data);

                    setDisplay(HOME);
                }}>Home</button>

            <hr />

            <div id='communities_container'>
                <p className='navbar_header'>COMMUNITIES</p>
                <button
                    className={clientInfo.isLoggedIn ? 'navbar_btn' : 'disabled_navbar_btn'}
                    style={{ background: display === NEWCOMMUNITY ? '#ff4500' : '' }}
                    onClick={() => {
                        if (clientInfo.isLoggedIn) {
                            setDisplay(NEWCOMMUNITY);
                        }
                    }}>Create Community</button>

                {!isLoading && !clientInfo.isLoggedIn && communities.map(community => (
                    <button
                        key={community._id}
                        className='navbar_btn'
                        style={{ background: (display === COMMUNITY && displayCommunity._id === community._id) ? '#ff4500' : '' }}
                        onClick={async () => {
                            const response = await axios.get(`http://localhost:8000/communities/${community._id}/posts/newest`)
                            setDisplayPosts(response.data);

                            setDisplayCommunity(community);

                            setDisplay(COMMUNITY);
                        }}>{community.name}</button>
                ))}

                {!isLoading && clientInfo.isLoggedIn && <>
                    <p className='navbar_header'>JOINED COMMUNITIES</p>
                    {joinedCommunities.map(community => (
                        <button
                            key={community._id}
                            className='navbar_btn'
                            style={{ background: (display === COMMUNITY && displayCommunity._id === community._id) ? '#ff4500' : '' }}
                            onClick={async () => {
                                const response = await axios.get(`http://localhost:8000/communities/${community._id}/posts/newest`)
                                setDisplayPosts(response.data);

                                setDisplayCommunity(community);

                                setDisplay(COMMUNITY);
                            }}>{community.name}</button>
                    ))}
                </>}

                {!isLoading && clientInfo.isLoggedIn && <>
                    <p className='navbar_header'>OTHER COMMUNITIES</p>
                    {otherCommunities.map(community => (
                        <button
                            key={community._id}
                            className='navbar_btn'
                            style={{ background: (display === COMMUNITY && displayCommunity._id === community._id) ? '#ff4500' : '' }}
                            onClick={async () => {
                                const response = await axios.get(`http://localhost:8000/communities/${community._id}/posts/newest`)
                                setDisplayPosts(response.data);

                                setDisplayCommunity(community);

                                setDisplay(COMMUNITY);
                            }}>{community.name}</button>
                    ))}
                </>}
            </div>
        </div>
    );
}
