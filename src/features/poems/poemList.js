import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectAllPoems, fetchPoems } from './poemSlice';
import { PoemAuthor } from './PoemAuthor';
import { TimeAgo } from './TimeAgo';

export const PoemList = () => {
    const dispatch = useDispatch();
    const poems = useSelector(selectAllPoems);
    const poemStatus = useSelector((state) => state.poems.listStatus);
    const error = useSelector((state) => state.poems.error);

    useEffect(() => {
        if (poemStatus === 'idle') {
            dispatch(fetchPoems());
        }
    }, [poemStatus, dispatch]);

    let content;

    if (poemStatus === 'loading') {
        content = <div className='loader'>Loading</div>;
    } else if (poemStatus === 'succeeded') {
        content = poems
            .filter((poem) => !poem.archived)
            .map((poem) => (
                <article key={poem.id}>
                    <h3>{poem.title}</h3>
                    <PoemAuthor userId={poem.user} />
                    <TimeAgo timestamp={poem.date} />
                    {poem.lines.map((line, index) => (
                        <p key={`${poem.id}_${index}`}>{line}</p>
                    ))}
                    <Link to={`/poems/${poem.id}`}>View Poem</Link>
                </article>
            ));
    } else if (poemStatus === 'failed') {
        content = <div>{error}</div>;
    }

    return (
        <section>
            <h2>My Poems</h2>
            {content}
        </section>
    );
};
