import React, { useState}from 'react';
import UploadService from "../../services/upload.service";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Switch from '@material-ui/core/Switch'
import "./uploadPage.component.css";
import Dropzone from '../Dropzone/dropzone.component'



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
    appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)'
	},
  input: {
    display: 'none',
  },
    loginButton:{
        
      
    },

    AddCircleIcon:{
      background:'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
      flexGrow: 1
    }

  }));

  export default function UploadPage() {
    const classes = useStyles();
    

    return (
        <div>
      <div className={classes.root} >
        <AppBar position="static" className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Vicara Storage drive
            </Typography>
            <Button color="inherit" href="/login" className={classes.loginButton}>Login</Button>
          </Toolbar>
        </AppBar>
      </div>
      <Dropzone/>
      


     

      </div>
    );
  }
