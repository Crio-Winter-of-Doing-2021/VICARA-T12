import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import { Collapse } from '@material-ui/core';
import VideoCard from '../images/Crio_demo.mp4';

const useStyles = makeStyles((theme) => ({
root: {
    minWidth: '25vw',
    maxWidth:'50vw',
    minHeight: '25vh',
    maxHeight: '50vh',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    padding: 50,
    flex: '1 1 0',
    overflowY: 'auto', 
},
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
}));

export default function MediaControlCard({checked}) {
  const classes = useStyles();
  return (
    // Collapse property used for animation 
    <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
        <Card className={classes.root}>
        <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography component="h4" variant="h4">
                  Video Walkthrough
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                  Storage Drive Usage
              </Typography>
            </CardContent>
            <CardMedia
                component="video"
                image = {VideoCard}
                controls
            />
        </div>
        </Card>
    </Collapse>
  );
}