import React,{ useState, useRef, useEffect}from 'react';
import FileService from "../../services/file.service";
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton'
import Container from '@material-ui/core/Container'
import CssBaseline from '@material-ui/core/CssBaseline';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import FolderIcon from '../images/folder.png'
import StarIcon from '@material-ui/icons/Star';
import TextFileImage from '../images/textFileImage.png'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ShareIcon from '@material-ui/icons/Share';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import VisibilityIcon from '@material-ui/icons/Visibility'
import DeleteIcon from '@material-ui/icons/Delete';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import LoadCircularProgress from '../Main/circularProgress';
import fileService from '../../services/file.service';
import { ToastContainer, toast } from 'react-toastify';
import { useLocation} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';


import Header from '../Main/header'

const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '50%', // 16:9,
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

export default function Folderview(){
  const imageFormats =["jpg","jpeg","png","gif","bmp"]; 
    const loc = useLocation();
    const classes = useStyles();
    const [folderID, setFolderID]= useState({});
    const [userID, setUserID] = useState({});
    const [filesInFolder, setFilesInFolder]=useState([])
    const [openRenameForm, setopenRenameForm] = useState(false);
    const [newName, setNewName] = useState("");
    const [oldname,setoldName] = useState("");
    const [filetobeRenamed, setFileToBeRenamed]=useState("");
    const [type, setType] = useState("")
    const [openMenu, setOpenMenu] =  useState(null);
    const [fileDataOfMenu, setFileDataOfMenu] = useState({ });
    const [anchorEl, setAnchorEl] = useState(null);
    const [isloading, setLoading] = useState(false);
    const [showFav, setShowFav] = useState(false)
    const [openFileToView, setOpenFileToView] = useState(false);
 const [linkToView, setLinkToView] = useState("");
    const [openShareForm, setOpenShareForm] = useState(false);
  const [mailshared, setmailshared]= useState("");
  const [fileToBeShared, setfileToBeShared] = useState("");
  const [access, setAccess] = useState("View");
    const handleRenameOpen = (typeProperty, id, name) => {
      
      setoldName(name);
      setFileToBeRenamed(id);
      setopenRenameForm(true);
     setType(typeProperty)
    };
    const fetchData = () =>{
      setLoading(true);
    }
  
    
    const option = [
      'Choose File',
      
    ];
    const handleClose = () => {
      setAnchorEl(null);
    };
    const handleRenameClose = () => {
      setopenRenameForm(false);
      setoldName("");
      setNewName("");
    };

    const getFavouriteFileWithinFolder = ()=>{
       
        if(!showFav)
        {
         
         
          
          setShowFav(true)
        }
        else
        
        setShowFav(false);
    }
  
    const uploadFilesInFolder = (folderID, file)=>{
      return FileService.uploadFilesInFolder( folderID, file, [loc.state.id]);
    }

    const openFile=(fileName)=>{
      FileService.downloadFile( fileName, loc.state.id).then((link)=>{
        setOpenFileToView(true);
        setLinkToView(link["data"])
        
      })
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
    }

    const handleRename =()=>{
      alert(newName);
      alert(filetobeRenamed);
      alert(type);
      
      if(type === "file"&& newName.length)
      {FileService.renameFile(filetobeRenamed, newName.concat('.').concat((oldname.split('.').pop())?oldname.split('.').pop():''), loc.state.id).then((docs)=>{
        let foundIndex = filesInFolder.findIndex((fileinDB)=>fileinDB["_id"] === filetobeRenamed);
        let newfilesInFolder = [...filesInFolder];
        newfilesInFolder[foundIndex] = {...newfilesInFolder[foundIndex], s3_key: docs["data"]["s3_key"]}
        setFilesInFolder(newfilesInFolder); 
        handleRenameClose();
        setoldName("");
        setNewName("");
      })
    }
    else if(newName.length === 0)
    {
      handleRenameClose();
        setoldName("");
        setNewName("");
    }
  
    }
    
    const handleMenuOpen=(event, filedata)=>
  {setOpenMenu(event.currentTarget);
    setFileDataOfMenu(filedata);
  }

  const handleMenuClose=(()=>{
    
    setOpenMenu((openMenu)=>{
      return null
    });
   
  
    
  })
      
    
      
  
    const handleNameChange = (e)=>{
     
       setNewName( e.target.value);
     
      
    }
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
    fileImageMap.set("avi","https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/317b3233-97e7-4abe-b365-6d02b5862313/d277ol1-84f41fa1-3deb-4297-957d-5457456b32bb.png")
    fileImageMap.set("wmv","https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/i/317b3233-97e7-4abe-b365-6d02b5862313/d277ol1-84f41fa1-3deb-4297-957d-5457456b32bb.png")


    const handleFiles=(files)=>{
      console.log(files);
      fetchData();


      for(let file of files)
      {
        fileService.uploadFilesInFolder(folderID, file,[loc.state.id]).then((doc)=>{
          window.location.reload(false);

      }).catch((err)=>{
        toastErrorContainerFunction(`Couldn't upload ${file["name"]}`)
      })
    }
    }

    useEffect(()=>{
        setUserID(loc.state.id);
        setFolderID(loc.state.folderID);
       
          
    },[]);

    useEffect(()=>{
        getFilesWithinAFolder(loc.state.folderID,loc.state.id)
    },[loc.state.id])

    const getFilesWithinAFolder=(fid, uid)=>{
        fileService.getFilesWithinAFolder(fid, uid).then((docs)=>{
          for(let [i, file] of [...docs.data].entries()){
            fileService.downloadFile(file["_id"], uid ).then((link)=>{
              file["returnFileLink"] = link["data"];
              
           if(i>=[...docs.data].length-1)
           {
             setFilesInFolder(docs.data); 
           } 
          })
        }
            
        })
    }
    const handleEmailChange = (e)=>{
      setmailshared(e.target.value);
   
    }
   
     const handleShareOpen = (type,id) => {
   
      
      
         setfileToBeShared(id);
       
       
       setOpenShareForm(true)
     };
   
     const handleShareClose = () => {
      setOpenShareForm(false)
     };
   
     const handleShare=()=>{
       
       const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       if(re.test(mailshared))
       {
         FileService.shareFile(access, fileToBeShared, mailshared, loc.state.id).then((returnObject)=>{
           console.log(returnObject);
         
   
           if(returnObject.status === 200)
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

    const downloadFile=(fileName)=>{
        FileService.downloadFile(fileName, loc.state.id).then((link)=>{
          console.log(link["data"]);
           window.open(link["data"],"_blank")
        })
       }

       const handleClickListItem = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const removeFile = (fileID)=>{
        FileService.removeFileInAFolder(fileID, userID, folderID).then(()=>{
          handleMenuClose();
          setFilesInFolder(filesInFolder.filter((file)=>file["_id"] !== fileID));
         
        }).catch((err)=>{
          
        }).finally(()=>{
          toastContainerFunction(`Removed!`)
        })
      }
      const makefavouriteFile= (fileID)=>{
        FileService.updateFavouriteFiles(fileID, userID).then(()=>{
          let foundIndex = filesInFolder.findIndex((fileinFolder)=>fileinFolder["_id"] === fileID);
          let newfilesinFolder = [...filesInFolder];
          newfilesinFolder[foundIndex] = {...newfilesinFolder[foundIndex], favourite:!(newfilesinFolder[foundIndex]["favourite"])}
          setFilesInFolder(newfilesinFolder);  
        })
      };

    return(
      
         
        <div>
          
          <div>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameClose} color="primary">
            Cancel
          </Button>
          <Button onClick={()=>{handleRename()}} color="primary">
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
        <FormLabel component="legend">Access</FormLabel>
       <RadioGroup aria-label="access" name="access" value={access} onChange={(event)=>{setAccess(event.target.value)}}>
    <FormControlLabel value="View" title="User can only view your file" control={<Radio />} label="Viewer Access" />
    <FormControlLabel value="All" control={<Radio />} label="All Access" />
     </RadioGroup>
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
      <Dialog style={{height:"100%", width:"100%"}} open={openFileToView} onClose={()=>{setLinkToView("");setOpenFileToView(false);}}>
            <DialogActions><CancelIcon onClick={()=>{setLinkToView("");setOpenFileToView(false);}}/></DialogActions>
            <DialogContent><iframe src={linkToView} allowfullscreen style={{height:"600px", width:"1000px"}}></iframe></DialogContent>
            </Dialog>
      </div>
            <Header/>
      <Menu
        id="file-menu"
        anchorEl={openMenu}
        
        open={Boolean(openMenu)}
       
        onClick = {handleMenuClose}
        onClose={handleMenuClose}
      >
       
       
                                    <IconButton aria-label="add to favorites" onClick={()=>{makefavouriteFile( fileDataOfMenu["_id"] )}} >
                                      { fileDataOfMenu["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                                    </IconButton>
                                  
                               
        
 
      
                                    <IconButton aria-label="open" onClick={()=>{downloadFile(fileDataOfMenu["_id"])}}>
                                      <OpenInNewIcon/> 
                                    </IconButton>
                             
                                  
        
     
                                    <IconButton onClick={()=>{handleRenameOpen('file',fileDataOfMenu["_id"], fileDataOfMenu["s3_key"])}}aria-label="rename" title="edit name">
                                   <EditIcon/>
                                    </IconButton>
                           
                           
                                    <IconButton onClick ={()=>{openFile(fileDataOfMenu["_id"])}}>
                                   <VisibilityIcon />
                                    </IconButton>
                                    
                                    <IconButton  onClick={()=>handleShareOpen("file",fileDataOfMenu["_id"])}aria-label="share" title="share">
                                      <ShareIcon/>
                                    </IconButton> 
                                  
                             

      </Menu>
      <Grid container spacing={5}>
        <Grid item>
      <Button
              variant="contained"
              className={classes.button}
              onClick={()=>{getFavouriteFileWithinFolder()}} 
              startIcon={<StarBorderIcon/>}
              
            >
              {`Show ${!showFav?"favourites":"All"}`}
              </Button>
      </Grid>
        <Grid item>    
      <Button
              variant="contained"
              className={classes.button}
              onClick={handleClickListItem} 
              startIcon={<CloudUploadIcon />}
            >
              Upload
              <input
                  type="file"
                  className="file-input"
                  hidden
                  multiple
                  onChange={(e) => handleFiles(e.target.files)}
                />
            </Button>
            </Grid>
            </Grid>

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
             
            </MenuItem>        
          </Menu>   
            
        <div container spacing={5} alignitems="center" component="div" style={{ top:'20vh', height: '100vh' }}>   
        <Grid container spacing={5} alignitems="center">
          {
            showFav && filesInFolder.filter((file)=>file["favourite"]==true).map( (filedata) => {
              return (
                <Grid item onClick={(event)=>handleMenuOpen(event, filedata)}key={filedata["_id"]} xs={12} md={2}>
                  <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                  <CardHeader 
                      
                      action={
                        <div onClick={()=>removeFile(filedata["_id"])}>
                          <IconButton aria-label="add to favorites" >
                            <DeleteIcon style={{color:"red"}}/>
                          </IconButton>
                        </div>
                      }
                    
                     
                    />
                    <CardMedia
                        className={classes.cardMedia} 
                        // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                        image ={imageFormats.includes(filedata["type"])?filedata["returnFileLink"]:fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                        title="Image title"
                    />
                    
                    <CardContent className={classes.cardContent}>
                      <Typography variant="subtitle1" color="textSecondary" >
                      {filedata["s3_key"].slice(0,10)}
                      </Typography>
                      
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          }
          {
            !showFav && filesInFolder.map( (filedata) => {
              return (
                <Grid item onClick={(event)=>handleMenuOpen(event, filedata)}key={filedata["_id"]} xs={12} md={2}>
                  <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                  <CardHeader 
                      
                      action={
                        <div onClick={()=>removeFile(filedata["_id"])}>
                          <IconButton aria-label="add to favorites" >
                            <DeleteIcon style={{color:"red"}}/>
                          </IconButton>
                        </div>
                      }
                    
                     
                    />
                    <CardMedia
                        className={classes.cardMedia} 
                        // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                        image ={imageFormats.includes(filedata["type"])?filedata["returnFileLink"]:fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                        title="Image title"
                    />
                    
                    <CardContent className={classes.cardContent}>
                      <Typography variant="subtitle1" color="textSecondary" >
                      {filedata["s3_key"].slice(0,10)}
                      </Typography>
                 
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          }
        </Grid>
      </div>
      </div>
)}
