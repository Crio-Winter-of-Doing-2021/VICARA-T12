import React, { useEffect, useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import axiosInstance from '../../axios';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import GitHubIcon from '@material-ui/icons/GitHub';

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	  },
	  title: {
		flexGrow: 1,
	  },
	  appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
	},
	displayFlex: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		margin: '1%',
	},
	avatar: {
		marginRight: '15%',
	},
	large: {
		width: theme.spacing(7),
		height: theme.spacing(7),	
	},
	displayRowInfo: {
		display: 'flex',
		flexDirection: 'row',
		margin: '1%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	socialIcons:{
		display: 'flex',
		flexDirection: 'column',
		cursor: 'pointer'
	},
	rahulLinkedInIcon:{
		
	},
}));


function Footer() {
	const classes = useStyles();
	const [ProfilePic, setProfilePic] = useState("")

	const openSocialPage = () =>{
		
	}

	useEffect(()=>{
		axiosInstance
			.get('/api/LinkedInProfileInfo')
				.then( response => {
					console.log(response.data);
					setProfilePic(response.data);
				})
	},[]);

	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar
				position="static"
				elevation={0}
				className={classes.appBar}
			>
				<Toolbar className = {classes.displayRowInfo} >
					<div className = {classes.displayFlex}>
						<div className = {classes.displayRowInfo}>
							<div className = {classes.avatar}>
								<Avatar alt="LinkedIN ProfilePic" src={ProfilePic} className={classes.large} />
							</div>
							<div className={classes.socialIcons}>
								<div  onClick={()=> window.open("https://www.linkedin.com/in/rahul-senguttuvan/", "_blank")}>
									<LinkedInIcon /> 
								</div>
								<div  onClick={()=> window.open("https://github.com/RahulSenguttuvan", "_blank")} >
									<GitHubIcon />
								</div>
							</div>
						</div>
						<div>
							<Typography variant="h6" noWrap>
								Rahul Senguttuvan
							</Typography>
						</div>
					</div>
					<div className = {classes.displayFlex}>
						<div className = {classes.displayRowInfo}>
							<div className = {classes.avatar}>
								<Avatar alt="LinkedIN ProfilePic" src={ProfilePic} className={classes.large} />
							</div>
							<div className={classes.socialIcons}>
								<div  onClick={()=> window.open("https://www.linkedin.com/in/akshaya-k-l-01410214b/", "_blank")}>
									<LinkedInIcon /> 
								</div>
								<div  onClick={()=> window.open("https://github.com/AkshayaKL", "_blank")}>
									<GitHubIcon />
								</div>
							</div>
						</div>
						<div>
							<Typography variant="h6" noWrap>
								Akshaya K L
							</Typography>
						</div>
					</div>
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}

export default Footer;