import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    margin: '3%',
  },
  bottom: {
    color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  top: {
    color: '#000000',
    animationDuration: '550ms',
    position: 'absolute',
    left: 0,
  },
  circle: {
    strokeLinecap: 'round',
  },
}));

export default function LoadCircularProgress() {
    
const classes = useStyles();
  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={20}
        thickness={4}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={20}
        thickness={4}
      />
    </div>
  );
}
