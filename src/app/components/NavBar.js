import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const NavBar = () => {
    const userName = '🌎';
    const buttons = [
        { name: 'bldr', text: 'bldr', url: '' },
        { name: 'help', text: 'Help', url: '/help' },
        { name: 'selfDestruct', text: 'Self Destruct', url: '/relax' },
        { name: 'myPoems', text: 'My Poems', url: '/history' },
        { name: 'user', text: `by ${userName}`, url: '/user' },
    ];

    return (
        <div className='nav'>
            {buttons.map((item, i) => {
                return (
                    <Link to={item.url}>
                        <Button type='button' key={i}>
                            {item.text}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
};

export default NavBar;
