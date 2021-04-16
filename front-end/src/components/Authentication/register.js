/* eslint-disable no-undef */
import React, { useState } from 'react';
import axiosInstance from '../../axios';
//MaterialUI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Box } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import clsx from 'clsx';

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
	},
	margin: {
		margin: theme.spacing(1),
	},
	textField: {
	width: '25ch',
	},
}));

export default function Register(props) {

	function handleChangeInForm(event) {
		props.onChange("login");
	}
    // Declaring state using freeze to prevent change 
	const initialFormData = Object.freeze({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		snackState: '',
	});
	const [formData, updateFormData] = useState(initialFormData);
	const [ hidePassword, setShowHidePassword ] = useState(true);
	// Saving data typed into the state 
	const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
	};

	// toaster message indicating job complete. 	
	toast.configure();
	function toastContainerFunction(errorMessage) {
		toast.error(errorMessage, {
		position: "top-center",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		});
    	return (
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            />
      	);
  	}
	// Handling the submit using axious ( Post )  Base URL is hard-coded.
	const handleSubmit = (e) => {
		e.preventDefault();
		axiosInstance
			.post('api/user/register/',{
				name: formData.name,
				email: formData.email,
				password: formData.password,
				confirmPassword: formData.confirmPassword,
			})
			.then( () => { 
				window.location.reload();
			})
			.catch(error => {
				// If invalid data is given, reset the state so data is cleared. 
				toastContainerFunction(error.response.data)
				updateFormData({
					...formData,
					'name': '',
					'email': '',
					'password': '',
					'confirmPassword': '',
				});		
			});
	};
	
	const handleClickShowPassword = () => {
		setShowHidePassword(!hidePassword)
	}

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	}

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<Box className={classes.paper} borderColor="primary.main">
				<Avatar className={classes.avatar}></Avatar>
				<Typography component="h1" variant="h5">
					Create an Account
				</Typography>
                <Typography component="h4" variant="h5">
					Please fill up your details
				</Typography>
				<form className={classes.form} noValidate>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
									color='white'
									variant="outlined"
									required
									fullWidth
									id="name"
									label="name"
									name="name"
									autoComplete="name"
									value={formData.name}
									onChange={handleChange}
								/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								color='white'
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
							<OutlinedInput
								variant="outlined"
								required
								fullWidth
								id="password"
								label="password"
								type= { hidePassword ? "password" : "text" }
								name="password"
								autoComplete="password"
								value={formData.password}
								onChange={handleChange}	
								endAdornment={
									<InputAdornment position="end">
									  <IconButton
										aria-label="toggle password visibility"
										onClick={handleClickShowPassword}
										onMouseDown={handleMouseDownPassword}
										edge="end"
									  >
										{hidePassword ?<VisibilityOff />: <Visibility />}
									  </IconButton>
									</InputAdornment>
								  }
							/>
						</Grid>
                        <Grid item xs={12}>
							<FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
								<InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
								<OutlinedInput
									required
									fullWidth
									id="confirmPassword"
									type= { hidePassword ? "password" : "text" }
									name="confirmPassword"
									autoComplete="confirm Password"
									value={formData.confirmPassword}
									onChange={handleChange}
									endAdornment={
										<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											onMouseDown={handleMouseDownPassword}
											edge="end"
										>
											{hidePassword ?<VisibilityOff />: <Visibility />}
										</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
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
						Sign Up
					</Button>
				</form>
                <Typography component="h6" variant="h6">
					<div onClick={handleChangeInForm} style={{cursor: 'pointer'}}>
						Have an account? Sign In					
					</div>
				</Typography>
			</Box>
		</Container>
	);
}