import Header from '../parts/Header.js';
import Post from '../parts/Post.js';

export default function Communitypageview(props) {
    const { display, displayPosts, clientInfo, displayCommunity } = props;
    const { setDisplay, setDisplayPosts, setDisplayCommunity, setClientInfo, setDisplayPostID } = props;

    return (
        <>
            <Header
                title={displayCommunity.name}
                display={display}
                displayPosts={displayPosts}
                clientInfo={clientInfo}
                displayCommunity={displayCommunity}
                setClientInfo={setClientInfo}
                setDisplayPosts={setDisplayPosts}
                setDisplayCommunity={setDisplayCommunity} />
            {
                displayPosts.map(post => (
                    <Post
                        key={post._id}
                        postID={post._id}
                        showCommunity={false}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setClientInfo={setClientInfo}
                        setDisplayPostID={setDisplayPostID} />
                ))
            }
        </>
    );
}
