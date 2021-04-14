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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
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
	// Setting state hook for dialogue box actions.
	const [openSetting, setOpenSetting] = useState(false);
	const [forgotEmail, setForgotEmail] = useState("");
	function handleChangeInForm(event) {
		props.onChange("register");
	}

	// Declaring state using freeze to prevent change 
	const initialFormData = Object.freeze({
		email: '',
		password: '',
	});
	const [formData, updateFormData] = useState(initialFormData);
	// Saving data typed into the state 
	const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
	};
	// Setting state of email 
	const handleChangeForgotEmail = (e) => {
        setForgotEmail(e.target.value.trim());
	};

	const handleForgotPassword = () => {
		setOpenSetting(true)
	}

	const handleCloseSetting = () =>{
		setOpenSetting(false)
		setForgotEmail("")
	}

	// Sending request to mail service in backend.
	const submitForgotPassword = (e) =>{
		e.preventDefault();
		axiosInstance
			.post('api/user/sendMail/',{
				email: forgotEmail
			})
			.then(response => { 
				Cookies.set('jwt', response.headers['Set-Cookie'])
				setOpenSetting(false)
			})
			.catch(error => {
				// If invalid data is given, reset the state so data is cleared. 
				toastContainerFunction(error.response.data)
				setOpenSetting(false)
			});
			setOpenSetting(false)
	}

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
			.post('api/user/login/',{
				email: formData.email,
				password: formData.password,
			})
			.then(response => { 
				Cookies.set('jwt', response.headers['Set-Cookie'])
				history.push({ pathname: '/welcome',
			    				state: { detail: response.data }}) 
				
			})
			.catch(error => {
				// If invalid data is given, reset the state so data is cleared. 
				toastContainerFunction(error.response.data)
				updateFormData({
					...formData,
					'email': '',
					'password': '',
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
				<Typography component="h6" variant="h6">
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
				<div onClick={handleForgotPassword}>
					<Typography component="h6" variant="h6" color="textSecondary" style={{cursor: 'pointer'}}>
						Forgot Password?
					</Typography>
				</div>
				<div>
					<Dialog open={openSetting} onClose={handleCloseSetting} aria-labelledby="form-dialog-title">
						<DialogTitle id="form-dialog-title">
						<Typography> Enter Email for Password Reset Link</Typography>
						</DialogTitle>  
						<DialogContent>
						<Grid container spacing={2}>
							<Grid item xs={12}>
							<TextField
								variant="outlined"
								required
								fullWidth
								id="forgotEmail"
								label="Enter Email"
								name="forgotEmail"
								autoComplete="Enter Email ID"
								onChange={handleChangeForgotEmail}
							/>
							</Grid>
						</Grid>
						</DialogContent>
						<DialogActions>
							<Button onClick={handleCloseSetting} color="primary">
								Cancel
							</Button>
							<Button onClick={submitForgotPassword} color="primary">
								Submit
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			</div>
		</Container>
	);
}