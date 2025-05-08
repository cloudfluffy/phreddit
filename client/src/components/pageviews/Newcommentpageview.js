import axios from 'axios';
import { useState } from 'react';
import { POST } from '../../display.js';
import errorFlash from '../../util/errorFlash.js';
import Button from '../parts/Button.js';

axios.defaults.withCredentials = true;

export default function Newcommentpageview(props) {
    const { commentToInfo, commentToEdit } = props;
    const { setDisplay, setClientInfo, setFlash } = props;

    const [errors, setErrors] = useState([false, false, false, false]);
    const [content, setContent] = useState(commentToEdit ? commentToEdit.content : '');

    async function handleSubmit(event) {
        event.preventDefault();

        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let hyperlinkNameEmptyError = false;
        let hyperlinkProtocolError = false;
        let match;

        while ((match = hyperlinkRegex.exec(content)) !== null) {
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

        const contentLength = content.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;
        const contentEmptyError = contentLength === 0;
        const contentExceedError = contentLength > 500;

        setErrors([hyperlinkNameEmptyError, hyperlinkProtocolError, contentEmptyError, contentExceedError]);

        if (!hyperlinkNameEmptyError && !hyperlinkProtocolError && !contentEmptyError && !contentExceedError) {
            try {
                const { data: { message } } = await axios.post('http://localhost:8000/comments', {
                    content,
                    commentToInfo
                });

                const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                setClientInfo(clientInfo);

                setDisplay(POST);

                setFlash({ isSuccess: true, message });
            } catch (error) {
                errorFlash(error, setFlash);
            }
        }
    }

    return (
        <form id='create_form' onSubmit={handleSubmit}>
            <h2 id='create_form_title'>{commentToEdit ? 'Edit Comment' : 'Create Comment'}</h2>

            <label htmlFor='content'>Content*</label>
            <textarea
                id='content'
                className='input_field'
                placeholder='Content*'
                name='content'
                value={content}
                onChange={event => setContent(event.target.value)}></textarea>
            {errors[0] && <p className='error'>The hyperlink name should not be empty.</p>}
            {errors[1] && <p className='error'>The URL should start with "https://" or "http://".</p>}
            {errors[2] && <p className='error'>The content should not be empty.</p>}
            {errors[3] && <p className='error'>The content should not exceed 500 characters in length.</p>}

            <Button
                content='Submit Comment' />
        </form>
    );
}
