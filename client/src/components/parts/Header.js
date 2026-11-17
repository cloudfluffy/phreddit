import api from '../../api.js';
import { COMMUNITY, HOME, SEARCHRESULTS } from '../../display.js';
import { COMMENTS, COMMUNITIES, POSTS, USERS } from '../../listing.js';
import '../../stylesheets/parts/Header.css';
import errorFlash from '../../util/errorFlash.js';
import getTimestamp from '../../util/getTimestamp.js';
import Button from './Button.js';
import Content from './Content.js';

export default function Header(props) {
    const { title, isUserProfile } = props;
    const { display, displayPosts, clientInfo, displayCommunity, query, displayUser, listing } = props;
    const { setDisplayPosts, setDisplayPostsFromJoinedCommunities, setDisplayPostsFromOtherCommunities, setDisplayCommunity, setClientInfo, setFlash, setDisplayUser, setListing } = props;

    return (
        <>
            <div className='Header'>
                <div className='top_line'>
                    <h2 className='title'>{title}</h2>
                    <div className='buttons'>
                        {!isUserProfile && <>
                            <Button
                                content='Newest'
                                onClick={async () => {
                                    try {
                                        if (display === HOME) {
                                            const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await api.get('/posts/newest');
                                            setDisplayPosts(posts);
                                            setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                            setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                        } else if (display === COMMUNITY) {
                                            const { data: { posts } } = await api.get(`/communities/${displayCommunity._id}/posts/newest`);
                                            setDisplayPosts(posts);
                                        } else if (display === SEARCHRESULTS) {
                                            const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await api.get(`/posts/search/newest`, {
                                                params: {
                                                    query
                                                }
                                            });
                                            setDisplayPosts(posts);
                                            setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                            setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                        }
                                    } catch (error) {
                                        errorFlash(error, setFlash);
                                    }
                                }} />

                            <Button
                                content='Oldest'
                                onClick={async () => {
                                    try {
                                        if (display === HOME) {
                                            const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await api.get('/posts/oldest');
                                            setDisplayPosts(posts);
                                            setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                            setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                        } else if (display === COMMUNITY) {
                                            const { data: { posts } } = await api.get(`/communities/${displayCommunity._id}/posts/oldest`);
                                            setDisplayPosts(posts);
                                        } else if (display === SEARCHRESULTS) {
                                            const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await api.get(`/posts/search/oldest`, {
                                                params: {
                                                    query
                                                }
                                            });
                                            setDisplayPosts(posts);
                                            setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                            setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                        }
                                    } catch (error) {
                                        errorFlash(error, setFlash);
                                    }
                                }} />

                            <Button
                                content='Active'
                                onClick={async () => {
                                    try {
                                        if (display === HOME) {
                                            const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await api.get('/posts/active');
                                            setDisplayPosts(posts);
                                            setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                            setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                        } else if (display === COMMUNITY) {
                                            const { data: { posts } } = await api.get(`/communities/${displayCommunity._id}/posts/active`);
                                            setDisplayPosts(posts);
                                        } else if (display === SEARCHRESULTS) {
                                            const { data: { posts, postsFromJoinedCommunities, postsFromOtherCommunities } } = await api.get(`/posts/search/active`, {
                                                params: {
                                                    query
                                                }
                                            });
                                            setDisplayPosts(posts);
                                            setDisplayPostsFromJoinedCommunities(postsFromJoinedCommunities);
                                            setDisplayPostsFromOtherCommunities(postsFromOtherCommunities);
                                        }
                                    } catch (error) {
                                        errorFlash(error, setFlash);
                                    }
                                }} />
                        </>}

                        {displayCommunity && clientInfo &&
                            (clientInfo.communityIDs.includes(displayCommunity._id) ?
                                <Button
                                    content='Leave'
                                    onClick={async () => {
                                        try {
                                            const { data: { message } } = await api.put(`/communities/${displayCommunity._id}/leave`);

                                            const [{ data: { community } }, { data: { clientInfo } }] = await Promise.all([
                                                api.get(`/communities/${displayCommunity._id}`),
                                                api.get('/users/info')
                                            ])

                                            setDisplayCommunity(community);

                                            setClientInfo(clientInfo);

                                            setFlash({ isSuccess: true, message });
                                        } catch (error) {
                                            errorFlash(error, setFlash);
                                        }
                                    }}
                                /> :
                                <Button
                                    content='Join'
                                    onClick={async () => {
                                        try {
                                            const { data: { message } } = await api.put(`/communities/${displayCommunity._id}/join`);

                                            const [{ data: { community } }, { data: { clientInfo } }] = await Promise.all([
                                                api.get(`/communities/${displayCommunity._id}`),
                                                api.get('/users/info')
                                            ])

                                            setDisplayCommunity(community);

                                            setClientInfo(clientInfo);

                                            setFlash({ isSuccess: true, message });
                                        } catch (error) {
                                            errorFlash(error, setFlash);
                                        }
                                    }}
                                />)}

                        {isUserProfile && <>
                            {clientInfo.isAdmin && displayUser._id !== clientInfo._id && <Button
                                content='Return to Admin Profile'
                                onClick={() => {
                                    setDisplayUser(clientInfo);
                                    setListing(USERS);
                                }} />}

                            {clientInfo.isAdmin && displayUser._id === clientInfo._id && <Button
                                active={listing === USERS}
                                content='Users'
                                onClick={() => setListing(USERS)} />}

                            <Button
                                active={listing === COMMUNITIES}
                                content='Communities'
                                onClick={() => setListing(COMMUNITIES)} />

                            <Button
                                active={listing === POSTS}
                                content='Posts'
                                onClick={() => setListing(POSTS)} />

                            <Button
                                active={listing === COMMENTS}
                                content='Comments'
                                onClick={() => setListing(COMMENTS)} />
                        </>}
                    </div>
                </div>
                {displayCommunity && <Content content={displayCommunity.description} />}
                {displayCommunity && <p>Created {getTimestamp(displayCommunity.startDate)} by {displayCommunity.owner.displayName}</p>}
                {!isUserProfile && <p>{displayPosts?.length} Post(s) {displayCommunity && `${displayCommunity.memberCount} Member(s)`}</p>}

                {isUserProfile && <>
                    <p>Display Name: {displayUser.displayName}</p>
                    <p>Email: {displayUser.email}</p>
                    <p>Member since: {getTimestamp(displayUser.memberSince)}</p>
                    <p>Reputation: {displayUser.reputation}</p>
                </>}
            </div>
            <hr />
        </>
    );
}
