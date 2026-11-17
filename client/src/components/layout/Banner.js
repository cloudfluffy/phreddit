import api from '../../api.js';
import { NEWPOST, SEARCHRESULTS, USERPROFILE, WELCOME } from '../../display.js';
import '../../stylesheets/layout/Banner.css';
import errorFlash from '../../util/errorFlash.js';
import Button from '../parts/Button.js';

export default function Banner(props) {
    const { display, clientInfo } = props;
    const { setDisplay, setQuery, setClientInfo, setFlash } = props;

    return (
        <div className='Banner'>
            <p
                className='app_name'
                onClick={() => setDisplay(WELCOME)}
            >phreddit</p>

            <form
                className='search_form'
                onSubmit={async event => {
                    event.preventDefault();

                    const query = event.target.elements.query.value;

                    if (query.trim()) {
                        setQuery(query);
                        setDisplay(SEARCHRESULTS);
                    }

                    event.target.elements.query.value = '';
                }}>
                <input type='text' className='search_bar' placeholder='Search Phreddit...' name='query' />
            </form>

            <div className='buttons'>
                <Button
                    disable={!clientInfo}
                    active={display === USERPROFILE}
                    content={clientInfo ? clientInfo.displayName : 'Guest'}
                    onClick={() => setDisplay(USERPROFILE)} />

                <Button
                    disable={!clientInfo}
                    active={display === NEWPOST}
                    content='Create Post'
                    onClick={() => setDisplay(NEWPOST)} />

                {clientInfo && <Button
                    content='Logout'
                    onClick={async () => {
                        try {
                            const { data: { message } } = await api.get('/users/logout');

                            setClientInfo(null);

                            setDisplay(WELCOME);

                            setFlash({ isSuccess: true, message })
                        } catch (error) {
                            errorFlash(error, setFlash);
                        }
                    }} />}
            </div>
        </div>
    );
}
