import api from '../../api.js';
import { useEffect, useState } from 'react';
import { HOME, POST } from '../../display.js';
import errorFlash from '../../util/errorFlash.js';
import Button from '../parts/Button.js';

export default function Newpostpageview(props) {
    const { postToEdit } = props;
    const { setDisplay, setClientInfo, setFlash, setDisplayPostID } = props;

    const [errors, setErrors] = useState([false, false, false, false, false, false, false, false]);
    const [communityID, setCommunityID] = useState(postToEdit ? postToEdit.communityID._id : '');
    const [title, setTitle] = useState(postToEdit ? postToEdit.title : '');
    const [existingLinkFlair, setExistingLinkFlair] = useState(postToEdit ? postToEdit?.linkFlairID?._id : '');
    const [newLinkFlair, setNewLinkFlair] = useState('');
    const [content, setContent] = useState(postToEdit ? postToEdit.content : '');

    const [linkflairs, setLinkflairs] = useState([]);
    const [joinedCommunities, setJoinedCommunities] = useState([]);
    const [otherCommunities, setOtherCommunities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [{ data: { linkFlairs } }, { data: { joinedCommunities, otherCommunities } }] = await Promise.all([
                    api.get('/linkflairs'),
                    api.get('/communities')
                ]);

                setLinkflairs(linkFlairs);
                setJoinedCommunities(joinedCommunities);
                setOtherCommunities(otherCommunities);
            } catch (error) {
                errorFlash(error, setFlash);
            }

            setIsLoading(false);
        })();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        const communityIDError = communityID === '';
        const titleEmptyError = title.trim() === '';
        const titleExceedError = title.trim().length > 100;
        const linkFlairChoiceConflictError = existingLinkFlair !== '' && newLinkFlair.trim() !== '';
        const newLinkFlairExceedError = newLinkFlair.trim().length > 30;

        const hyperlinkRegex = /\[(.*?)\]\((.*?)\)/g;
        let hyperlinkNameEmptyError = false;
        let hyperlinkProtocolError = false;
        let match;

        while ((match = hyperlinkRegex.exec(content)) !== null) {
            if (hyperlinkNameEmptyError && hyperlinkProtocolError) {
                break;
            }

            if (!match[1].trim()) {
                hyperlinkNameEmptyError = true;
            }

            if (!match[2].match(/^https?:\/\//)) {
                hyperlinkProtocolError = true;
            }
        }

        const contentLength = content.replaceAll(hyperlinkRegex, '$1').replaceAll(/\s*\n\s*/g, '').trim().length;
        const contentError = contentLength === 0;

        setErrors([communityIDError, titleEmptyError, titleExceedError, linkFlairChoiceConflictError, newLinkFlairExceedError, contentError, hyperlinkNameEmptyError, hyperlinkProtocolError]);

        if (!communityIDError && !titleEmptyError && !titleExceedError && !linkFlairChoiceConflictError && !newLinkFlairExceedError && !contentError && !hyperlinkNameEmptyError && !hyperlinkProtocolError) {
            try {
                let linkFlairID = '';

                if (existingLinkFlair) {
                    linkFlairID = existingLinkFlair;
                }

                if (newLinkFlair) {
                    const response = await api.post('/linkflairs', {
                        content: newLinkFlair
                    });
                    linkFlairID = response.data.linkFlairID;
                }

                if (postToEdit) {
                    const { data: { message } } = await api.put(`/posts/${postToEdit._id}/edit`, {
                        title,
                        content,
                        linkFlairID,
                        communityID
                    });

                    setDisplayPostID(postToEdit._id);

                    setDisplay(POST);

                    setFlash({ isSuccess: true, message });
                } else {
                    const { data: { message } } = await api.post('/posts', {
                        title,
                        content,
                        linkFlairID,
                        communityID
                    });

                    const { data: { clientInfo } } = await api.get('/users/info');

                    setClientInfo(clientInfo);

                    setDisplay(HOME);

                    setFlash({ isSuccess: true, message });
                }
            } catch (error) {
                errorFlash(error, setFlash);
            }
        }
    }

    return (
        <>
            {!isLoading &&
                <form id='create_form' onSubmit={handleSubmit}>
                    <h2 id='create_form_title'>{postToEdit ? 'Edit Post' : 'Create Post'}</h2>

                    <label htmlFor='communityID'>Community*</label>
                    <select
                        id='communityID'
                        className='input_field'
                        name='communityID'
                        value={communityID}
                        onChange={event => setCommunityID(event.target.value)}>
                        <option value=''>Select a Community*</option>
                        {joinedCommunities?.map(({ _id, name }) => (
                            <option key={_id} value={_id}>{name}</option>
                        ))}
                        {otherCommunities?.map(({ _id, name }) => (
                            <option key={_id} value={_id}>{name}</option>
                        ))}
                    </select>
                    {errors[0] && <p className='error'>Please select a community.</p>}

                    <label htmlFor='title'>Title*</label>
                    <input
                        id='title'
                        className='input_field'
                        type='text'
                        placeholder='Title*'
                        name='title'
                        value={title}
                        onChange={event => setTitle(event.target.value)} />
                    {errors[1] && <p className='error'>The title should not be empty.</p>}
                    {errors[2] && <p className='error'>The title should not exceed 100 characters in length.</p>}

                    <div id='duo_input_container'>
                        <div>
                            <label htmlFor='linkFlairID'>Select Existing Link Flair</label>
                            <select
                                id='linkFlairID'
                                className='input_field'
                                name='linkFlairID'
                                value={existingLinkFlair}
                                onChange={event => setExistingLinkFlair(event.target.value)}>
                                <option value=''>Select a Link Flair</option>
                                {linkflairs?.map(({ _id, content }) => (
                                    <option key={_id} value={_id}>{content}</option>
                                ))}
                            </select>
                        </div>

                        <span>Or</span>

                        <div>
                            <label htmlFor='link_flair_content'>Create New Link Flair</label>
                            <input
                                id='link_flair_content'
                                className='input_field'
                                type='text'
                                placeholder='New Link Flair'
                                name='link_flair_content'
                                value={newLinkFlair}
                                onChange={event => setNewLinkFlair(event.target.value)} />
                        </div>
                    </div>
                    {errors[3] && <p className='error'>You cannot select an existing link flair and create a new link flair simultaneously.</p>}
                    {errors[4] && <p className='error'>A new link flair should not exceed 30 characters in length.</p>}

                    <label htmlFor='content'>Content*</label>
                    <textarea
                        id='content'
                        className='input_field'
                        placeholder='Content*'
                        name='content'
                        value={content}
                        onChange={event => setContent(event.target.value)}></textarea>
                    {errors[5] && <p className='error'>The content should not be empty.</p>}
                    {errors[6] && <p className='error'>The hyperlink name should not be empty.</p>}
                    {errors[7] && <p className='error'>The URL should start with "https://" or "http://".</p>}

                    <Button
                        content={postToEdit ? 'Edit Posts' : 'Submit Post'} />
                </form >
            }
        </>
    );
}
