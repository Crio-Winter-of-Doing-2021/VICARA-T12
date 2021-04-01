import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	  },
	swaggerButton: {
		marginLeft: theme.spacing(2),
	  },
	  title: {
		flexGrow: 1,
	  },
	appBar: {
		borderBottom: `1px solid ${theme.palette.divider}`,
		background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)'
	},
}));
// // Swagger redirect 
// const routeChange = () =>{ 
//     const url = "https://rahulsenguttuvan-xmeme-app.herokuapp.com/swagger-ui/";
// 	window.open(url,'_blank');
//   }

function Header() {
	const classes = useStyles();
	const history = useHistory();
	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar
				position="static"
				elevation={0}
				className={classes.appBar}
			>
				<Toolbar>
					<Typography  onClick={()=>{history.goBack()}}variant="h6" color="inherit" style={{cursor: 'pointer'}} noWrap>
						Vicara Storage Drive
					</Typography>
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}

export default Header;