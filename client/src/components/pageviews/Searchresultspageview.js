import Header from '../parts/Header.js';
import Post from '../parts/Post.js';

export default function Searchresultspageview(props) {
    const { display, displayPosts, displayPostsFromJoinedCommunities, displayPostsFromOtherCommunities, query, clientInfo } = props;
    const { setDisplay, setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setClientInfo, setDisplayPostID } = props;


    return (
        <>
            <Header
                title={displayPosts.length > 0 ? `Results for: ${query}` : `No results found for: ${query}`}
                display={display}
                displayPosts={displayPosts}
                setDisplayPosts={setDisplayPosts}
                setDisplayPostsFromJoinedCommunities={setDisplayPostsFromJoinedCommunities}
                setDisplayPostsFromOtherCommunities={setDisplayPostsFromOtherCommunities}
                query={query} />

            {!clientInfo && displayPosts.map(post => (
                <Post
                    key={post._id}
                    postID={post._id}
                    showCommunity={true}
                    clientInfo={clientInfo}
                    setDisplay={setDisplay}
                    setClientInfo={setClientInfo}
                    setDisplayPostID={setDisplayPostID} />
            ))}

            {clientInfo && <>
                <h3>Posts from Joined Communities</h3>
                {displayPostsFromJoinedCommunities.map(post => (
                    <Post
                        key={post._id}
                        postID={post._id}
                        showCommunity={true}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setClientInfo={setClientInfo}
                        setDisplayPostID={setDisplayPostID} />
                ))}</>}

            {clientInfo && <>
                <h3>Posts from Other Communities</h3>
                {displayPostsFromOtherCommunities.map(post => (
                    <Post
                        key={post._id}
                        postID={post._id}
                        showCommunity={true}
                        clientInfo={clientInfo}
                        setDisplay={setDisplay}
                        setClientInfo={setClientInfo}
                        setDisplayPostID={setDisplayPostID} />
                ))}</>}
        </>
    );
}
