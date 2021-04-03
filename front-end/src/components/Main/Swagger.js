import {React} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useWindowPosition from './useWindowPosition';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root:{
       height: '100vh',
       display:  'flex',
       alignItems: 'center',
       justifyContent: 'center',
    },
    Cardborder: {
        maxWidth: 'auto',
		maxHeight:'auto',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        padding: 50,
        margin: '10%',
    },
}));

export default function (){
    const checked = useWindowPosition('AboutSection');
    const classes = useStyles();
    return(
        <div className={classes.root}>
            <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
                <Card className={classes.Cardborder} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} variant="h5" component="h2">
                            Custom Frontend Integration
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Easily integrate our backend api's to your preferred front-end of choice. Below, we have listed our backend API's and their functionality. 
                        </Typography>
                    </CardContent>
                </Card>
            </Collapse>
        </div>      
    )
}