import { NEWCOMMENT } from '../display';
import '../stylesheets/Comment.css';
import getTimestamp from '../util/getTimestamp';
import Content from './Content.js';

export default function Comment(props) {
    const { comment, depth } = props;
    const { setDisplay, setCommentToID } = props;

    return (
        <div className='Comment' style={{ marginLeft: `${depth * 35}px` }}>
            <p className='info'>{comment.commentedBy} • {getTimestamp(comment.commentedDate)}</p>
            <Content className='content' content={comment.content} />
            <button className='btn' onClick={() => {
                setCommentToID({
                    _id: comment._id,
                    isPost: false
                });

                setDisplay(NEWCOMMENT);
            }}>Reply</button>
        </div>
    );
}
