import axios from 'axios';
import { useState } from 'react';
import { POST } from '../display.js';

export default function Newcommentpageview(props) {
    const { commentToID } = props;
    const { setDisplay } = props;

    const [errors, setErrors] = useState([false, false, false, false, false]);
    const [content, setContent] = useState('');
    const [commentedBy, setCommentedBy] = useState('');

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
        const commentedByError = commentedBy.trim() === '';

        setErrors([hyperlinkNameEmptyError, hyperlinkProtocolError, contentEmptyError, contentExceedError, commentedByError]);

        if (!hyperlinkNameEmptyError && !hyperlinkProtocolError && !contentEmptyError && !contentExceedError && !commentedByError) {
            await axios.post('http://127.0.0.1:8000/comments', {
                content,
                commentedBy,
                commentToID
            });

            setDisplay(POST);
        }
    }

    return (
        <form id='create_form' onSubmit={handleSubmit}>
            <h2 id='create_form_title'>Create Comment</h2>

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

            <label htmlFor='commentedBy'>Username*</label>
            <input
                id='commentedBy'
                className='input_field'
                placeholder='Username*'
                type='text'
                name='commentedBy'
                value={commentedBy}
                onChange={event => setCommentedBy(event.target.value)} />
            {errors[4] && <p className='error'>The username should not be empty.</p>}

            <button className='btn'>Submit Comment</button>
        </form>
    );
}
