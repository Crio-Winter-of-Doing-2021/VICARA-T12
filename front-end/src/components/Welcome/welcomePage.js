//eslint-disable-next-line

import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation, Link } from 'react-router-dom';
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
//import { faFolder, faFolderOpen,  faStar, faFile, faCopy } from "@fortawesome/free-solid-svg-icons";
import { faFolder, faFolderOpen,  faStar, faFile, faCopy } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
}));

export default function MiniDrawer(props) {
  const loc = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [name, setNames] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [userDetails, setUserDetails] = useState(null);
  const [accessKey, setAccessKey] = useState(null);
  const [id, setId]= useState(null);
  const [searchFiled, setSearchField] = useState("");
  const initalfileUpdate = Object.freeze({
    allFileUpload: true,
		recentFileUpload: false,
		starredFiles: false,
    allFolderUpload: false,
		recentFolderUpload: false,
		starredFolder: false,
	});

  const [fileUpdate, setFileUpdate] = useState(initalfileUpdate);


   useEffect(() => {
      setAccessKey(loc.state.detail.accessToken);
      setNames(loc.state.detail.name);
      setUserDetails(loc.state.detail);
      setId(loc.state.detail.id);  
      console.log(loc.state.detail)
   }, [loc]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const logoutFunction = () => {
    // eslint-disable-next-line no-restricted-globals
    history.replace({ pathname: '/',
                  state: { detail: "" }} 
                )
  };

  const searchFunction = (event) =>{
    setSearchField(event.target.value);
  };
  
  const showFilesFolders = (allFiles, recentFiles, starredFiles, allFolders, recentFolders, starredFolders) =>{ 
    setFileUpdate({
      allFileUpload: allFiles,
      recentFileUpload: recentFiles,
      starredFiles: starredFiles,
      allFolderUpload: allFolders,
      recentFolderUpload: recentFolders,
      starredFolder: starredFolders,
    })
    setSearchField("")
  };

   const vicaraStorageIcon = () =>{
    window.location.reload();
   };
  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
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
            <Typography variant="h6" noWrap>
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
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
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
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route 
        render={()=>{
          
          return <Dropzone id={id} name={name} accessKey={loc.state.detail.accessToken} searchFiled = {searchFiled} allFileUpload = {fileUpdate.allFileUpload} recentFileUpload = {fileUpdate.recentFileUpload} starredFiles = {fileUpdate.starredFiles}  allFolderUpload = {fileUpdate.allFolderUpload} recentFolderUpload = {fileUpdate.recentFolderUpload} starredFolder={fileUpdate.starredFolder} />
         
        }}

          > 
          </Route>
       
      </main>
    </div>
  );
}

