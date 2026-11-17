import { useState } from 'react';
import '../../stylesheets/parts/Confirmbutton.css';
import Button from './Button.js';

export default function Confirmbutton(props) {
    const { content, onClick } = props

    const [confirm, setConfirm] = useState(false);

    return (
        <div className='Confirmbutton'>
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
