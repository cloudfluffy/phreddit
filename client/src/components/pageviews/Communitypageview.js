import api from '../../api.js';
import { useEffect, useState } from 'react';
import errorFlash from '../../util/errorFlash.js';
import Header from '../parts/Header.js';
import Post from '../parts/Post.js';

export default function Communitypageview(props) {
    const { display, displayPosts, clientInfo, displayCommunity } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity, setClientInfo, setDisplayPostID, setFlash } = props;

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data: { posts } } = await api.get(`/communities/${displayCommunity?._id}/posts/newest`);

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
