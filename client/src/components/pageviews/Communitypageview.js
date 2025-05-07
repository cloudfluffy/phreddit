import axios from 'axios';
import { useEffect, useState } from 'react';
import errorFlash from '../../util/errorFlash.js';
import Header from '../parts/Header.js';
import Post from '../parts/Post.js';

axios.defaults.withCredentials = true;

export default function Communitypageview(props) {
    const { display, displayPosts, clientInfo, displayCommunity } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity, setClientInfo, setDisplayPostID, setFlash } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${displayCommunity?._id}/posts/newest`);
                console.log(posts);
                setDisplayPosts(posts);
            } catch (error) {
                errorFlash(error, setFlash);
            }

            setIsLoading(false);
        })();
    }, [display, clientInfo, displayCommunity]);

    return (
        <>
            {!isLoading && <>
                <Header
                    title={displayCommunity?.name}
                    display={display}
                    displayPosts={displayPosts}
                    clientInfo={clientInfo}
                    displayCommunity={displayCommunity}
                    setClientInfo={setClientInfo}
                    setDisplayPosts={setDisplayPosts}
                    setDisplayCommunity={setDisplayCommunity}
                    setFlash={setFlash} />
                {
                    displayPosts?.map(post => (
                        <Post
                            key={post._id}
                            post={post}
                            showCommunity={false}
                            clientInfo={clientInfo}
                            setDisplay={setDisplay}
                            setClientInfo={setClientInfo}
                            setDisplayPostID={setDisplayPostID}
                            setFlash={setFlash} />
                    ))
                }
            </>}
        </>
    );
}
