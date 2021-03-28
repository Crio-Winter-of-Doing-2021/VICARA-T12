import {React, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedCard from './AboutCard';
import useWindowPosition from './useWindowPosition';
import MediaControlCard from './VideoCard';

const useStyles = makeStyles((theme) => ({
    root:{
       height: '100vh',
       display:  'flex',
       alignItems: 'center',
       justifyContent: 'center',
    },
    border: {
        height: '50%',
        width: 1,
        backgroundColor: '#909090',
        margin: '10%',
    },
}));

export default function (){
    const checked = useWindowPosition('loginRegister');
    const classes = useStyles();
    return(
        <div className={classes.root} id="about-section">
            <OutlinedCard checked={checked} />
            <div className={classes.border}></div>
            <MediaControlCard checked={checked} />
        </div>     
    )
}