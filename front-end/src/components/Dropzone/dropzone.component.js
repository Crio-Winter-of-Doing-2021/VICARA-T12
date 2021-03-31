import React,{ useState, useRef, useEffect}from 'react';
import FileService from "../../services/file.service";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import FolderIcon from '../images/folder.png'
import TextFileImage from '../images/textFileImage.png'
import StarIcon from '@material-ui/icons/Star';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LoadCircularProgress from '../Main/circularProgress';
import fileService from '../../services/file.service';
import { ToastContainer, toast } from 'react-toastify';
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';


import ShareIcon from '@material-ui/icons/Share';
import Folderview from '../FolderView/folderview.component'


import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import 'react-toastify/dist/ReactToastify.css';
import './dropzone.component.css'
import { useHistory, Link} from "react-router-dom"
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
  download: {
    display: 'flex',
    marginLeft : "auto",
  },
  encapculate:{
    display: 'flex',
  },
  button: {
    marginLeft : "auto",
    color: "#F8F8FF",
    background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(236,46,4,1) 100%, rgba(6,223,240,1) 100%)',
    margin: theme.spacing(3, 0, 2),
  },
  heading: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: green[500],
    },
    secondary: {
      main: '#b23c17',
    },
  },
});

export default function Dropzone(props){
  const history = useHistory();
  const classes = useStyles();

  // Set Map, still in progress for card.
  const fileImageMap = new Map();
  fileImageMap.set("pdf","https://is4-ssl.mzstatic.com/image/thumb/Purple124/v4/2b/2b/e1/2b2be10d-870f-c4cd-68b6-f3d5204c22b4/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/1200x630wa.png");
  fileImageMap.set("xlsx","https://www.slashgear.com/wp-content/uploads/2019/03/excel_main-1280x720.jpg")
  fileImageMap.set("xls","https://www.slashgear.com/wp-content/uploads/2019/03/excel_main-1280x720.jpg")
  fileImageMap.set("txt",TextFileImage)
  fileImageMap.set("doc","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlVzH8dGd3fPl9dWjM9r3vX6iVZvFJekYU5PRku3wdbqAa8txFBjucY5yBprgiI84CpY&usqp=CAU  ")
  fileImageMap.set("docx","https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXlVzH8dGd3fPl9dWjM9r3vX6iVZvFJekYU5PRku3wdbqAa8txFBjucY5yBprgiI84CpY&usqp=CAU  ")
  fileImageMap.set("png","https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png")
  fileImageMap.set("jpg","https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png")
  fileImageMap.set("presso","https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png")
  fileImageMap.set("mp4", "https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png")
  
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
    if(files.length===1)
    handleFiles(files);
    else
    console.log(files);
  }

  const [foldersinDB, setfoldersinDB]=useState([]);
  const [filesinDB, setfilesinDB]=useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [userName, setUserName] = useState({});
  const [isloading, setLoading] = useState(false);
  const [jwtToken, setjwtToken] = useState("");
  const [openRenameForm, setopenRenameForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [oldname,setoldName] = useState("");
  const [filetobeRenamed, setFileToBeRenamed]=useState("");
  const [type, setType] = useState("")
  const [openShareForm, setOpenShareForm] = useState(false);
  const [mailshared, setmailshared]= useState("");
  const [fileToBeShared, setfileToBeShared] = useState("")
  
  const handleRenameOpen = (typeProperty, id, name) => {
    setoldName(name);
    setFileToBeRenamed(id);
    setopenRenameForm(true);
   setType(typeProperty)
  };

  const handleRenameClose = () => {
    setopenRenameForm(false);
    setoldName("");
    setNewName("");
  };

  const handleRename =()=>{
    alert(newName);
    alert(filetobeRenamed);
    alert(type);
    
    if(type=="file"&&newName.length&&newName.length<=20)
    {FileService.renameFile(filetobeRenamed, newName.concat('.').concat((oldname.split('.').pop())?oldname.split('.').pop():''), props.id).then((docs)=>{
      let foundIndex = filesinDB.findIndex((fileinDB)=>fileinDB["_id"] === filetobeRenamed);
      let newfilesinDB = [...filesinDB];
      newfilesinDB[foundIndex] = {...newfilesinDB[foundIndex], s3_key: docs["data"]["s3_key"]}
      setfilesinDB(newfilesinDB); 
      
    }).catch((err)=>{
      console.log(err);
      toastErrorContainerFunction(err.toString().split(':')[1]);

    }).finally(()=>{
      handleRenameClose();
      setoldName("");
      setNewName("");
    })

  }

  
    if(type=="folder"&&newName.length&&newName.length<=20){
      FileService.renameFolder(filetobeRenamed, newName, props.id).then((docs)=>{
        let foundIndex = foldersinDB.findIndex((folderinDB)=>folderinDB["_id"] === filetobeRenamed);
        let newfoldersinDB = [...foldersinDB];
        newfoldersinDB[foundIndex] = {...newfoldersinDB[foundIndex], Name: docs["data"]["Name"]}
        setfoldersinDB(newfoldersinDB);
        handleRenameClose();
        setoldName("");
        setNewName("");
    }).catch((err)=>{
      toastErrorContainerFunction(err)
  }).finally(()=>{
    handleRenameClose();
    setoldName("");
    setNewName("");
  })
  }

  else if(newName.length==0)
    {
      handleRenameClose();
        setoldName("");
        setNewName("");
    }

  else if(newName.length>20)
  {
    toastErrorContainerFunction("File name cannot be more than 20 characters");
    handleRenameClose();
    setoldName("");
    setNewName("");
  }
  
    
   
    }

  const handleNameChange = (e)=>{
   
     setNewName( e.target.value);
   
  }
  //share

 const handleEmailChange = (e)=>{
   setmailshared(e.target.value);

 }

  const handleShareOpen = (id) => {
    setfileToBeShared(id);
    setOpenShareForm(true)
  };

  const handleShareClose = () => {
   setOpenShareForm(false)
  };

  const handleShare=()=>{
    alert(fileToBeShared);
    alert(mailshared);
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(mailshared))
    {
      FileService.shareFile(fileToBeShared, mailshared, props.id).then((returnObject)=>{
        console.log(returnObject);
      

        if(returnObject.status==200)
         {
          toastContainerFunction("User Added Successfully")
          setmailshared("");
          setfileToBeShared("");
          setOpenShareForm(false);

         }
         

      }).catch((error)=>{
        
           
        toastErrorContainerFunction("Couldn't add the user mentioned");
           setmailshared("");
           setfileToBeShared("");
           setOpenShareForm(false);
           
         
      })
    }
    else{
      toastErrorContainerFunction("Oops, this is not a valid email format");
      setmailshared("");
      setfileToBeShared("");
    }
  }


  const option = [
    'Choose File',
    'Choose Folder'
  ];
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const makefavouriteFile= (fileID)=>{
    FileService.updateFavouriteFiles(fileID).then(()=>{
      let foundIndex = filesinDB.findIndex((fileinDB)=>fileinDB["_id"] === fileID);
      let newfilesinDB = [...filesinDB];
      newfilesinDB[foundIndex] = {...newfilesinDB[foundIndex], favourite:!(newfilesinDB[foundIndex]["favourite"])}
      setfilesinDB(newfilesinDB); 
      
    }).catch((error)=>{
      toastErrorContainerFunction("Error in marking as favourite");
    }).finally(()=>{
      
    })
  };
  

  const downloadFile=(fileName)=>{
   FileService.downloadFile( fileName).then((link)=>{
     console.log(link["data"]);
      window.open(link["data"],"_blank")
        
   })
  }
  const makefavouriteFolder= (fileID)=>{
    FileService.updateFavouriteFolders(fileID).then(()=>{
      let foundIndex = foldersinDB.findIndex((fileinDB)=>fileinDB["_id"] === fileID);
      let newfoldersinDB =[...foldersinDB];
      newfoldersinDB[foundIndex]={...newfoldersinDB[foundIndex], favourite:!(newfoldersinDB[foundIndex]["favourite"])}
      setfoldersinDB(newfoldersinDB);   
    })
    .catch((err)=>{
    toastErrorContainerFunction("Couldn't mark the folder as favourite");
    }).finally(()=>{
      
  })
}


  const handleFiles = (files) => {  
    for(let i = 0; i < files.length; i++){       
        uploadFiles(files[i]);
    }    
  }
  const handleClose = () => {
    setAnchorEl(null);
  };

  toast.configure();
  function toastContainerFunction(message) {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
      return (
          <ToastContainer
            position="bottom-right"
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

  function toastErrorContainerFunction(message) {
    toast.error(message, {
      position: "bottom-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
      return (
          <ToastContainer
            position="bottom-right"
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

  const uploadFiles = (file) => {
    console.log(file);
    fetchData()
    FileService.upload(file, [userDetails])
   .then(
    (docs)=>{
      toastContainerFunction(`Uploading ${file.name} was successful`)
      
      setfilesinDB(prevArray=>[...prevArray, docs["data"]]);
    }).catch((err)=>{
      toastErrorContainerFunction("Couldn't upload the file to the drive")
    }).finally(()=>{
      setLoading(false);
    })
  };

  const uploadFilesInFolder = (folderID, file)=>{
    return FileService.uploadFilesInFolder( folderID, file, [userDetails]);
  }
  
  const handleFolder=(e)=>{
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    var folder = relativePath.split("/");
    folder = folder[0];
    fetchData()
    fileService.uploadFolder(folder, [userDetails]).then((res)=>{
      console.log(res);
      for(let i = 0; i < theFiles.length; i++){       
        uploadFilesInFolder(res["data"]["_id"], theFiles[i]).then((docs)=>{
          console.log(docs);  
          if(i===(theFiles.length-1)){
            
            setfoldersinDB((prevArray)=>[...prevArray, docs["data"]]);
            toastContainerFunction(`Uploading ${folder} was successful`)
          } 

        })
      }

    }).catch((err)=>{toastErrorContainerFunction("The folder couldn't be uploaded")}).finally(()=>{
      setLoading(false)
    });
  }
  

  const removeFile = (fileID)=>{
    FileService.removeFile(fileID).then(()=>{
      setfilesinDB(filesinDB.filter((file)=>file["_id"] !== fileID));
      toastContainerFunction(`removed File!`)
      
    }).catch((err)=>{toastErrorContainerFunction("The file couldn't be removed")}).finally(()=>{
     
    })
  }

  const removeFolder = (folderID)=>{
    FileService.removeFolder(folderID).then(()=>{
      setfoldersinDB(foldersinDB.filter((folder)=>folder["_id"] !== folderID));
      toastContainerFunction(`removed Folder!`);
    }).catch((err)=>{toastErrorContainerFunction("The folder couldn't be removed")}).finally(()=>{
     
    })
  }
  useEffect(()=>{
    //setjwtToken(props.accessKey);
  },[]);

  useEffect(()=>{ 
     
      setUserDetails(props.id);
      
      setUserName(props.name);
     
      setjwtToken(props.accessKey);

      //console.log(fileImageMap.get("pdf"));
  },[props]);
 
useEffect(()=>{
  getFiles(props.id);
  getFolders(props.id);  
},[props.accessKey,props.id])
  const getFiles=(id)=>{
    
    if(id)
    {
      FileService.getFiles({id}).then((response)=>{
        setfilesinDB(response.data);  
        console.log(filesinDB);
      }).catch((err)=>{
        console.log(err);
      }).finally(()=>{

      });
    }
  }

  const fetchData = () =>{
    setLoading(true);
  }
  
  const getFolders=(id)=>{
    if(id)
    {
      FileService.getFolders({id}).then((response)=>{
        setfoldersinDB(response.data);  
        console.log(foldersinDB);
      }).catch((err)=>{
        
        console.log(err);
      }).finally(()=>{

      });
    }
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
          <div className={classes.encapculate}>
            {
              props.allFileUpload &&
                <Typography variant="h2" component="h5" className={classes.heading}>
                  All Files
                </Typography>
            }
            {
              props.recentFileUpload &&
                <Typography variant="h2" component="h5" className={classes.heading}>
                  Recent Files
                </Typography>
            }
            {
              props.starredFiles &&
                <Typography variant="h2" component="h5" className={classes.heading}>
                  Starred Files
                </Typography>
            }
            {
              props.allFolderUpload &&
                <Typography variant="h2" component="h5" className={classes.heading}>
                  All Folders
                </Typography>
            }
            {
              props.recentFolderUpload &&
                <Typography variant="h2" component="h5" className={classes.heading}>
                  Recent Folders
                </Typography>
            }
            {
              props.starredFolder &&
                <Typography variant="h2" component="h5" className={classes.heading}>
                  Starred Folders
                </Typography>
            }
            <Button
              variant="contained"
              className={classes.button}
              onClick={handleClickListItem} 
              startIcon={<CloudUploadIcon />}
            >
              Upload
              { isloading && <LoadCircularProgress /> }
            </Button>
          </div>
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
                < input  directory="" webkitdirectory="" type="file"
                  hidden
                  onChange={(e) => handleFolder(e)}
                />
              </Button>
            </MenuItem>        
          </Menu>   
          <Dialog open={openRenameForm} onClose={handleRenameClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContentText style={{'text-align': 'center'}}>
          Change {oldname} to
          </DialogContentText>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            type="name"
            fullWidth
            value = {newName}
            onChange={handleNameChange}
            label = "New name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>{handleRename()}} color="secondary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openShareForm} onClose={handleShareClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title"></DialogTitle>
        <DialogContentText style={{'text-align': 'center'}}>
          Add a person's mail ID
          </DialogContentText>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            type="email"
            fullWidth
            label ="Email ID"
            value = {mailshared}
            onChange={handleEmailChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleShareClose} color="secondary">
            Cancel
          </Button>
         <Button onClick={handleShare} color="primary">
           Confirm
         </Button>
        </DialogActions>
      </Dialog>
          <div className="file-display-container">
            {
              props.allFileUpload &&
               <div container spacing={5} alignitems="center">   
                  <Grid container spacing={5} alignitems="center">
                    {
                      filesinDB.filter( (filedata) => filedata.s3_key.includes(props.searchFiled)).slice(0).reverse().map((filedata, i) => {
                        return (
                          <Grid item key={filedata["_id"]} xs={12} md={3}>
                            <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                            <CardHeader 
                                avatar={
                                  <Avatar aria-label="recipe" className={classes.avatar}>
                                    {userName.charAt(0)}
                                  </Avatar>
                                }
                                action={
                                  <div onClick={()=>removeFile(filedata["_id"])}>
                                    <IconButton aria-label="add to favorites" >
                                      <DeleteIcon/>
                                    </IconButton>
                                  </div>
                                }
                                title={filedata["s3_key"].slice(0,10)}
                              />
                              <CardMedia
                                  className={classes.cardMedia} 
                                  // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                                  image = {fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                                  title="Image title"
                              />
                              
                              <CardContent className={classes.cardContent}>
                                <Typography variant="subtitle1" color="textSecondary" >
                                  {filedata["createdAt"].slice(0,10)}
                                </Typography>
                                <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                                  <div onClick={()=>{makefavouriteFile( filedata["_id"] )}}>
                                    <IconButton aria-label="add to favorites" >
                                      { filedata["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                                    </IconButton>
                                  </div>
                                  <div onClick={()=>{downloadFile(filedata["_id"])}}> 
                                    <IconButton aria-label="share" className={classes.download}>
                                      <OpenInNewIcon/>
                                    </IconButton>
                                  </div>
                                  <div onClick={()=>{handleRenameOpen('file',filedata["_id"], filedata["s3_key"])}}>
                                    <IconButton aria-label="rename" title="edit name">
                                   <EditIcon/>
                                    </IconButton>
                                  </div>
                                  <div onClick={()=>handleShareOpen(filedata["_id"])}>
                                    <IconButton aria-label="share" title="share">
                                      <ShareIcon/>
                                    </IconButton>
                                  </div>
                                </CardActions>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })
                    }
                  </Grid>
                </div>
            }
            { 
              props.recentFileUpload && 
                <div container spacing={5} alignItems="center">   
                  <Grid container spacing={5} alignItems="center">
                    {filesinDB.filter( (filedata) => filedata.s3_key.includes(props.searchFiled)).slice(0,10).reverse().map((filedata, i) => {
                      return (
                        <Grid item key={filedata["_id"]} xs={12} md={3}>
                        <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                        <CardHeader 
                            avatar={
                              <Avatar aria-label="recipe" className={classes.avatar}>
                                {userName.charAt(0)}
                              </Avatar>
                            }
                            action={
                              <div onClick={()=>removeFile(filedata["_id"])}> 
                                <IconButton aria-label="add to favorites" >
                                  <DeleteIcon />
                                </IconButton>
                              </div>
                            }
                            title={filedata["s3_key"].slice(0,10)}
                          />
                          <CardMedia
                              className={classes.cardMedia} 
                              // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                              image = {fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                              title="Image title"
                          />
                          
                          <CardContent className={classes.cardContent}>
                            <div className={classes.formText}></div>
                              <Typography variant="h6" color="textSecondary" >
                              {filedata["createdAt"].slice(0,10)}
                              </Typography>
                            
                          
                          <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                            <div onClick={()=>{makefavouriteFile( filedata["_id"] )}}>
                              <IconButton aria-label="add to favorites" >
                                { filedata["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                              </IconButton>
                            </div>
                            <div onClick={()=>{downloadFile(filedata["_id"])}}> 
                              <IconButton aria-label="share" className={classes.download}>
                                <OpenInNewIcon />
                              </IconButton>
                            </div>
                            <div onClick={()=>{handleRenameOpen("file",filedata["_id"], filedata["s3_key"])}}>
                                    <IconButton aria-label="rename">
                                   <EditIcon />
                                    </IconButton>
                             </div>
                             <div onClick={()=>handleShareOpen(filedata["_id"])}>
                                    <IconButton aria-label="share" title="share">
                                      <ShareIcon/>
                                    </IconButton>
                                  </div>
                          </CardActions>
                          </CardContent>
                        </Card>
                      </Grid>
                      );
                    })}
                  </Grid>
                </div>
            }
            {
              props.starredFiles &&  
              <div container spacing={5} alignItems="center">   
              <Grid container spacing={5} alignItems="center">
                {filesinDB.filter( (filedata) =>  filedata["favourite"] && filedata.s3_key.includes(props.searchFiled)).map((filedata, i) => {
                  return (
                    <Grid item key={filedata["_id"]} xs={12} md={3}>
                    <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                    <CardHeader 
                        avatar={
                          <Avatar aria-label="recipe" className={classes.avatar}>
                            {userName.charAt(0)}
                          </Avatar>
                        }
                        action={
                          <div onClick={()=>removeFile(filedata["_id"])} >
                            <IconButton aria-label="add to favorites" >
                              <DeleteIcon/>
                            </IconButton>
                          </div>
                        }
                        title={filedata["s3_key"].slice(0,10)}
                      />
                      <CardMedia
                          className={classes.cardMedia} 
                          // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                          image = {fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                          title="Image title"
                      />
                      
                      <CardContent className={classes.cardContent}>
                        <div className={classes.formText}></div>
                          <Typography variant="h6" color="textSecondary" >
                          {filedata["createdAt"].slice(0,10)}
                          </Typography>
                        
                      
                      <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                      <div onClick={()=>{makefavouriteFile( filedata["_id"] )}}>
                        <IconButton aria-label="add to favorites">
                          { filedata["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                        </IconButton>
                      </div>
                      <div onClick={()=>{downloadFile(filedata["_id"])}} >
                        <IconButton aria-label="share" className={classes.download}>
                          <OpenInNewIcon />
                        </IconButton>
                      </div>
                      <div onClick={()=>{handleRenameOpen("file",filedata["_id"], filedata["s3_key"])}}>
                                    <IconButton aria-label="rename">
                                   <EditIcon/>
                                    </IconButton>
                       </div>
                       <div onClick={()=>handleShareOpen(filedata["_id"])}>
                                    <IconButton aria-label="share" title="share">
                                      <ShareIcon/>
                                    </IconButton>
                      </div>
                      </CardActions>
                      </CardContent>
                    </Card>
                  </Grid>
                  );
                  
                })}
              </Grid>
            </div>
            }
            {
               props.allFolderUpload &&  
              <div container spacing={5} alignItems="center">   
                <Grid container spacing={5} alignItems="center">
                {foldersinDB.filter( (folderData) => folderData.Name.includes(props.searchFiled)).slice(0).reverse().map((folderData, i) => {
                  return (
                    <Grid item key={folderData["_id"]} xs={12} md={3} style={{cursor: 'pointer'}} >
                      <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={folderData.Name}> 
                      <CardHeader 
                          avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                              {userName.charAt(0)}
                            </Avatar>
                          }
                          action={
                            <div onClick={()=>removeFolder(folderData["_id"])} >
                              <IconButton aria-label="add to favorites" >
                                <DeleteIcon />
                              </IconButton>
                            </div>
                          }
                          title={folderData["Name"].slice(0,10)}
                        />
                        <Link to={{pathname: "/folderview",
                          state: { folderID: folderData["_id"], id:userDetails, token:props.accessKey}}}  >
                          <CardMedia
                              className={classes.cardMedia} 
                              // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                              image = {FolderIcon}
                              title="Image title"
                              clickable 
                          />
                        </Link>
                        <CardContent className={classes.cardContent}>
                            <Typography variant="subtitle1" color="textSecondary" >
                              {folderData["createdAt"].slice(0,10)}
                            </Typography>
                          <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                            <div onClick={()=>{makefavouriteFolder( folderData["_id"] )}} >
                              <IconButton aria-label="add to favorites" >
                                { folderData["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                              </IconButton>
                            </div>
                            <div>
                            <IconButton aria-label="share" className={classes.download}>
                              <OpenInNewIcon/>
                            </IconButton>
                            </div>
                            <div onClick={()=>{handleRenameOpen('folder',folderData["_id"], folderData["Name"])}}>
                                    <IconButton aria-label="rename">
                                   <EditIcon/>
                                    </IconButton>
                                  </div>
                          </CardActions>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
            }
            {
               props.recentFolderUpload &&  
              <div container spacing={5} alignitems="center">   
                <Grid container spacing={5} alignitems="center">
                {foldersinDB.filter( (folderData) => folderData.Name.includes(props.searchFiled)).slice(0,10).reverse().map((folderData, i) => {
                  return (
                    <Grid item key={folderData["_id"]} xs={12} md={3} style={{cursor: 'pointer'}} >
                      <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={folderData.Name}> 
                      <CardHeader 
                          avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                              {userName.charAt(0)}
                            </Avatar>
                          }
                          action={
                            <div onClick={()=>removeFolder(folderData["_id"])} >
                              <IconButton aria-label="add to favorites" >
                                <DeleteIcon/>
                              </IconButton>
                            </div>
                          }
                          title={folderData["Name"].slice(0,10)}
                        />
                        <Link to={{pathname: "/folderview",
                          state: { folderID: folderData["_id"], id:userDetails, token:props.accessKey}}}  >
                          <CardMedia
                              className={classes.cardMedia} 
                              // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                              image = {FolderIcon}
                              title="Image title"
                              clickable 
                          />
                        </Link>
                        <CardContent className={classes.cardContent}>
                            <Typography variant="subtitle1" color="textSecondary" >
                              {folderData["createdAt"].slice(0,10)}
                            </Typography>
                          <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                            <div  onClick={()=>{makefavouriteFolder( folderData["_id"] )}} >
                              <IconButton aria-label="add to favorites">
                                { folderData["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                              </IconButton>
                            </div>
                            <div>
                            <IconButton aria-label="share" className={classes.download}>
                              <OpenInNewIcon/>
                            </IconButton>
                            </div>
                            <div onClick={()=>{handleRenameOpen('folder',folderData["_id"], folderData["Name"])}}>
                                    <IconButton aria-label="rename">
                                   <EditIcon/>
                                    </IconButton>
                                  </div>
                          </CardActions>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
            }
            {
               props.starredFolder &&  
              <div container spacing={5} alignItems="center">   
                <Grid container spacing={5} alignItems="center">
                {foldersinDB.filter( (folderData) =>  folderData["favourite"] && folderData.Name.includes(props.searchFiled)).map((folderData, i) => {
                  return (
                    <Grid item key={folderData["_id"]} xs={12} md={3} style={{cursor: 'pointer'}} >
                      <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={folderData.Name}> 
                      <CardHeader 
                          avatar={
                            <Avatar aria-label="recipe" className={classes.avatar}>
                              {userName.charAt(0)}
                            </Avatar>
                          }
                          action={
                            <div  onClick={()=>removeFolder(folderData["_id"])}> 
                              <IconButton aria-label="add to favorites" >
                                <DeleteIcon/>
                              </IconButton>
                            </div>
                          }
                          title={folderData["Name"].slice(0,10)}
                        />
                        <Link to={{pathname: "/folderview",
                          state: { folderID: folderData["_id"], id:userDetails, token:props.accessKey}}}  >
                          <CardMedia
                              className={classes.cardMedia} 
                              // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                              image = {FolderIcon}
                              title="Image title"
                              clickable 
                          />
                        </Link>
                        <CardContent className={classes.cardContent}>
                            <Typography variant="subtitle1" color="textSecondary" >
                              {folderData["createdAt"].slice(0,10)}
                            </Typography>
                          <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                            <div onClick={()=>{makefavouriteFolder( folderData["_id"] )}}>
                              <IconButton aria-label="add to favorites" >
                                { folderData["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                              </IconButton>
                            </div>
                            <div>
                              <IconButton aria-label="share" className={classes.download}>
                              <OpenInNewIcon/>
                            </IconButton>
                            </div>
                            <div onClick={()=>{handleRenameOpen('folder',folderData["_id"], folderData["Name"])}}>
                                    <IconButton aria-label="rename">
                                   <EditIcon/>
                                    </IconButton>
                                  </div>
                          </CardActions>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
            }
          </div>
       
        </Typography>
      </Container>
    </React.Fragment>  
  ); 
}