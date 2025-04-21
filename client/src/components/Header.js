import axios from 'axios';
import { COMMUNITY, HOME, SEARCHRESULTS } from '../display.js';
import '../stylesheets/Header.css';
import get_timestamp from '../util/get_timestamp.js';
import Content from './Content.js';

export default function Header(props) {
    const { title } = props;
    const { display, displayPosts, displayCommunity, query } = props;
    const { setDisplayPosts } = props;

    return (
        <>
            <div className='Header'>
                <h2 className='title'>{title}</h2>
                <div>
                    <button
                        className='btn'
                        onClick={async () => {
                            if (display === HOME) {
                                const response = await axios('http://127.0.0.1:8000/posts/newest');
                                setDisplayPosts(response.data);
                            } else if (display === COMMUNITY) {
                                const response = await axios(`http://127.0.0.1:8000/communities/${displayCommunity._id}/posts/newest`);
                                setDisplayPosts(response.data);
                            } else if (display === SEARCHRESULTS) {
                                const response = await axios(`http://127.0.0.1:8000/posts/search/${query}/newest`);
                                setDisplayPosts(response.data);
                            }
                        }}>Newest</button>
                    <button
                        className='btn'
                        onClick={async () => {
                            if (display === HOME) {
                                const response = await axios('http://127.0.0.1:8000/posts/oldest');
                                setDisplayPosts(response.data);
                            } else if (display === COMMUNITY) {
                                const response = await axios(`http://127.0.0.1:8000/communities/${displayCommunity._id}/posts/oldest`);
                                setDisplayPosts(response.data);
                            } else if (display === SEARCHRESULTS) {
                                const response = await axios(`http://127.0.0.1:8000/posts/search/${query}/oldest`);
                                setDisplayPosts(response.data);
                            }
                        }}>Oldest</button>
                    <button
                        className='btn'
                        onClick={async () => {
                            if (display === HOME) {
                                const response = await axios('http://127.0.0.1:8000/posts/active');
                                setDisplayPosts(response.data);
                            } else if (display === COMMUNITY) {
                                const response = await axios(`http://127.0.0.1:8000/communities/${displayCommunity._id}/posts/active`);
                                setDisplayPosts(response.data);
                            } else if (display === SEARCHRESULTS) {
                                const response = await axios(`http://127.0.0.1:8000/posts/search/${query}/active`);
                                setDisplayPosts(response.data);
                            }
                        }}>Active</button>
                </div>
            </div>
            {displayCommunity && <Content content={displayCommunity.description} />}
            {displayCommunity && <p>Created {get_timestamp(displayCommunity.startDate)}</p>}
            <p>{displayPosts.length} Post(s) {displayCommunity && `${displayCommunity.memberCount} Member(s)`}</p>
            <hr />
        </>
    );
}
