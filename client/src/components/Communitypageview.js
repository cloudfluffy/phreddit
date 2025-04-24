import Header from './Header.js';
import Post from './Post.js';

export default function Communitypageview(props) {
    const { display, displayPosts, displayCommunity } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostID } = props;

    return (
        <>
            <Header
                title={displayCommunity.name}
                display={display}
                displayPosts={displayPosts}
                displayCommunity={displayCommunity}
                setDisplayPosts={setDisplayPosts} />
            {
                displayPosts.map(post => (
                    <Post
                        key={post._id}
                        postID={post._id}
                        showCommunity={false}
                        setDisplay={setDisplay}
                        setDisplayPostID={setDisplayPostID} />
                ))
            }
        </>
    );
}
