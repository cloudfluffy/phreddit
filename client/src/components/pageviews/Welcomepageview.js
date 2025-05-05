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
                        <h3>The heart of the internet</h3>
                        <p>Phreddit is home to thousands of communities, endless conversation, and authentic human connection. Whether you're into breaking news, sports, TV fan theories, or a never-ending stream of the internet's cutest animals, there's a community on Reddit for you.</p>
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
