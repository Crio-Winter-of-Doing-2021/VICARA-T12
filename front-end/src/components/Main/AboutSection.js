import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedCard from './AboutCard';
import useWindowPosition from './useWindowPosition';
import MediaControlCard from './VideoCard';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { isMobile } from "react-device-detect";
import OutlinedCardMobile from './AboutCardMobile';
import MediaControlCardMobile from './VideoCardMobile';

const useStyles = makeStyles((theme) => ({
    main:{
        background: "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)",
    },
    root:{
       height: '100vh',
       display:  'flex',
       alignItems: 'center',
       justifyContent: 'center',
       flex: '1 1 0',
    },
    rootMobile:{
        height: '100vh',
        display:  'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    border: {
        height: '50%',
        width: 1,
        margin: 'auto',
        backgroundColor: '#ffffff',
    },
    child: {
        margin: 'auto',
        flex: '1 1 0',
    },
    title: {
        display: 'flex',
        fontSize: '4rem',
        color: '#ffffff',
        flex: '1 1 0',
        padding: '2%',
      },
}));

export default function (){
    // Window position checked for start of animation 
    const checked = useWindowPosition('loginRegister');
    const classes = useStyles();
    return(
        // Calling two card componenets an adding animation to them
        <Container maxWidth="xl" component="main"  id="about-section" className={classes.main}>
            <Typography className={classes.title} variant="h5" component="h2">
                What is Vicara's Storage Drive? 
            </Typography>
            {
                isMobile?
                <div className={classes.rootMobile}>
                    <MediaControlCardMobile />
                </div>
                :
                <div className={classes.root}>
                    <Grid item xs={12} md={5}>
                        <div className={classes.child}>
                            <OutlinedCard checked={checked} />
                        </div>
                    </Grid>
                    <div className={classes.border}></div>
                    <Grid item xs={12} md={5}>
                        <div className={classes.child}>
                            <MediaControlCard checked={checked} />
                        </div>
                    </Grid>
                </div>  
            }  
        </Container>
    )
}