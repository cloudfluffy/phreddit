import axios from 'axios';
import { NEWPOST, SEARCHRESULTS, WELCOME } from '../display';
import '../stylesheets/Banner.css';

axios.defaults.withCredentials = true;

export default function Banner(props) {
    const { display, clientInfo } = props;
    const { setDisplay, setDisplayPosts, setQuery, setClientInfo } = props;

    return (
        <div className='Banner'>
            <p
                className='app_name'
                onClick={async () => {
                    setDisplay(WELCOME);
                }}>phreddit</p>

            <form
                className='search_form'
                onSubmit={async (event) => {
                    event.preventDefault();
                    const query = event.target.elements.query.value;

                    if (query.trim()) {
                        const response = await axios.get(`http://localhost:8000/posts/search/${query}/newest`)
                        setDisplayPosts(response.data);

                        setQuery(query);

                        setDisplay(SEARCHRESULTS);
                    }

                    event.target.elements.query.value = '';
                }}>
                <input type='text' className='search_bar' placeholder='Search Phreddit...' name='query' />
            </form>

            <div className='buttons'>
                <button
                    className={clientInfo.isLoggedIn ? 'btn' : 'disabled_btn'}
                >{clientInfo.isLoggedIn ? clientInfo.displayName : 'Guest'}</button>

                <button
                    className={clientInfo.isLoggedIn ? 'btn' : 'disabled_btn'}
                    style={{ background: display === NEWPOST ? '#ff4500' : '' }}
                    onClick={() => {
                        if (clientInfo.isLoggedIn) {
                            setDisplay(NEWPOST)
                        }
                    }}>Create Post</button>

                {clientInfo.isLoggedIn && <button
                    className='btn'
                    onClick={async () => {
                        await axios.get('http://localhost:8000/users/logout');

                        setClientInfo({ isLoggedIn: false, displayName: '' });

                        setDisplay(WELCOME);
                    }}
                >Logout</button>}
            </div>
        </div>
    );
}
