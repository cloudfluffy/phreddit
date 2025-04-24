import Header from './Header.js';
import Post from './Post.js';

export default function Searchresultspageview(props) {
    const { display, displayPosts, query } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostID } = props;

    return (
        <>
            <Header
                title={displayPosts.length > 0 ? `Results for: ${query}` : `No results found for: ${query}`}
                display={display}
                displayPosts={displayPosts}
                setDisplayPosts={setDisplayPosts}
                query={query} />
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
