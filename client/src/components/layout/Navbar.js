import axios from 'axios';
import { useEffect, useState } from 'react';
import { COMMUNITY, HOME, NEWCOMMUNITY } from '../../display.js';
import '../../stylesheets/layout/Navbar.css';
import Button from '../parts/Button.js';

axios.defaults.withCredentials = true;

export default function Navbar(props) {
    const { display, displayCommunity, clientInfo } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setDisplayCommunity } = props;

    const [communities, setCommunities] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [otherCommunities, setOtherCommunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { data: { communities, joinedCommunities, otherCommunities } } = await axios.get('http://localhost:8000/communities');

            setCommunities(communities);
            setJoinedCommunities(joinedCommunities);
            setOtherCommunities(otherCommunities);

            setIsLoading(false);
        })();
    }, [display, displayCommunity, clientInfo]);

    return (
        <div className='Navbar'>
            <Button
                active={display === HOME}
                type='navbar'
                content='Home'
                onClick={async () => {
                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get('http://localhost:8000/posts/newest');

                    setDisplayPosts(posts);
                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);

                    setDisplay(HOME);
                }}
            />

            <hr />

            <p className='header'>COMMUNITIES</p>
            <Button
                disable={!clientInfo}
                active={display === NEWCOMMUNITY}
                type='navbar'
                content='Create Community'
                onClick={() => setDisplay(NEWCOMMUNITY)} />

            {!isLoading && !clientInfo && communities.map(community => (
                <Button
                    key={community._id}
                    active={display === COMMUNITY && displayCommunity._id === community._id}
                    type='navbar'
                    content={community.name}
                    onClick={async () => {
                        const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${community._id}/posts/newest`);

                        setDisplayPosts(posts);

                        setDisplayCommunity(community);

                        setDisplay(COMMUNITY);
                    }} />
            ))}

            {!isLoading && clientInfo && <>
                <p className='header'>JOINED COMMUNITIES</p>
                {joinedCommunities.map(community => (
                    <Button
                        key={community._id}
                        active={display === COMMUNITY && displayCommunity._id === community._id}
                        type='navbar'
                        content={community.name}
                        onClick={async () => {
                            const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${community._id}/posts/newest`);

                            setDisplayPosts(posts);

                            setDisplayCommunity(community);

                            setDisplay(COMMUNITY);
                        }} />
                ))}
            </>}

            {!isLoading && clientInfo && <>
                <p className='header'>OTHER COMMUNITIES</p>
                {otherCommunities.map(community => (
                    <Button
                        key={community._id}
                        active={display === COMMUNITY && displayCommunity._id === community._id}
                        type='navbar'
                        content={community.name}
                        onClick={async () => {
                            const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${community._id}/posts/newest`);

                            setDisplayPosts(posts);

                            setDisplayCommunity(community);

                            setDisplay(COMMUNITY);
                        }} />
                ))}
            </>}
        </div>
    );
}
