import axios from 'axios';
import { useState } from 'react';
import { WELCOME } from '../../display.js';
import errorFlash from '../../util/errorFlash.js';
import Button from '../parts/Button.js';

axios.defaults.withCredentials = true;

export default function Newuserpageview(props) {
    const { setDisplay, setFlash } = props;

    const [errors, setErrors] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        const emailRegex = /(^[^\s@]+)@[^\s@]+\.[^\s@]+$/;

        const match = email.match(emailRegex);
        const emailID = match ? match[1] : '';

        const firstNameEmptyError = firstName.trim() === '';
        const lastNameEmptyError = lastName.trim() === '';

        const emailEmptyError = email.trim() === '';
        const emailFormatError = emailEmptyError ? false : !emailRegex.test(email);

        const displayNameEmptyError = displayName.trim() === '';

        const passwordEmptyError = password === '';
        const passwordContainsFirstNameError = firstNameEmptyError ? false : password.toLowerCase().includes(firstName.toLowerCase());
        const passwordContainsLastNameError = lastNameEmptyError ? false : password.toLowerCase().includes(lastName.toLowerCase());
        const passwordContainsDisplayNameError = displayNameEmptyError ? false : password.toLowerCase().includes(displayName.toLowerCase());
        const passwordContainsEmailIDError = emailEmptyError || emailFormatError ? false : password.toLowerCase().includes(emailID.toLowerCase());

        const confirmPasswordEmptyError = confirmPassword === '';
        const confirmPasswordNotMatchError = confirmPassword !== password;

        setErrors([firstNameEmptyError, lastNameEmptyError, emailEmptyError, emailFormatError, false, displayNameEmptyError, false, passwordEmptyError, passwordContainsFirstNameError, passwordContainsLastNameError, passwordContainsDisplayNameError, passwordContainsEmailIDError, confirmPasswordEmptyError, confirmPasswordNotMatchError]);

        if (!firstNameEmptyError && !lastNameEmptyError && !emailEmptyError && !emailFormatError && !displayNameEmptyError && !passwordEmptyError && !passwordContainsFirstNameError && !passwordContainsLastNameError && !passwordContainsDisplayNameError && !passwordContainsEmailIDError && !confirmPasswordEmptyError && !confirmPasswordNotMatchError) {
            try {
                const { data: { message } } = await axios.post('http://localhost:8000/users/register', {
                    firstName,
                    lastName,
                    email,
                    displayName,
                    password,
                    confirmPassword
                });

                setDisplay(WELCOME);

                setFlash({ isSuccess: true, message });
            } catch (error) {
                errorFlash(error, setFlash);

                if (error.response) {
                    const { response: { data: { emailNotUnique, displayNameNotUnique } } } = error;
                    setErrors([firstNameEmptyError, lastNameEmptyError, emailEmptyError, emailFormatError, emailNotUnique, displayNameEmptyError, displayNameNotUnique, passwordEmptyError, passwordContainsFirstNameError, passwordContainsLastNameError, passwordContainsDisplayNameError, passwordContainsEmailIDError, confirmPasswordEmptyError, confirmPasswordNotMatchError]);
                }
            }
        }
    }

    return (
        <form id='create_form' onSubmit={handleSubmit}>
            <h2 id='create_form_title'>Register as a New User</h2>

            <div id='duo_input_container'>
                <div>
                    <label htmlFor='firstName'>First Name*</label>
                    <input
                        id='firstName'
                        className='input_field'
                        placeholder='First Name*'
                        type='text'
                        name='firstName'
                        value={firstName}
                        onChange={event => setFirstName(event.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor='lastName'>Last Name*</label>
                    <input
                        id='lastName'
                        className='input_field'
                        placeholder='Last Name*'
                        type='text'
                        name='lastName'
                        value={lastName}
                        onChange={event => setLastName(event.target.value)}
                    />
                </div>
            </div>
            {errors[0] && <p className='error'>First name should not be empty.</p>}
            {errors[1] && <p className='error'>Last name should not be empty.</p>}

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
            {errors[2] && <p className='error'>Email should not be empty.</p>}
            {errors[3] && <p className='error'>Email should be in a valid email format.</p>}
            {errors[4] && <p className='error'>Email already in use.</p>}

            <label htmlFor='displayName'>Display Name*</label>
            <input
                id='displayName'
                className='input_field'
                placeholder='Display Name*'
                type='text'
                name='displayName'
                value={displayName}
                onChange={event => setDisplayName(event.target.value)}
            />
            {errors[5] && <p className='error'>Display name should not be empty.</p>}
            {errors[6] && <p className='error'>Display name already in use.</p>}

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
            {errors[7] && <p className='error'>Password should not be empty.</p>}
            {errors[8] && <p className='error'>The password should not contain your first name.</p>}
            {errors[9] && <p className='error'>The password should not contain your last name.</p>}
            {errors[10] && <p className='error'>The password should not contain your display name.</p>}
            {errors[11] && <p className='error'>The password should not contain your email ID.</p>}

            <label htmlFor='confirmPassword'>Confirm Password*</label>
            <input
                id='confirmPassword'
                className='input_field'
                placeholder='Confirm Password*'
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={event => setConfirmPassword(event.target.value)}
            />
            {errors[12] && <p className='error'>Confirm password should not be empty.</p>}
            {errors[13] && <p className='error'>Password and confirm password should match.</p>}

            <Button
                type='form'
                content='Sign Up' />
        </form>
    );
}
