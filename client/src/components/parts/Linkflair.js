import '../../stylesheets/parts/Linkflair.css';

export default function Linkflair(props) {
    const { content } = props;

    return <p className='Linkflair'>{content}</p>;
}
