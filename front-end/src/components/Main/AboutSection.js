import {React, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedCard from './AboutCard';
import useWindowPosition from './useWindowPosition';
import MediaControlCard from './VideoCard';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
    root:{
       height: '100vh',
       display:  'flex',
       alignItems: 'center',
       justifyContent: 'center',
       padding:'10%',
       flexGrow: 1,
    },
    border: {
        height: '50%',
        width: 1,
        margin: 'auto',
        backgroundColor: '#909090',
    },
    child: {
        margin: 'auto',
    },
}));

export default function (){
    const checked = useWindowPosition('loginRegister');
    const classes = useStyles();
    return(
        <Container maxWidth="xl" component="main">
            <Grid container spacing={5} alignItems="center">
                <div className={classes.root} id="about-section">
                    <Grid xs={12} md={5}>
                        <div className={classes.child}>
                            <OutlinedCard checked={checked} />
                        </div>
                    </Grid>
                    <div className={classes.border}></div>
                    <Grid xs={12} md={5}>
                        <div className={classes.child}>
                            <MediaControlCard checked={checked} />
                        </div>
                    </Grid>
                </div>  
            </Grid> 
        </Container>
    )
}