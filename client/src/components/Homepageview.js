import Header from './Header.js';
import Post from './Post.js';

export default function Homepageview(props) {
    const { display, displayPosts } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostID } = props;

    return (
        <>
            <Header
                title='All Posts'
                display={display}
                displayPosts={displayPosts}
                setDisplayPosts={setDisplayPosts} />
            {
                displayPosts.map(post => (
                    <Post
                        key={post._id}
                        postID={post._id}
                        showCommunity={true}
                        setDisplay={setDisplay}
                        setDisplayPostID={setDisplayPostID} />
                ))
            }
        </>
    );
}
