import React,{ useState, useRef}from 'react';
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
import "../Upload/uploadPage.component.css";
 
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
  const options = [
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
    
    for(let i = 0; i < files.length; i++)
    {
        
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
    
    maxWidth="lg" className="dropContainer">
      <Typography onDragOver={dragOver}
    onDragEnter={dragEnter}
    onDragLeave={dragLeave}
    onDrop={fileDrop}
    component="div" style={{ top:'10vh', height: '100vh' }}>
    
      
    
    <List component="nav">
        <ListItem
          button
          aria-haspopup="true"
             
          onClick={handleClickListItem}
        >
          
          <label htmlFor="icon-button-file" onClick="">
        <IconButton size="small" color="" aria-label="upload" component="span" height="100%">
          <AddCircleIcon/>
          <span >Select</span>
        </IconButton>
        
      </label> 
      
      </ListItem>
      </List>
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
        {options.map((option) => (
          <MenuItem key={option} selected={option === 'Upload File'} onClick={handleClose}>
           <Button
          variant="contained"
             component="label"
           >
{option}
  <input
    type="file"
    className="file-input"
    
    hidden
    onChange={(e) => handleFiles(e.target.files)}
  />
</Button>
          </MenuItem>
        ))}
        
      </Menu>

      
      <div className="file-display-container" hidden={!state.visibleFilesUpload}>
    {
        selectedFiles.map((data, i) => 
            <div className="file-status-bar" key={i}>
                <div>
                    <div className="file-type-logo"><div className="file-type">{fileType(data.name)}</div></div>
                    
                    <span className={`file-name ${data.invalid ? 'file-error' : ''}`}>{data.name}</span>
                    <span className="file-size">({fileSize(data.size)})</span> {data.invalid && <span className='file-error-message'>({errorMessage})</span>}
                </div>
                <div className="file-remove" onClick={()=>removeFile(data.name)}>X</div>
            </div>
        )
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