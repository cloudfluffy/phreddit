import '../stylesheets/Welcomepageview.css';

export default function Welcomepageview(props) {
    return (
        <div className='Welcomepageview'>
            <div className='content'>
                <h2>Welcome to Phreddit</h2>
                <div className='panel'>
                    <div className='description'>
                        <h3>The heart of the internet</h3>
                        <p>Phreddit is home to thousands of communities, endless conversation, and authentic human connection. Whether you're into breaking news, sports, TV fan theories, or a never-ending stream of the internet's cutest animals, there's a community on Reddit for you.</p>
                    </div>
                    <div className='logins'>
                        <button className='btn'>Register as a New User</button>
                        <button className='btn'>Login as an Existing User</button>
                        <button className='btn'>Continue as a Guest User</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
