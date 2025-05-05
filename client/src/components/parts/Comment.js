import { NEWCOMMENT } from '../../display.js';
import '../../stylesheets/parts/Comment.css';
import getTimestamp from '../../util/getTimestamp.js';
import Button from '../parts/Button.js';
import Content from '../parts/Content.js';
import Votebuttons from '../parts/Votebuttons.js';

export default function Comment(props) {
    const { comment, depth } = props;
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setCommentToID } = props;

    return (
        <div className='Comment' style={{ marginLeft: `${depth * 35}px` }}>
            <p className='info'>{comment.commentedBy.displayName} • {getTimestamp(comment.commentedDate)}</p>
            <Content className='content' content={comment.content} />
            <div className='buttons'>
                <Votebuttons
                    isPost={false}
                    votable={comment}
                    clientInfo={clientInfo}
                    setClientInfo={setClientInfo} />
                <Button
                    disable={!clientInfo}
                    type='small'
                    content='Reply'
                    onClick={() => {
                        setCommentToID({
                            _id: comment._id,
                            isPost: false
                        });

                        setDisplay(NEWCOMMENT);
                    }} />
            </div>
        </div>
    );
}
