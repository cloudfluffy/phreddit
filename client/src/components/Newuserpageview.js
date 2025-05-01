import axios from 'axios';
import { useState } from 'react';
import { WELCOME } from '../display.js';

axios.defaults.withCredentials = true;

export default function Newuserpageview(props) {
    const { setDisplay } = props;

    const [errors, setErrors] = useState([false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');

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
        const passwordContainsDisplayNameError = passwordEmptyError ? false : password.toLowerCase().includes(displayName.toLowerCase());
        const passwordContainsEmailIDError = emailEmptyError ? false : password.toLowerCase().includes(emailID.toLowerCase());

        const comfirmPasswordEmptyError = comfirmPassword === '';
        const comfirmPasswordNotMatchError = comfirmPassword !== password;

        setErrors([firstNameEmptyError, lastNameEmptyError, emailEmptyError, emailFormatError, false, displayNameEmptyError, false, passwordEmptyError, passwordContainsFirstNameError, passwordContainsLastNameError, passwordContainsDisplayNameError, passwordContainsEmailIDError, comfirmPasswordEmptyError, comfirmPasswordNotMatchError]);

        if (!firstNameEmptyError && !lastNameEmptyError && !emailEmptyError && !emailFormatError && !displayNameEmptyError && !passwordEmptyError && !passwordContainsFirstNameError && !passwordContainsLastNameError && !passwordContainsDisplayNameError && !passwordContainsEmailIDError && !comfirmPasswordEmptyError && !comfirmPasswordNotMatchError) {
            try {
                await axios.post('http://localhost:8000/users/register', {
                    firstName,
                    lastName,
                    email,
                    displayName,
                    password,
                    comfirmPassword
                });

                setDisplay(WELCOME);
            } catch (error) {
                if (error.response.status === 400) {
                    const { emailNotUnique, displayNameNotUnique } = error.response.data;
                    setErrors([firstNameEmptyError, lastNameEmptyError, emailEmptyError, emailFormatError, emailNotUnique, displayNameEmptyError, displayNameNotUnique, passwordEmptyError, passwordContainsFirstNameError, passwordContainsLastNameError, passwordContainsDisplayNameError, passwordContainsEmailIDError, comfirmPasswordEmptyError, comfirmPasswordNotMatchError]);
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
            {errors[8] && <p className='error'>The password should not contain the first name.</p>}
            {errors[9] && <p className='error'>The password should not contain the last name.</p>}
            {errors[10] && <p className='error'>The password should not contain the display name.</p>}
            {errors[11] && <p className='error'>The password should not contain the email ID.</p>}

            <label htmlFor='comfirmPassword'>Comfirm Password*</label>
            <input
                id='comfirmPassword'
                className='input_field'
                placeholder='Comfirm Password*'
                type='password'
                name='comfirmPassword'
                value={comfirmPassword}
                onChange={event => setComfirmPassword(event.target.value)}
            />
            {errors[12] && <p className='error'>Comfirm password should not be empty.</p>}
            {errors[13] && <p className='error'>Password and comfirm password should match.</p>}

            <button className='btn'>Register</button>
        </form>
    );
}
