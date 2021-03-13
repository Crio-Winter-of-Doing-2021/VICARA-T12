import React,{ useState, useRef}from 'react';
import UploadService from "../../services/upload.service";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Switch from '@material-ui/core/Switch'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import StarIcon from '@material-ui/icons/Star';
import CardHeader from '@material-ui/core/CardHeader';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9,
	},
	link: {
		margin: theme.spacing(1, 1.5),
	},
	cardHeader: {
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[200]
				: theme.palette.grey[700],
	},
	formTitle: {
		fontSize: '16px',
		textAlign: 'center',
	},
	formText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '12px',
		textAlign: 'left',
		marginBottom: theme.spacing(2),
	},
  downloadButton: {
    display: 'flex',
		marginLeft: 'auto',
  },
}));


export default function Dropzone(){
  const dragOver=(e)=>{
    e.preventDefault();
  }
  const dragEnter=(e)=>{
    e.preventDefault();
  }
  const dragLeave=(e)=>{
    e.preventDefault();
  }
  const fileDrop=(e)=>{
    e.preventDefault();
    const files= e.dataTransfer.files;
    handleFiles(files);
  }
  const classes = useStyles();
  const removeFile=(fileName)=>{
      const selectedFileIndex=selectedFiles.findIndex(e=>e.name==fileName);
      selectedFiles.splice(selectedFileIndex,1);
      setSelectedFiles([...selectedFiles]);
  }

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [validFiles, setValidFiles] = useState([]); 
  const [state, setState] = React.useState({
    visibleFilesUpload: true,
    invisibleFilesUpload: true
  });
  const option = [
    'Choose File',
    'Choose Folder'
  ];
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const uploadModalRef = useRef();
  const uploadRef = useRef();
  const progressRef = useRef();
  const closeUploadModal = () => {
      //uploadModalRef.current.style.display = 'none';
  }
  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked })
  };

  const handleFiles = (files) => {  
    for(let i = 0; i < files.length; i++){       
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
    }
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const uploadFiles = () => {
    //uploadModalRef.current.style.display = 'block';
    //uploadRef.current.innerHTML = 'File(s) Uploading...';
    
    //setSelectedFiles([...selectedFiles]); 
  }

  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  const fileSize = (size) => {
      if (size === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = Math.floor(Math.log(size) / Math.log(k));
      return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  } 

  return (
    <React.Fragment>
      <CssBaseline />
      <Container 
        maxWidth="lg" className="dropContainer"
      >
        <Typography 
          onDragOver={dragOver}
          onDragEnter={dragEnter}
          onDragLeave={dragLeave}
          onDrop={fileDrop}
          component="div" style={{ top:'10vh', height: '100vh' }}
        >
          <IconButton size="medium" color="inherit" variant="contained" onClick={handleClickListItem} >
            <CloudUploadIcon/>
            Upload
          </IconButton>
          <Typography><span hidden={!state.visibleFilesUpload}>Don't </span>See Imported Files</Typography>
          <Switch
            checked={state.visibleFilesUpload}
            onChange={handleChange}
            name="visibleFilesUpload"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
          <Menu
            id="lock-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >   
            <MenuItem key={option} selected={option === 'Choose File'} onClick={handleClose}>
              <Button
              variant="contained"
              component="label"
              >
                Choose File
                <input
                  type="file"
                  className="file-input"
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </Button>
              <Button
                variant="contained"
                component="label"
              >
                Choose Folder
                <input
                  type="file"
                  className="file-input"
                  multiple
                  hidden
                  webkitdirectory mozdirectory msdirectory odirectory directory
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </Button>
            </MenuItem>
          </Menu>
          <div className="file-display-container" hidden={!state.visibleFilesUpload}>
          <Grid container spacing={5} alignItems="center">
            {
              selectedFiles.map((data, i) => 
              <Grid item key={data.id} xs={12} md={3}>
              <Card className={classes.card}>
                <CardHeader
                  action={
                    <IconButton aria-label="Delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                  title="Shrimp and Chorizo Paella"
                  subheader="September 14, 2016"
                />
                <CardContent className={classes.cardContent}>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    className={classes.formTitle}
                    color="textPrimary"
                  >
                  {/* Limitting the length of char input  */}
                  {data.name.substr(0, 10)}...
                  </Typography>
                  <div className={classes.formText}>
                    <Typography
                      component="h6"
                      color="textSecondary"
                    >
                      {fileType(data.name)}
                    </Typography>
                  </div>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <StarIcon />
                  </IconButton>
                  <div className={classes.downloadButton}>
                    <IconButton aria-label="download">
                      <CloudDownloadIcon />
                    </IconButton>
                  </div>
              </CardActions>
              </Card>
            </Grid>
              )
            }
          </ Grid>
          </div>
          <div className="upload-modal" ref={uploadModalRef}>
              <div className="overlay"></div>
              <div className="close" onClick={(() => closeUploadModal())}></div>
              <div className="progress-container">
                  <span ref={uploadRef}></span>
                  <div className="progress">
                      <div className="progress-bar" ref={progressRef}></div>
                  </div>
              </div>
          </div>
        </Typography>
      </Container>
    </React.Fragment> 
  );  
}