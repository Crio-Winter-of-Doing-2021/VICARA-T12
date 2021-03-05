import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';

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
	},
    teamName: {
        position: 'relative',
        marginLeft: 0,
    },
}));
// // Swagger redirect 
// const routeChange = () =>{ 
//     const url = "https://rahulsenguttuvan-xmeme-app.herokuapp.com/swagger-ui/";
// 	window.open(url,'_blank');
//   }

function Header() {
	const classes = useStyles();
	return (
		<React.Fragment>
			<CssBaseline />
			<AppBar
				position="static"
				elevation={0}
				className={classes.appBar}
			>
				<Toolbar>
					<Typography variant="h6" color="inherit" noWrap className={classes.teamName}>
						Team Vicara
					</Typography>
				</Toolbar>
			</AppBar>
		</React.Fragment>
	);
}

export default Header;