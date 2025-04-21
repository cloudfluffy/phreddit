import axios from 'axios';
import { useEffect, useState } from 'react';
import { COMMUNITY, HOME, NEWCOMMUNITY } from '../display.js';
import '../stylesheets/Navbar.css';

export default function Navbar(props) {
    const { display, displayCommunity } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity } = props;

    const [communities, setCommunities] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const response = await axios.get('http://127.0.0.1:8000/communities');
            setCommunities(response.data);

            setIsLoading(false);
        })();
    }, [display]);

    return (
        <div className='Navbar'>
            <button
                className='navbar_btn'
                style={{ background: display === HOME ? '#ff4500' : '' }}
                onClick={async () => {
                    const response = await axios.get('http://127.0.0.1:8000/posts/newest')
                    setDisplayPosts(response.data);

                    setDisplay(HOME);
                }}>Home</button>
            <hr />
            <div id='communities_container'>
                <p className='navbar_header'>COMMUNITIES</p>
                <button
                    className='navbar_btn community'
                    style={{ background: display === NEWCOMMUNITY ? '#ff4500' : '' }}
                    onClick={() => {
                        setDisplay(NEWCOMMUNITY);
                    }}>Create Community</button>
                {!isLoading && communities.map(community => (
                    <button
                        key={community._id}
                        className='navbar_btn community'
                        style={{ background: (display === COMMUNITY && displayCommunity._id === community._id) ? '#ff4500' : '' }}
                        onClick={async () => {
                            const response = await axios.get(`http://127.0.0.1:8000/communities/${community._id}/posts/newest`)
                            setDisplayPosts(response.data);

                            setDisplayCommunity(community);

                            setDisplay(COMMUNITY);
                        }}>{community.name}</button>
                ))}
            </div>
        </div>
    );
}
