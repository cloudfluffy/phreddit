import { NEWCOMMENT } from '../display';
import '../stylesheets/Comment.css';
import get_timestamp from '../util/get_timestamp';
import Content from './Content.js';

export default function Comment(props) {
    const { comment, depth } = props;
    const { setDisplay, setCommentToID } = props;

    return (
        <div className='Comment' style={{ marginLeft: `${depth * 35}px` }}>
            <p className='info'>{comment.commentedBy} • {get_timestamp(comment.commentedDate)}</p>
            <Content className='content' content={comment.content} />
            <button className='btn' onClick={() => {
                setCommentToID({
                    _id: comment._id,
                    is_post: false
                });

                setDisplay(NEWCOMMENT);
            }}>Reply</button>
        </div>
    )
}
