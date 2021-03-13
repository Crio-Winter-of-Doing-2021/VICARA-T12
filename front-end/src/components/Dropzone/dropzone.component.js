import React,{ useState, useRef, useEffect}from 'react';
import UploadService from "../../services/upload.service";
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline';
import MenuIcon from '@material-ui/icons/Menu';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Switch from '@material-ui/core/Switch'
import uploadService from '../../services/upload.service';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';

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
		textAlign: 'left',
	},
	formText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '12px',
		textAlign: 'left',
		marginBottom: theme.spacing(2),
	},
}));

export default function Dropzone(props){
  const classes = useStyles();
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

  const removeFile=(fileName)=>{
      const selectedFileIndex=selectedFiles.findIndex(e=>e.name==fileName);
      selectedFiles.splice(selectedFileIndex,1);
      setSelectedFiles([...selectedFiles]);
  }
  const [filesinDB, setfilesinDB]=useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [validFiles, setValidFiles] = useState([]); 
  const [userDetails, setUserDetails] = useState({});
  const [files, setFiles]= useState({});
  const [visiblity, setVisiblity] = useState({
    visibleFilesUpload: true,
    //invisibleFilesUpload: false
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
    setVisiblity({ [event.target.name]: event.target.checked })
  };

  const handleFiles = (files) => {  
    for(let i = 0; i < files.length; i++){       
        setSelectedFiles(prevArray => [...prevArray, files[i]]);
        uploadFiles(files[i]);
    }    
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const uploadFiles = (file) => {
   UploadService.upload(file, [userDetails]);
  }
 
  const fileType = (fileName) => {
    return fileName.substring(fileName.lastIndexOf('.') + 1, fileName.length) || fileName;
  }

  

  useEffect(()=>{ 
    setUserDetails(props.id);
  },[props]);

  useEffect(()=>{
   getFiles()}
  ,[]);

  const getFiles=()=>{

    UploadService.getFiles({userDetails}).then((response)=>{
       

      setfilesinDB(response.data);
      console.log(filesinDB);
      
   });

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
          <IconButton size="medium" onClick={handleClickListItem}>
            <AddCircleIcon/>
            Upload
          </IconButton>
          <Typography><span hidden={!visiblity.visibleFilesUpload}>Don't </span>See Imported Files</Typography>
          <Switch
            checked={visiblity.visibleFilesUpload}
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
                multiple
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
          <div className="file-display-container" hidden={!visiblity.visibleFilesUpload}>
          {<div>
    {filesinDB.map((filedata, index) => (
        <p>this is the id {filedata["_id"]}  and this is the key {filedata["s3_key"]}!</p>
    ))}
    </div>}
            {
             

              <div container spacing={5} alignItems="center">
                
                {filesinDB.map((filedata, i) => {
                  
                  <Grid item key={i} xs={12} md={4}>
                    <Card className={classes.card}>
                      <CardContent className={classes.cardContent}>
                        <Typography
                          gutterBottom
                          variant="h5"
                          component="h2"
                          //className={classes.formTitle}
                         
                        >
                      
                      {filedata["_id"]}
                        </Typography>
                        <div className={classes.formText}>
                          <Typography
                            component="h6"
                            color="textPrimary"
                          ></Typography>
                          <Typography variant="h6" color="textSecondary">
                          {/* Limitting the length of char input  */}
                          {filedata["s3_key"]}
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                })}
              </div>

            }
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