import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

const NavBar = () => {
  const classes = useStyles();
  const [status, setStatus] = useState('');

  // Function to connect to WebSocket and open Spotify
  const openSpotify = () => {
    const socket = new WebSocket('ws://localhost:5000');
    socket.onopen = () => {
      console.log('WebSocket connection established');
      socket.send('open_spotify');
    };
    socket.onmessage = (event) => {
      setStatus(event.data);
    };
    socket.onerror = (error) => {
      console.log('WebSocket error: ', error);
    };
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  };

  return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Metric Dashboard
            </Typography>
            <Button color="inherit">
              <Link to="/Latest" className={classes.link}>Latest</Link>
            </Button>
            <Button color="inherit">
              <Link to="/all" className={classes.link}>All</Link>
            </Button>
            <Button color="inherit">
              <Link to="/visualize" className={classes.link}>Visualize</Link>
            </Button>
            <Button color="inherit" onClick={openSpotify}>
              Open Spotify
            </Button>
          </Toolbar>
        </AppBar>
        {status && <div>{status}</div>}
      </div>
  );
};

export default NavBar;
