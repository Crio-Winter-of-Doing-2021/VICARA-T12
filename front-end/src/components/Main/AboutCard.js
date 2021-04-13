import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles({
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
  content: {
    flex: '1 0 auto',
  },
});

export default function OutlinedCard(props) {
  const classes = useStyles();
  return (
    <Collapse in={props.checked} {...(props.checked ? { timeout: 1000 } : {})}>
        <Card className={classes.root} variant="outlined">
          <CardContent>
              <Typography component="h3" variant="h3" className={classes.content}>
                  About Vicara
              </Typography>
              <Typography variant="body1">
                  Vicara is a cloud storage drive which utilizes AWS S3 bucket to store the files and folders with appropriate access permissions for each user. With the server deployed on Heroku,
                  Vicara's API's are always up and running with little downtime. A guide to using the storage drive along with the various features is available in the walkthrough session. 
              </Typography>
          </CardContent>
        </Card>
    </Collapse>
  );
}