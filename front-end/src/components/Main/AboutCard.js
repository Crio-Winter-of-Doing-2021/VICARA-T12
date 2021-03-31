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
  },
});

export default function OutlinedCard(props) {
  const classes = useStyles();
  return (
    <Collapse in={props.checked} {...(props.checked ? { timeout: 1000 } : {})}>
        <Card className={classes.root} variant="outlined">
          <CardContent>
              <Typography variant="body1" gutterBottom>
                  body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos blanditiis tenetur
                  unde suscipit, quam beatae rerum inventore consectetur, neque doloribus, cupiditate numquam
                  dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam.
              </Typography>
          </CardContent>
        </Card>
    </Collapse>
  );
}