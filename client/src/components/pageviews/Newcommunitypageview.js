import api from '../../api.js';
import { useState } from 'react';
import { COMMUNITY } from '../../display.js';
import errorFlash from '../../util/errorFlash.js';
import Button from '../parts/Button.js';

export default function Newcommunitypageview(props) {
    const { communityToEdit } = props;
    const { setDisplay, setClientInfo, setDisplayCommunity, setFlash } = props;

    const [errors, setErrors] = useState([false, false, false, false, false, false]);
    const [name, setName] = useState(communityToEdit ? communityToEdit.name : '');
    const [description, setDescription] = useState(communityToEdit ? communityToEdit.description : '');

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

        setErrors([nameEmptyError, nameExceedError, false, hyperlinkNameEmptyError, hyperlinkProtocolError, descriptionEmptyError, descriptionExceedError]);

        if (!nameEmptyError && !nameExceedError && !hyperlinkNameEmptyError && !hyperlinkProtocolError && !descriptionEmptyError && !descriptionExceedError) {
            try {
                if (communityToEdit) {
                    const { data: { message, community } } = await api.put(`/communities/${communityToEdit._id}/edit`, {
                        name: name.trim(),
                        description
                    });

                    setDisplayCommunity(community);

                    setDisplay(COMMUNITY);

                    setFlash({ isSuccess: true, message });
                } else {
                    const { data: { message, community } } = await api.post('/communities', {
                        name: name.trim(),
                        description
                    });

                    const { data: { clientInfo } } = await api.get('/users/info');

                    setDisplayCommunity(community);
                    setClientInfo(clientInfo);

                    setDisplay(COMMUNITY);

                    setFlash({ isSuccess: true, message });
                }
            } catch (error) {
                errorFlash(error, setFlash);

                if (error.response) {
                    const { response: { data: { nameNotUnique } } } = error;
                    setErrors([nameEmptyError, nameExceedError, nameNotUnique, hyperlinkNameEmptyError, hyperlinkProtocolError, descriptionEmptyError, descriptionExceedError]);
                }
            }
        }
    }

    return (
        <form id='create_form' onSubmit={handleSubmit}>
            <h2 id='create_form_title'>{communityToEdit ? 'Edit Community' : 'Create Community'}</h2>

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
            {errors[2] && <p className='error'>Community name already in use.</p>}

            <label htmlFor='description'>Description*</label>
            <textarea
                id='description'
                className='input_field'
                placeholder='Description*'
                name='description'
                value={description}
                onChange={event => setDescription(event.target.value)}></textarea>
            {errors[3] && <p className='error'>The hyperlink name should not be empty.</p>}
            {errors[4] && <p className='error'>The URL should start with "https://" or "http://".</p>}
            {errors[5] && <p className='error'>The description should not be empty.</p>}
            {errors[6] && <p className='error'>The description should not exceed 500 characters in length.</p>}

            <Button
                content={communityToEdit ? 'Edit Community' : 'Engender Community'} />
        </form>
    );
}
