import {React} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import useWindowPosition from './useWindowPosition';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { Collapse } from '@material-ui/core';
import Button from '@material-ui/core/Button';

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
    submit: {
		margin: theme.spacing(3, 0, 2),
		background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
        maxWidth: '10vw',
		maxHeight:'25vh',
	}
}));

export default function (){
    const checked = useWindowPosition('AboutSection');
    const classes = useStyles();

    const handleSubmit = () => {
        const url = "https://vicara-storage-drive.herokuapp.com/doc/"
        window.open(url,'_blank')
    }

    return(
        <div className={classes.root}>
            <Collapse in={checked} {...(checked ? { timeout: 1000 } : {})}>
                <Card className={classes.Cardborder} variant="outlined">
                    <CardContent>
                        <Typography className={classes.title} variant="h5" component="h2">
                            Swagger for Custom Frontend Integration
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            Easily integrate our backend API's to your preferred front-end of choice. Below, we have, in our Swagger documentation, the backend API's and their functionality.
                        </Typography>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit}
					    >
						    Swagger
					    </Button>
                        <Typography variant="body1" gutterBottom>
                            If you're interested in using our API's for your front-end of choice, then please request for your domain to be added in our servers allowed hosts. We will reply to your mail in 24 hours.
                        </Typography>
                    </CardContent>
                </Card>
            </Collapse>
        </div>      
    )
}