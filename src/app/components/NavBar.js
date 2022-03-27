import React from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

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
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='fixed' className='nav'>
                <Toolbar>
                    <IconButton
                        size='large'
                        edge='start'
                        color='inherit'
                        aria-label='menu'
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {buttons.map((item, i) => (
                        <Button href={item.url} style={{ color: 'white' }}>
                            {item.text}
                        </Button>
                    ))}
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default NavBar;
