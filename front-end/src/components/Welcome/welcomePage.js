//eslint-disable-next-line
import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { fade, makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';  
import Dropzone from '../Dropzone/dropzone.component'
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import axiosInstance from '../../axios';
//import { faFolder, faFolderOpen,  faStar, faFile, faCopy } from "@fortawesome/free-solid-svg-icons";
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import { faFolder, faFolderOpen,  faStar, faFile, faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    borderBottom: `1px solid ${theme.palette.divider}`,
	  background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  drawer: {
    //background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  logout: {
    marginLeft: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  avatar: {
    marginLeft: 'auto',
  }
}));

export default function MiniDrawer(props) {
  // set loc and use info to validate user. 
  const loc = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [name, setNames] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const isMenuOpen = Boolean(anchorEl);
  const [userDetails, setUserDetails] = useState(null);
  const [id, setId]= useState(null);
  const [searchFiled, setSearchField] = useState("");
  const [openSetting, setOpenSetting] = useState(false);
  const initialSettingData = Object.freeze({
    name: '',
    password: null,
  });
  // set state for each view.
  const initalfileUpdate = Object.freeze({
    allFileUpload: true,
		recentFileUpload: false,
		starredFiles: false,
    allFolderUpload: false,
		recentFolderUpload: false,
		starredFolder: false,
    sharedFilesAndFolders: false
	});

  const [fileUpdate, setFileUpdate] = useState(initalfileUpdate);
  const [userSettingUpdate, setUserSettingUpdate] =  useState(initialSettingData);

  // set the response details of user after login for authorization.
  useEffect(() => {
    setNames(loc.state.detail.name);
    setUserDetails(loc.state.detail.size);
    setId(loc.state.detail.id);  
    
  }, [loc]);

  // Function called when side drawer is opened and closed.
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  // function called when user button is clicked on welcome page.
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logoutFunction = () => {
    // eslint-disable-next-line no-restricted-globals
    history.replace({ pathname: '/',
                  state: { detail: "" }} 
                )
  };

  // function called to change state of search bar.
  const searchFunction = (event) =>{
    setSearchField(event.target.value);
  };
  // Function called to change the view of page depending on the parameters passed. 
  const showFilesFolders = (allFiles, recentFiles, starredFiles, allFolders, recentFolders, starredFolders, sharedFilesAndFolders) =>{ 
    setFileUpdate({
      allFileUpload: allFiles,
      recentFileUpload: recentFiles,
      starredFiles: starredFiles,
      allFolderUpload: allFolders,
      recentFolderUpload: recentFolders,
      starredFolder: starredFolders,
      sharedFile: sharedFilesAndFolders
    })
    setSearchField("")
  };
  // Icon used to reload page or get back to page from within folder.
  const vicaraStorageIcon = () =>{
    window.location.reload();
  };

  const handleCloseSetting = () =>{
    setOpenSetting(false)
    setUserSettingUpdate({
      ...userSettingUpdate,
      'name': '',
      'password': '',
    });		
  }
   
  const openUserSettings = () => {
    setOpenSetting(true)
    handleMenuClose()
  };
  
  // toaster message indicating job complete. 
  toast.configure();
  // Calling toaster function.
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
          // Defining the container 
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

  const handleChange = (e) => {
    setUserSettingUpdate({
        ...userSettingUpdate,
        [e.target.name]: e.target.value.trim(),
    });
  };

  // Axios request to update the name and password of user.
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    axiosInstance
    .patch(`api/user/update/${id}` ,{
      name: userSettingUpdate.name,
      password: userSettingUpdate.password,
      email: loc.state.detail.email,
    })
    .then(response => { 
      Cookies.set('jwt', response.headers['Set-Cookie'])
      handleCloseSetting()
      setNames(userSettingUpdate.name)
    })
    .catch(error => {
      toastContainerFunction(error.response.data)
      setUserSettingUpdate({
        ...userSettingUpdate,
        'name': '',
        'password': '',
      });		
    });
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    // Defining the drop down list for profile click
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={openUserSettings}>Settings</MenuItem>
      <MenuItem onClick={logoutFunction}>Logout</MenuItem>
    </Menu>
  );

  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        // clsx is used to apply multiple classes with conditions
        className={clsx(classes.appBar, {
            // Appbar shift class will be added only when open property is set to true 
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
                 // Icon will be invisible when open property is set to true 
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <div onClick = {vicaraStorageIcon}>
            <Typography variant="h6" style={{cursor: 'pointer'}} noWrap>
                  Vicara Storage drive 
            </Typography>
          </div>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              value={searchFiled}
              onChange={searchFunction}
            />
          </div>
          <div className={classes.logout}>
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Typography>{name}</Typography>
              <AccountCircle />
            </IconButton>
            {renderMenu}
            {/* Dialogue box for updating user detials */}
            <Dialog open={openSetting} onClose={handleCloseSetting} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">
                <Typography> Update {name}'s Details</Typography>
              </DialogTitle>  
              <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="name"
                    label="Rest Name"
                    name="name"
                    autoComplete="name"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="password"
                    label="Reset Password"
                    name="password"
                    autoComplete="password"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseSetting} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleProfileUpdate} color="primary">
                  Update
                </Button>
              </DialogActions>
            </Dialog>
          </div>        
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          {/* Change in left and right motion when clicked  */}
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        {/* Font awesome icons used for indicating change in view by colour */}
        <List>
          {/* Sending boolean value to function to indicate all files view  */}
          <ListItem button onClick={ () => showFilesFolders(true, false, false, false, false, false)}>
              <ListItemIcon>
                { 
                  fileUpdate.allFileUpload &&
                    <FontAwesomeIcon icon={faFile} size="2x" style={ {color:"orange" } }  />
                } 
                {
                  !fileUpdate.allFileUpload &&
                    <FontAwesomeIcon icon={faFile} size="2x"/> 
                }
              </ListItemIcon>
            <ListItemText> All Files </ ListItemText>
          </ListItem>
          {/* Sending boolean value to function to indicate Recent files view  */}
          <ListItem button onClick={ () => showFilesFolders(false, true, false, false, false, false)}>
            <ListItemIcon>
              {
                fileUpdate.recentFileUpload &&
                  <FontAwesomeIcon icon={faCopy} size="2x" style={ {color:"orange" } } />
              } 
              {
                !fileUpdate.recentFileUpload &&
                  <FontAwesomeIcon icon={faCopy} size="2x" /> 
              }
            </ListItemIcon>
            <ListItemText> Recent Files </ListItemText>
          </ListItem>
          {/* Sending boolean value to function to indicate Starred files view  */}
          <ListItem button onClick={ () => showFilesFolders(false, false, true, false, false, false)}>
            <ListItemIcon>
              {
                fileUpdate.starredFiles &&
                <FontAwesomeIcon icon={faStar} size="2x" style={ {color:"orange" } } />
              } 
              {
                !fileUpdate.starredFiles &&
                  <FontAwesomeIcon icon={faStar} size="2x" />
              } 
            </ListItemIcon>
            <ListItemText> Starred Files </ListItemText>
          </ListItem>
        </List>
        <Divider />
        <List>
          {/* Sending boolean value to function to indicate all folder view  */}
          <ListItem button onClick={ () => showFilesFolders(false, false, false, true, false, false)} >
            <ListItemIcon>
            {
              fileUpdate.allFolderUpload &&
                <FontAwesomeIcon icon={faFolder} size="2x" style={ {color:"orange" } } />
            } 
            {
              !fileUpdate.allFolderUpload &&
                <FontAwesomeIcon icon={faFolder} size="2x" />
            } 
            </ListItemIcon>
            <ListItemText> All Folders </ ListItemText>
          </ListItem>
          {/* Sending boolean value to function to indicate recent folders view  */}
          <ListItem button onClick={ () => showFilesFolders(false, false, false, false, true, false)} >
            <ListItemIcon> 	
            {
              fileUpdate.recentFolderUpload &&
                <FontAwesomeIcon icon={faFolderOpen} size="2x" style={ {color:"orange" } } />
            } 
            {
              !fileUpdate.recentFolderUpload &&
                <FontAwesomeIcon icon={faFolderOpen} size="2x" />
            } 
            </ListItemIcon>
            <ListItemText> Recent Folders </ListItemText>
          </ListItem>
          {/* Sending boolean value to function to indicate starred folders view  */}
          <ListItem button onClick={ () => showFilesFolders(false, false, false, false, false, true)} >
            <ListItemIcon> 
            {
              fileUpdate.starredFolder &&
                < FontAwesomeIcon icon={faStar} size="2x" style={ {color:"orange" } } />
            } 
            {
              !fileUpdate.starredFolder &&
                < FontAwesomeIcon icon={faStar} size="2x" />
            } 
            </ListItemIcon>
            <ListItemText> Starred Folders</ListItemText>
          </ListItem>
          </List>
          <Divider/>
          <Divider/>
          {/* View to see files and folders shared with you  */}
          <List>
            <ListItem button onClick={ () => showFilesFolders(false, false, false, false, false, false, true)}>
              <ListItemIcon>
                {
                  fileUpdate.sharedFile&&
                    <IconButton style={ {color:"orange" } } size="2x">
                      <FolderSharedIcon/>
                    </IconButton>
                } 
                {
                  !fileUpdate.sharedFile &&
                  <IconButton size="medium">
                  <FolderSharedIcon/>
                </IconButton>
                } 
              </ListItemIcon>
              <ListItemText> Shared </ ListItemText>
            </ListItem>
      </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* Calling dropzone component to enable drag and drop and card features in every view in welcome page */}
        <Route 
          render={()=>{
            return <Dropzone size={userDetails} id={id} name={name} searchFiled = {searchFiled} allFileUpload = {fileUpdate.allFileUpload} recentFileUpload = {fileUpdate.recentFileUpload} starredFiles = {fileUpdate.starredFiles}  allFolderUpload = {fileUpdate.allFolderUpload} recentFolderUpload = {fileUpdate.recentFolderUpload} starredFolder={fileUpdate.starredFolder} sharedFilesAndFolders={fileUpdate.sharedFile}/> 
          }}
          > 
        </Route>
      </main>
    </div>
  );
}

