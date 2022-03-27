import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './poemSlice';
import Button from '@mui/material/Button';

const reactionEmoji = {
    1: '🥶',
    2: '😨',
    3: '😰',
    4: '😱',
    5: '🤯',
};

export const ReactionButtons = ({ poem }) => {
    const dispatch = useDispatch();

    if (!poem || !poem.reactions) {
        return null;
    }

    const reactionButtons = Object.entries(reactionEmoji).map(
        ([name, emoji]) => {
            const buttonContent = [emoji, <br />, poem.reactions[name]];
            return (
                <Button
                    key={name}
                    type='button'
                    className='muted-button reaction-button'
                    onClick={() =>
                        dispatch(
                            reactionAdded({ poemId: poem.id, reaction: name })
                        )
                    }
                >
                    {buttonContent}
                </Button>
            );
        }
    );

    return <div className='reactionButtons'>{reactionButtons}</div>;
};
