import '../../stylesheets/parts/Button.css';

export default function Button(props) {
    const { disable, active, type, content, onClick } = props;

    return (
        <button
            {...(disable && { tabIndex: -1 })}
            className={`Button ${disable && 'disable'} ${active && 'active'} ${type}`}
            {...(!disable && onClick && { onClick })}
        >{content}</button>
    );
}
