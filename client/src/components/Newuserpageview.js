import { useState } from 'react';
import { WELCOME } from '../display.js';

export default function Newuserpageview(props) {
    const { setDisplay } = props;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [password, setPassword] = useState('');
    const [comfirmPassword, setComfirmPassword] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();

        setDisplay(WELCOME);
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

            <button className='btn'>Register</button>
        </form>
    );
}
