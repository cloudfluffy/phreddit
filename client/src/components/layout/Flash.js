import '../../stylesheets/layout/Flash.css';
import Button from '../parts/Button.js';

export default function Flash(props) {
    const { isSuccess, message } = props;
    const { setFlash } = props;

    return (
        <div className={`Flash ${isSuccess && 'success'}`}>
            <p>{message}</p>

            <Button
                type='small'
                content='Dismiss'
                onClick={() => setFlash(null)} />
        </div>
    )
}
