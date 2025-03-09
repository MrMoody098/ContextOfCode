import React from 'react';
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
              <Link to="/latest" className={classes.link}>Latest</Link>
            </Button>
            <Button color="inherit">
              <Link to="/all" className={classes.link}>All</Link>
            </Button>
            <Button color="inherit">
              <Link to="/visualize" className={classes.link}>Visualize</Link>
            </Button>
          </Toolbar>
        </AppBar>
      </div>
  );
};

export default NavBar;