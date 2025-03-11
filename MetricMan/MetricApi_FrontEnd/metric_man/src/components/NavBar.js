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
  // Function to send a command via REST API
  const openSpotify = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/commands/send-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: 'open_spotify' }),
      });
    } catch (error) {
      console.error('Error sending command:', error);
    }
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
      </div>
  );
};

export default NavBar;
