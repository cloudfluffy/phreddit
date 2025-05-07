import axios from 'axios';
import { useEffect, useState } from 'react';
import errorFlash from '../../util/errorFlash.js';
import Header from '../parts/Header.js';
import Post from '../parts/Post.js';

axios.defaults.withCredentials = true;

export default function Homepageview(props) {
    const { display, displayPosts, displayPostsFromJoinedCommunities, displayPostsFromOtherCommunities, clientInfo } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setClientInfo, setDisplayPostID, setFlash } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get('http://localhost:8000/posts/newest');

                setDisplayPosts(posts);
                setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
            } catch (error) {
                errorFlash(error, setFlash);
            }

            setIsLoading(false);
        })();
    }, [display, clientInfo]);

    return (
        <>
            {!isLoading && <>
                <Header
                    title='All Posts'
                    display={display}
                    displayPosts={displayPosts}
                    setDisplayPosts={setDisplayPosts}
                    setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                    setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                    setFlash={setFlash} />

                {!clientInfo && displayPosts?.map(post => (
                    <Post
                        key={post._id}
                        post={post}
                        showCommunity={true}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setClientInfo={setClientInfo}
                        setDisplayPostID={setDisplayPostID}
                        setFlash={setFlash} />
                ))}

                {clientInfo && <>
                    <h3>Posts from Joined Communities</h3>
                    {displayPostsFromJoinedCommunities?.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            showCommunity={true}
                            clientInfo={clientInfo}
                            setDisplay={setDisplay}
                            setClientInfo={setClientInfo}
                            setDisplayPostID={setDisplayPostID}
                            setFlash={setFlash} />
                    ))}</>}

                {clientInfo && <>
                    <h3>Posts from Other Communities</h3>
                    {displayPostsFromOtherCommunities?.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            showCommunity={true}
                            clientInfo={clientInfo}
                            setDisplay={setDisplay}
                            setClientInfo={setClientInfo}
                            setDisplayPostID={setDisplayPostID}
                            setFlash={setFlash} />
                    ))}</>}
            </>}
        </>
    );
}
