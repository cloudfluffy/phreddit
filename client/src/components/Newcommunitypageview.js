import axios from 'axios';
import { useState } from 'react';
import { COMMUNITY } from '../display.js';

export default function Newcommunitypageview(props) {
    const { setDisplay, setDisplayPosts, setDisplayCommunity } = props;

    const [errors, setErrors] = useState([false, false, false, false, false, false, false]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [username, setUsername] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const nameEmptyError = name.trim() === '';
        const nameExceedError = name.trim().length > 100;

        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let hyperlinkNameEmptyError = false;
        let hyperlinkProtocolError = false;
        let match;

        while ((match = hyperlinkRegex.exec(description)) !== null) {
            if (hyperlinkNameEmptyError && hyperlinkProtocolError) {
                break;
            }

            if (!match[1].trim()) {
                hyperlinkNameEmptyError = true;
            }

            if (!match[2].match(/^https?:\/\//)) {
                hyperlinkProtocolError = true;
            }
        }

        const descriptionLength = description.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;
        const descriptionEmptyError = descriptionLength === 0;
        const descriptionExceedError = descriptionLength > 500;
        const usernameError = username.trim() === '';

        setErrors([nameEmptyError, nameExceedError, hyperlinkNameEmptyError, hyperlinkProtocolError, descriptionEmptyError, descriptionExceedError, usernameError]);

        if (!nameEmptyError && !nameExceedError && !hyperlinkNameEmptyError && !hyperlinkProtocolError && !descriptionEmptyError && !descriptionExceedError && !usernameError) {
            let response = await axios.post('http://127.0.0.1:8000/communities', {
                name,
                description,
                members: [username]
            });

            const community = response.data.community;

            response = await axios.get(`http://127.0.0.1:8000/communities/${community._id}/posts/newest`);

            setDisplayPosts(response.data);

            setDisplayCommunity(community);

            setDisplay(COMMUNITY);
        }
    }

    return (
        <form id='create_form' onSubmit={handleSubmit}>
            <h2 id='create_form_title'>Create Community</h2>

            <label htmlFor='name'>Community Name*</label>
            <input
                id='name'
                className='input_field'
                placeholder='Community Name*'
                type='text'
                name='name'
                value={name}
                onChange={event => setName(event.target.value)} />
            {errors[0] && <p className='error'>The community name should not be empty.</p>}
            {errors[1] && <p className='error'>The community name should not exceed 100 characters in length.</p>}

            <label htmlFor='description'>Description*</label>
            <textarea
                id='description'
                className='input_field'
                placeholder='Description*'
                name='description'
                value={description}
                onChange={event => setDescription(event.target.value)}></textarea>
            {errors[2] && <p className='error'>The hyperlink name should not be empty.</p>}
            {errors[3] && <p className='error'>The URL should start with "https://" or "http://".</p>}
            {errors[4] && <p className='error'>The description should not be empty.</p>}
            {errors[5] && <p className='error'>The description should not exceed 500 characters in length.</p>}

            <label htmlFor='username'>Username*</label>
            <input
                id='username'
                className='input_field'
                placeholder='Username*'
                type='text'
                name='username'
                value={username}
                onChange={event => setUsername(event.target.value)} />
            {errors[6] && <p className='error'>The username should not be empty.</p>}

            <button className='btn'>Engender Community</button>
        </form>
    );
}
