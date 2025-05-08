import { useState } from 'react';
import '../../stylesheets/parts/Comfirmbutton.css';
import Button from './Button.js';

export default function Comfirmbutton(props) {
    const { content, onClick } = props

    const [confirm, setConfirm] = useState(false);

    return (
        <div className='Comfirmbutton'>
            {!confirm && <Button
                type='small'
                content={content}
                onClick={event => {
                    event.stopPropagation();
                    setConfirm(true);
                }} />}

            {confirm && <>
                <p>Are you sure?</p>
                <Button
                    type='small'
                    content='Yes'
                    onClick={event => {
                        event.stopPropagation();
                        onClick();
                    }} />
                <Button
                    type='small'
                    content='No'
                    onClick={event => {
                        event.stopPropagation();
                        setConfirm(false);
                    }} />
            </>}
        </div>
    )
}
