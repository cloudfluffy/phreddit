import axios from 'axios';
import '../../stylesheets/parts/Votebuttons.css';
import errorFlash from '../../util/errorFlash';

axios.defaults.withCredentials = true;

export default function Votebuttons(props) {
    const { isPost, votable } = props;
    const { clientInfo } = props;
    const { setClientInfo, setFlash } = props;

    return (
        <div
            className={`Votebuttons ${!clientInfo ? 'disable' : ''} ${clientInfo && (isPost ? clientInfo.upvotedPostIDs.includes(votable?._id) : clientInfo.upvotedCommentIDs.includes(votable?._id)) ? 'upvoted' : ''} ${clientInfo && (isPost ? clientInfo.downvotedPostIDs.includes(votable?._id) : clientInfo.downvotedCommentIDs.includes(votable?._id)) ? 'downvoted' : ''}`}
            {...(!clientInfo && { onClick: event => event.stopPropagation() })}>
            <button
                {...(!clientInfo && { tabIndex: -1 })}
                className='upvote'
                {...(clientInfo && {
                    onClick: async event => {
                        try {
                            event.stopPropagation();

                            if (isPost) {
                                await axios.put(`http://localhost:8000/posts/${votable?._id}/upvote`);
                            } else {
                                await axios.put(`http://localhost:8000/comments/${votable?._id}/upvote`);
                            }

                            const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                            setClientInfo(clientInfo);
                        } catch (error) {
                            errorFlash(error, setFlash);
                        }
                    }
                })}>Upvote</button>

            {` ${votable?.voteCount} `}

            <button
                {...(!clientInfo && { tabIndex: -1 })}
                className='downvote'
                {...(clientInfo && {
                    onClick: async event => {
                        try {
                            event.stopPropagation();

                            if (isPost) {
                                await axios.put(`http://localhost:8000/posts/${votable?._id}/downvote`);
                            } else {
                                await axios.put(`http://localhost:8000/comments/${votable?._id}/downvote`);
                            }

                            const { data: { clientInfo } } = await axios.get('http://localhost:8000/users/info');

                            setClientInfo(clientInfo);
                        } catch (error) {
                            errorFlash(error, setFlash);
                        }
                    }
                })}>Downvote</button>
        </div>
    );
}
