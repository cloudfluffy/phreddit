import axios from 'axios';
import { HOME, NEWPOST, SEARCHRESULTS } from '../display';
import '../stylesheets/Banner.css';

export default function Banner(props) {
    const { display } = props;
    const { setDisplay, setDisplayPosts, setQuery } = props;

    return (
        <div className='Banner'>
            <p
                className='app_name'
                onClick={async () => {
                    const response = await axios.get('http://127.0.0.1:8000/posts/newest');
                    setDisplayPosts(response.data);

                    setDisplay(HOME);
                }}>phreddit</p>
            <form
                className='search_form'
                onSubmit={async (event) => {
                    event.preventDefault();
                    const query = event.target.elements.query.value;

                    if (query.trim()) {
                        const response = await axios.get(`http://127.0.0.1:8000/posts/search/${query}/newest`)
                        setDisplayPosts(response.data);

                        setQuery(query);

                        setDisplay(SEARCHRESULTS);
                    }

                    event.target.elements.query.value = '';
                }}>
                <input type='text' className='search_bar' placeholder='Search Phreddit...' name='query' />
            </form>
            <button
                className='btn'
                style={{ background: display === NEWPOST ? '#ff4500' : '' }}
                onClick={() => {
                    setDisplay(NEWPOST)
                }}>Create Post</button>
        </div>
    );
}
