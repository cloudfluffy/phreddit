import axios from 'axios';
import { useState } from 'react';
import { HOME } from '../../display.js';
import errorFlash from '../../util/errorFlash.js';
import Button from '../parts/Button.js';

axios.defaults.withCredentials = true;

export default function Loginpageview(props) {
    const { setDisplay, setClientInfo, setFlash } = props;

    const [errors, setErrors] = useState([false, false, false]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const emailRegex = /(^[^\s@]+)@[^\s@]+\.[^\s@]+$/;

        const emailEmptyError = email.trim() === '';
        const emailFormatError = !emailRegex.test(email);

        const passwordEmptyError = password.trim() === '';

        setErrors([emailEmptyError, emailFormatError, passwordEmptyError, false]);

        if (!emailEmptyError && !emailFormatError && !passwordEmptyError) {
            try {
                const { data: { message, clientInfo } } = await axios.post('http://localhost:8000/users/login', {
                    email,
                    password
                });

                setClientInfo(clientInfo);

                setDisplay(HOME);

                setFlash({ isSuccess: true, message })
            } catch (error) {
                if (error.response) {
                    const { response: { status } } = error;
                    setErrors([emailEmptyError, emailFormatError, passwordEmptyError, status === 400]);
                }

                errorFlash(error, setFlash);
            }
        }
    }

    return (
        <form id='create_form' onSubmit={handleSubmit}>
            <h2 id='create_form_title'>Login as an Existing User</h2>

            <label htmlFor='email'>Email*</label>
            <input
                id='email'
                className='input_field'
                placeholder='Email*'
                type='text'
                name='email'
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
            {errors[0] && <p className='error'>Email should not be empty.</p>}
            {errors[1] && <p className='error'>Email should be in a valid email format.</p>}

            <label htmlFor='password'>Password*</label>
            <input
                id='password'
                className='input_field'
                placeholder='Password*'
                type='password'
                name='password'
                value={password}
                onChange={event => setPassword(event.target.value)}
            />
            {errors[2] && <p className='error'>Password should not be empty.</p>}
            {errors[3] && <p className='error'>Invalid email or password.</p>}

            <Button
                type='form'
                content='Login' />
        </form>
    );
}
