import axios from 'axios';
import { COMMUNITY, HOME, SEARCHRESULTS } from '../../display.js';
import '../../stylesheets/parts/Header.css';
import getTimestamp from '../../util/getTimestamp.js';
import Button from './Button.js';
import Content from './Content.js';

axios.defaults.withCredentials = true;

export default function Header(props) {
    const { title } = props;
    const { display, displayPosts, clientInfo, displayCommunity, query } = props;
    const { setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setDisplayCommunity, setClientInfo } = props;

    return (
        <>
            <div className='Header'>
                <div className='top_line'>
                    <h2 className='title'>{title}</h2>
                    <div className='buttons'>
                        <Button
                            content='Newest'
                            onClick={async () => {
                                if (display === HOME) {
                                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get('http://localhost:8000/posts/newest');
                                    setDisplayPosts(posts);
                                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                } else if (display === COMMUNITY) {
                                    const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${displayCommunity._id}/posts/newest`);
                                    setDisplayPosts(posts);
                                } else if (display === SEARCHRESULTS) {
                                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get(`http://localhost:8000/posts/search/${query}/newest`);
                                    setDisplayPosts(posts);
                                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                }
                            }} />

                        <Button
                            content='Oldest'
                            onClick={async () => {
                                if (display === HOME) {
                                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get('http://localhost:8000/posts/oldest');
                                    setDisplayPosts(posts);
                                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                } else if (display === COMMUNITY) {
                                    const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${displayCommunity._id}/posts/oldest`);
                                    setDisplayPosts(posts);
                                } else if (display === SEARCHRESULTS) {
                                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get(`http://localhost:8000/posts/search/${query}/oldest`);
                                    setDisplayPosts(posts);
                                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                }
                            }} />

                        <Button
                            content='Active'
                            onClick={async () => {
                                if (display === HOME) {
                                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get('http://localhost:8000/posts/active');
                                    setDisplayPosts(posts);
                                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                } else if (display === COMMUNITY) {
                                    const { data: { posts } } = await axios.get(`http://localhost:8000/communities/${displayCommunity._id}/posts/active`);
                                    setDisplayPosts(posts);
                                } else if (display === SEARCHRESULTS) {
                                    const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await axios.get(`http://localhost:8000/posts/search/${query}/active`);
                                    setDisplayPosts(posts);
                                    setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                    setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                }
                            }} />

                        {displayCommunity && clientInfo &&
                            (clientInfo.communityIDs.includes(displayCommunity._id) ?
                                <Button
                                    content='Leave'
                                    onClick={async () => {
                                        await axios.put(`http://localhost:8000/communities/${displayCommunity._id}/leave`);

                                        const [{ data: { community } }, { data: { clientInfo } }] = await Promise.all([
                                            axios.get(`http://localhost:8000/communities/${displayCommunity._id}`),
                                            axios.get('http://localhost:8000/users/info')
                                        ])

                                        setDisplayCommunity(community);

                                        setClientInfo(clientInfo);
                                    }}
                                /> :
                                <Button
                                    content='Join'
                                    onClick={async () => {
                                        await axios.put(`http://localhost:8000/communities/${displayCommunity._id}/join`);

                                        const [{ data: { community } }, { data: { clientInfo } }] = await Promise.all([
                                            axios.get(`http://localhost:8000/communities/${displayCommunity._id}`),
                                            axios.get('http://localhost:8000/users/info')
                                        ])

                                        setDisplayCommunity(community);

                                        setClientInfo(clientInfo);
                                    }}
                                />)}
                    </div>
                </div>
                {displayCommunity && <Content content={displayCommunity.description} />}
                {displayCommunity && <p>Created {getTimestamp(displayCommunity.startDate)}</p>}
                <p>{displayPosts.length} Post(s) {displayCommunity && `${displayCommunity.memberCount} Member(s)`}</p>
            </div>
            <hr />
        </>
    );
}
