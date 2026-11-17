import { HOME, LOGIN, NEWUSER } from '../../display.js';
import '../../stylesheets/pageviews/Welcomepageview.css';
import Button from '../parts/Button.js';

export default function Welcomepageview(props) {
    const { clientInfo } = props;
    const { setDisplay } = props;

    return (
        <div className='Welcomepageview'>
            <div className='content'>
                <h2>Welcome to Phreddit</h2>
                <div className='panel'>
                    <div className='description'>
                        <h3>Communities for whatever you are into</h3>
                        <p>Phreddit is a place to start communities, share posts, and talk things through in threaded comments. Register to post, comment and vote, or continue as a guest to browse and search.</p>
                    </div>
                    <div className='buttons'>
                        <Button
                            disable={clientInfo}
                            type='big'
                            content='Register as a New User'
                            onClick={() => setDisplay(NEWUSER)} />

                        <Button
                            disable={clientInfo}
                            type='big'
                            content='Login as an Existing User'
                            onClick={() => setDisplay(LOGIN)} />

                        <Button
                            disable={clientInfo}
                            type='big'
                            content='Continue as a Guest User'
                            onClick={() => setDisplay(HOME)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
