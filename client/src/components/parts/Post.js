import api from '../../api.js';
import { POST } from '../../display.js';
import '../../stylesheets/parts/Post.css';
import countComments from '../../util/countComments.js';
import errorFlash from '../../util/errorFlash.js';
import getTimestamp from '../../util/getTimestamp.js';
import Content from './Content.js';
import Linkflair from './Linkflair.js';
import Votebuttons from './Votebuttons.js';

export default function Post(props) {
    const { post, showCommunity } = props;
    const { clientInfo } = props;
    const { setDisplay, setClientInfo, setDisplayPostID, setFlash } = props;

    return (
        <div
            className='Post'
            tabIndex='0'
            onClick={async () => {
                try {
                    await api.put(`/posts/${post?._id}/views`);

                    setDisplayPostID(post?._id);

                    setDisplay(POST);
                } catch (error) {
                    errorFlash(error, setFlash);
                }
            }}>
            <p className='info'>{showCommunity && `${post?.communityID.name} •`} {post?.postedBy.displayName} • {getTimestamp(post?.postedDate)}</p>
            <h3 className='title'>{post?.title}</h3>
            {post?.linkFlairID && <Linkflair content={post?.linkFlairID.content} />}
            <Content
                className='content'
                content={post?.content}
                limit={80} />
            <div className='infos'>
                <Votebuttons
                    isPost={true}
                    votable={post}
                    clientInfo={clientInfo}
                    setClientInfo={setClientInfo}
                    setFlash={setFlash} />
                <p>{post?.views} view(s)</p>
                <p>{countComments(post?.commentIDs)} comment(s)</p>
            </div>
        </div>
    );
}
