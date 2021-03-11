/* eslint-disable no-undef */
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from '../../axios';
//MaterialUI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import WelcomePage from '../Welcome/welcomePage';


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		border: 0,
		maxWidth: 'auto',
		maxHeight:'auto',
		borderRadius: 3,
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		padding: 50,
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(3),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
		background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
	}
}));

export default function Login(props) {
	const history = useHistory();
	function handleChangeInForm(event) {
		props.onChange("register");
	}

	// Declaring state using freeze to prevent change 
	const initialFormData = Object.freeze({
		email: '',
		password: '',
	});
	const [formData, updateFormData] = useState(initialFormData);
	const [open, setOpen] = useState(false);
	// Saving data typed into the state 
	const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
	};

	// Handling the submit using axious ( Post )  Base URL is hard-coded.
	const handleSubmit = (e) => {
		
		e.preventDefault();
		axiosInstance
			.post('api/auth/',{
				email: formData.email,
				password: formData.password,
			})
			.then(response => { 
				history.push("/welcome")
			})
			.catch(error => {
				// If invalid data is given, reset the state so data is cleared. 
				updateFormData({
					...formData,
					['email']: '',
					['password']: '',
				});		
			});
	};

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}></Avatar>
				<Typography component="h1" variant="h5">
					Welcome Back!
				</Typography>
                <Typography component="h4" variant="h5">
					Please enter your details.
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="email"
								label="email"
								name="email"
								autoComplete="email"
								value={formData.email}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="password"
								type="password"
								label="password"
								name="password"
								autoComplete="password"
								value={formData.password}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
					>
						Sign In
					</Button>
				</form>
				<Typography component="h7" variant="h7">
					Don't have an account? 
					<Divider orientation="vertical" flexItem />
					<Button 
					variant="contained"
					color="primary"
					className={classes.submit}
					onClick={handleChangeInForm}>
						Sign Up
					</Button>
				</Typography>
			</div>
		</Container>
	);
}