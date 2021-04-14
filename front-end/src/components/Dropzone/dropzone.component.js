import React,{ useState, useEffect}from 'react';
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
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import EditIcon from '@material-ui/icons/Edit';
import 'react-toastify/dist/ReactToastify.css';
import { FormLabel, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import './dropzone.component.css'
import { Link} from "react-router-dom"
import CancelIcon from '@material-ui/icons/Cancel';
import { DataGrid } from '@material-ui/data-grid';



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
  fileImageMap.set("jpeg","https://www.freeiconspng.com/uploads/multimedia-photo-icon-31.png")
  
  //functions to enable drag and drop
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
    
  }

const [foldersinDB, setfoldersinDB]=useState([]);
const [filesinDB, setfilesinDB]=useState([]);
const [sharedFilesinDB, setSharedFilesinDB]=useState([]);
const [anchorEl, setAnchorEl] = useState(null);
const [userDetails, setUserDetails] = useState({});
const [userName, setUserName] = useState({});
const [isloading, setLoading] = useState(false);
const [openRenameForm, setopenRenameForm] = useState(false);
const [newName, setNewName] = useState("");
const [oldname,setoldName] = useState("");
const [filetobeRenamed, setFileToBeRenamed]=useState("");
const [type, setType] = useState("")
const [openShareForm, setOpenShareForm] = useState(false);
const [mailshared, setmailshared]= useState("");
const [fileToBeShared, setfileToBeShared] = useState("");
const [access, setAccess] = useState("View");
const [openMenu, setOpenMenu] =  useState(null);
const [fileDataOfMenu, setFileDataOfMenu] = useState({ });
const [openFolderMenu, setOpenFolderMenu] = useState(null);
const [folderDataOfMenu, setFolderDataOfMenu] = useState({ });
const [openFileToView, setOpenFileToView] = useState(false);
const [linkToView, setLinkToView] = useState("");
const [typeToBeShared, setTypeToBeShared] = useState("");
const [folderToBeShared, setFolderToBeShared] = useState("");
const [openSharedFileMenu, setOpenSharedFileMenu] = useState(null);
const [sharedFileDataOfMenu, setSharedFileDataOfMenu] = useState({});
const [sizeOccupied, setSizeOccupied] =  useState(0)

const imageFormats =["jpg","jpeg","png","gif","bmp"];
//Columns for DataGrid View For Shared Files
const columns = [
    
  { field: 's3_key',
  headerName: 'Name',
   width: 200 },
 
  {
    field: 'creator',
    headerName: 'Owner',
    width: 200,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    width: 200
  },
  {
    field:'size',
    headerName: 'File Size',
  },
  
  {
    field:'type'
    
  }
  
]

//useEffect hook to set user details and ID

useEffect(()=>{
  getFiles(props.id);
  getSharedFiles(props.id);
  getFolders(props.id);  
},[props.id])

useEffect(()=>{ 
  setUserDetails(props.id);
  setUserName(props.name);
  },[props]);

  //Options for uploading file/folder menu within button
  const option = [
    'Choose File',
    'Choose Folder'
  ];
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
};  

//Function To handle the opening of Dialog during rename
const handleRenameOpen = (typeProperty, id, name) => {
 setoldName(name);
 setFileToBeRenamed(id);
 setopenRenameForm(true);
 setType(typeProperty)
  };

//Function to handle closing the dialog after the file is renamed
const handleRenameClose = () => {
 setopenRenameForm(false);
 setoldName("");
 setNewName("");
  };


 //Function to handle renaming for files, folders, shared files and contacting the server for the rename
  const handleRename =()=>{
  
    //If a file is renamed
   if(type === "file"&&newName.length&&newName.length<=20)
    {
      FileService.renameFile(filetobeRenamed, newName.concat('.').concat((oldname.split('.').pop())?oldname.split('.').pop():''), props.id)
      .then((docs)=>{
                   if(docs!=null)
                       {
                          let foundIndex = filesinDB.findIndex((fileinDB)=>fileinDB["_id"] === filetobeRenamed);
                          let newfilesinDB = [...filesinDB];
                          newfilesinDB[foundIndex] = {...newfilesinDB[foundIndex], s3_key: docs["data"]["s3_key"]}
                          setfilesinDB(newfilesinDB); 
                        }
      
    }).catch((err)=>{
    
                   toastErrorContainerFunction(err.toString().split(':')[1]);

    }).finally(()=>{
                     handleRenameClose();
                     setoldName("");
                     setNewName("");
    })

  }
//Renaming a shared file
  else if(type === "sharedFile"&&newName.length&&newName.length<=20)
    {
      FileService.renameFile(filetobeRenamed, newName.concat('.').concat((oldname.split('.').pop())?oldname.split('.').pop():''), props.id)
      .then((docs)=>{
                      if(docs!=null)
                         {
                           let foundIndex = sharedFilesinDB.findIndex((fileinDB)=>fileinDB["_id"] === filetobeRenamed);
                           let newfilesinDB = [...sharedFilesinDB];
                           newfilesinDB[foundIndex] = {...newfilesinDB[foundIndex], s3_key: docs["data"]["s3_key"]}
                           setSharedFilesinDB(newfilesinDB); 
                          }
      
      }).catch((err)=>{
    
                       toastErrorContainerFunction(err.toString().split(':')[1]);

      }).finally(()=>{
                        handleRenameClose();
                        setoldName("");
                        setNewName("");
       })

  }


  //Renaming folder
   else if(type === "folder"&&newName.length&&newName.length<=20)
   {
      FileService.renameFolder(filetobeRenamed, newName, props.id)
       .then((docs)=>{
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

  else if(newName.length === 0)
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

    //A function to trigger the changed value of name of file when user is typing
  const handleNameChange = (e)=>{
   
                     setNewName( e.target.value);
   
  }


/* Sharing file */

 const handleEmailChange = (e)=>{
      setmailshared(e.target.value);
 }

 //function to handle opening of Dialog during share
  const handleShareOpen = (type,id) => {

    if(type=="file")
    {
      setTypeToBeShared("file")
      setfileToBeShared(id);
    }
    if(type=="folder")
    {
      setTypeToBeShared("folder")
      setFolderToBeShared(id);
    }
    setOpenShareForm(true)
  };


  //Function to handle closing the Share Dialog
  const handleShareClose = () => {
   setOpenShareForm(false)
  };

  //Function to send change request to file service for changing access in the backend database
  const handleShare=()=>{
     //regex expression to check the email ID's format
      const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       
      
      if(re.test(mailshared)&&typeToBeShared=="file")
          {
             FileService.shareFile(access, fileToBeShared, mailshared, props.id)
             .then((returnObject)=>{
                        
      
               //sending a toaster message when the user was added
                if(returnObject.status === 200)
                      {
                         toastContainerFunction("User Added Successfully")
                         setmailshared("");
                         setfileToBeShared("");
                         setOpenShareForm(false);

                      }
         

               })
               .catch((error)=>{
        
           //handling error if the user couldn't be given access
                   toastErrorContainerFunction("Couldn't add the user mentioned");
                   setmailshared("");
                  setfileToBeShared("");
                  setOpenShareForm(false);
           
         
        })
        }
         //Handling folder share
         else if(re.test(mailshared)&&typeToBeShared=="folder")
         {
              FileService.shareFolder(access, folderToBeShared, mailshared, props.id)
              .then((returnObject)=>{
               
                
                          if(returnObject.status === 200)
                            {
                            toastContainerFunction("User Added Successfully")
                            setmailshared("");
                            setFolderToBeShared("");
                            setOpenShareForm(false);

                            }
                            

                 })
                            .catch((error)=>{
        
           
                              toastErrorContainerFunction("Couldn't add the user mentioned");
                              setmailshared("");
                              setFolderToBeShared("");
                              setOpenShareForm(false);
           
         
                 })
    }
    else{
      //Error toaster if the email format is not valid
                      toastErrorContainerFunction("Oops, this is not a valid email format");
                      setmailshared("");
                      setfileToBeShared("");
    }
  }


 
//Making a file as favourite
  const makefavouriteFile= (fileID)=>{
    FileService.updateFavouriteFiles(fileID, userDetails).then(()=>{
      let foundIndex = filesinDB.findIndex((fileinDB)=>fileinDB["_id"] === fileID);
      let newfilesinDB = [...filesinDB];
      newfilesinDB[foundIndex] = {...newfilesinDB[foundIndex], favourite:!(newfilesinDB[foundIndex]["favourite"])}
      setfilesinDB(newfilesinDB); 
     
      toastContainerFunction(`${filesinDB[foundIndex]["s3_key"]} is marked as a favourite!` )
    }).catch((error)=>{
      toastErrorContainerFunction("Error in marking as favourite");
    }).finally(()=>{
      
    })
  };
  
  
//gets the url from server and displays it in a new tab
  const openFileInNewTab=(fileName)=>{
   FileService.openFile( fileName, userDetails).then((link)=>{
    
      window.open(link["data"],"_blank")
        
   })
  }


   
 //Opens the file url in an iframe
  const openFile=(fileName)=>{
    FileService.openFile( fileName, userDetails).then((link)=>{
      setOpenFileToView(true);
      setLinkToView(link["data"])
      
    })
   }
  

  //Marking a folder as favourite in the DB
  const makefavouriteFolder= (fileID)=>{
    FileService.updateFavouriteFolders(fileID, userDetails).then(()=>{
      let foundIndex = foldersinDB.findIndex((fileinDB)=>fileinDB["_id"] === fileID);
      let newfoldersinDB =[...foldersinDB];
      newfoldersinDB[foundIndex]={...newfoldersinDB[foundIndex], favourite:!(newfoldersinDB[foundIndex]["favourite"])}
      setfoldersinDB(newfoldersinDB);   
      toastContainerFunction(`${foldersinDB[foundIndex]["Name"]} is marked as a favourite!`)
    })
    .catch((err)=>{
    toastErrorContainerFunction("Couldn't mark the folder as favourite");
    }).finally(()=>{
      
  })
}

  //When the file is uploaded or dragged and dropped, 
  /*this function calls the uploadFile function to send it to the server*/

  const handleFiles = (files) => {  
          for(let i = 0; i < files.length; i++){       
                uploadFiles(files[i]);
           }    
  }
  
  const uploadFiles = (file) => {
    
    fetchData()
    FileService.upload(file, [userDetails])
   .then(
    (docs)=>{
      toastContainerFunction(`Uploading ${file.name} was successful`)
      FileService.openFile(docs["data"]["_id"], props.id ).then((link)=>{
        docs["data"]["returnFileLink"] = link["data"];
        setSizeOccupied((sizeOccupied)=>sizeOccupied+parseInt(file["size"]))
          setfilesinDB(prevArray=>[...prevArray,docs["data"]]);
     
        })
     
       }).catch((err)=>{
                 toastErrorContainerFunction("Couldn't upload the file to the drive")
       }).finally(()=>{
                  setLoading(false);
    })
  };
//Function to upload files within folder
  const uploadFilesInFolder = (folderID, file)=>{
          return FileService.uploadFilesInFolder( folderID, file, [userDetails]);
  }
  
  //Function to upload the parent folder and then upload the files within it
  const handleFolder=(e)=>{
    var theFiles = e.target.files;
    var relativePath = theFiles[0].webkitRelativePath;
    var folder = relativePath.split("/");
    folder = folder[0];
    fetchData()
    fileService.uploadFolder(folder, [userDetails]).then((res)=>{
      
      for(let i = 0; i < theFiles.length; i++){       
          uploadFilesInFolder(res["data"]["_id"], theFiles[i]).then((docs)=>{
          setSizeOccupied((sizeOccupied)=>sizeOccupied+parseInt(theFiles[i]["size"]))
           
          if(i===(theFiles.length-1)){
           
              setfoldersinDB((prevArray)=>[...prevArray, docs["data"]]);
              toastContainerFunction(`Uploading ${folder} was successful`)
          } 

        })
      }

    })
    .catch((err)=>{toastErrorContainerFunction("The folder couldn't be uploaded")})
    .finally(()=>{
      setLoading(false)
    });
  }  

  toast.configure();
  //toast function to display toaster messages-success
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
   //toast function to display toaster messages-error
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

  
//Removes file 
  const removeFile = (fileID)=>{
    
    
              FileService.removeFile(fileID, userDetails).then(()=>{
                        handleMenuClose();
                      
                        setfilesinDB(filesinDB.filter((file)=>file["_id"] !== fileID));
                        toastContainerFunction(`removed File!`)
                        
                       }).catch((err)=>
                      {
                        toastErrorContainerFunction("The file couldn't be removed")}
                      ).finally(()=>{
                        
                        })
            }

//Removes folder
  const removeFolder = (folderID)=>{
                   handleFolderMenuClose();
                   FileService.removeFolder(folderID,userDetails).then(()=>{
                            setfoldersinDB(foldersinDB.filter((folder)=>folder["_id"] !== folderID));
                            toastContainerFunction(`removed Folder!`);
                          })
                          .catch((err)=>{toastErrorContainerFunction("The folder couldn't be removed")})
                          .finally(()=>{
     
                           })
  }

 
  
  
//Functions to open menus
const handleMenuOpen=(event, filedata)=>
  {setOpenMenu(event.currentTarget);
    setFileDataOfMenu(filedata);
  }

  const handleSharedFilesMenuOpen = (event, filedata)=>{
    setOpenSharedFileMenu(event.currentTarget);
    setSharedFileDataOfMenu(filedata);
  }

  const handleFolderMenuOpen=(event, folderData)=>{
    setOpenFolderMenu(event.currentTarget);
    setFolderDataOfMenu(folderData)
  }
  
  //functions to handle closing of menus

  const handleMenuClose=(()=>{setOpenMenu((openMenu)=>{return null });})
  const handleShareMenuClose=(()=>{setOpenSharedFileMenu((openMenu)=>{return null});})
  
  const handleFolderMenuClose=(()=>{setOpenFolderMenu((openFolderMenu)=>{return null});})


  //Function for getting the files from the service and then updating it's value for the views
  const getFiles=(id)=>{
    if(id)
    {
      FileService.getFiles({id}).then((response)=>{
        
        for(let [i,file] of [...response.data].entries())
        {
          FileService.openFile(file["_id"], props.id ).then((link)=>{
          file["returnFileLink"] = link["data"];
           setSizeOccupied((sizeOccupied)=>sizeOccupied+parseInt(file["size"]))
         
              if(i>=[...response.data].length-1)
                   {
                       setfilesinDB(response.data); 
                    } 
             })

            
             }

       
      }).catch((err)=>{
        
      }).finally(()=>{

      });
    }
  }
 //Function for getting the Shared files from the service and then updating it's value for the views
  const getSharedFiles=(id)=>{
   
    if(id)
    {
      FileService.getSharedFiles(id).then((response)=>{
        if(response.length)
        {for(let [i,file] of [...response.data].entries())
           {
                  file["size"] = fileSize(file["size"])
                  if(i==[...response.data].length-1)
                     {
                      setSharedFilesinDB(response.data);
                     }
             }
            }

      
       
       
      })
      .catch((err)=>{
          
      }).finally(()=>{

      });
    }
  }

   //Function for getting the folders from the service and then updating it's value for the views
  const getFolders=(id)=>{
    if(id)
    {
      FileService.getFolders({id}).then((response)=>{

        for(let folder of [...response.data])
        {
          setSizeOccupied((sizeOccupied)=>{sizeOccupied+=folder["size"]})
        }
        setfoldersinDB(response.data);  
  
      }).catch((err)=>{
        
     
      }).finally(()=>{

      });
    }
  }

  const fetchData = () =>{
    setLoading(true);
  }
  




const deleteAccessToSharedFile=(fileId)=>{
FileService.removeAccess(fileId, userDetails).then((docs)=>{
  setSharedFilesinDB(sharedFilesinDB.filter((file)=>file["_id"] !== fileId));
  toastContainerFunction(`removed access`)
}).catch((err)=>{
  toastErrorContainerFunction("Could not remove the file from the shared List")
})

}

//function to calculate the size of the file
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
                <Typography variant="h4" component="h5" className={classes.heading}>
                  All Files
                </Typography>
            }
            {
              props.recentFileUpload &&
                <Typography variant="h4" component="h5" className={classes.heading}>
                  Recent Files
                </Typography>
            }
            {
              props.starredFiles &&
                <Typography variant="h4" component="h5" className={classes.heading}>
                  Starred Files
                </Typography>
            }
            {
              props.allFolderUpload &&
                <Typography variant="h4" component="h5" className={classes.heading}>
                  All Folders
                </Typography>
            }
            {
              props.recentFolderUpload &&
                <Typography variant="h4" component="h5" className={classes.heading}>
                  Recent Folders
                </Typography>
            }
            {
              props.starredFolder &&
                <Typography variant="h4" component="h5" className={classes.heading}>
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
              <Button variant="contained"component="label">
                Choose File
                <input type="file" className="file-input" hidden multiple onChange={(e) => handleFiles(e.target.files)}/>
              </Button>
              <Button variant="contained"component="label">
                Choose Folder
                <input  directory="" webkitdirectory="" type="file"hidden  onChange={(e) => handleFolder(e)} />
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

      <Dialog style={{height:"100%", width:"100%"}} open={openFileToView} onClose={()=>{setLinkToView("");setOpenFileToView(false);}}>
            <DialogActions><CancelIcon onClick={()=>{setLinkToView("");setOpenFileToView(false);}}/></DialogActions>
            <DialogContent><iframe src={linkToView} allowfullscreen style={{height:"600px", width:"1000px"}}></iframe></DialogContent>
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
       <Menu
         id="folder-menu"
         anchorEl={openFolderMenu}
         open={Boolean(openFolderMenu)}
         onClick = {handleFolderMenuClose}
         onClose={handleFolderMenuClose}
       >
       
         
          <IconButton aria-label="add to favorites" onClick={()=>{makefavouriteFolder( folderDataOfMenu["_id"] )}} >
            { folderDataOfMenu["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
          </IconButton>
        
          <IconButton  onClick={()=>{handleRenameOpen('folder',folderDataOfMenu["_id"], folderDataOfMenu["Name"])}}aria-label="rename" title="edit name">
          <EditIcon/>
          </IconButton>
        
          <IconButton onClick={()=>handleShareOpen("folder",folderDataOfMenu["_id"])}aria-label="share" title="share">
            <ShareIcon/>
          </IconButton>
        
        
          <Link to={{pathname: "/folderview",state: { folderID: folderDataOfMenu["_id"], id:userDetails}}}  >
          < IconButton >
           <VisibilityIcon />
          </IconButton>
          </Link>
                          

                                  

        </Menu>
      
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
          
            <IconButton onClick={()=>{handleRenameOpen('file',fileDataOfMenu["_id"], fileDataOfMenu["s3_key"])}}aria-label="rename" title="edit name">
            <EditIcon/>
            </IconButton>
                    
            <IconButton  onClick={()=>handleShareOpen("file",fileDataOfMenu["_id"])}aria-label="share" title="share">
              <ShareIcon/>
            </IconButton> 
                         
            <IconButton onClick ={()=>{openFile(fileDataOfMenu["_id"])}}>
            <VisibilityIcon />
            </IconButton>
            
            <IconButton aria-label="share" onClick={()=>{openFileInNewTab(fileDataOfMenu["_id"])}}>
            <OpenInNewIcon/> 
            </IconButton>
            
      </Menu>
      <Menu
        id="shared-file-menu"
        anchorEl={openSharedFileMenu}
        open={Boolean(openSharedFileMenu)}
        onClick = {handleShareMenuClose}
        onClose={handleShareMenuClose}
      >
       
        
              <IconButton onClick={()=>{handleRenameOpen('sharedFile',sharedFileDataOfMenu["_id"], sharedFileDataOfMenu["s3_key"])}}aria-label="rename" title="edit name">
              <EditIcon/>
              </IconButton>
            
            
              <IconButton  onClick={()=>handleShareOpen("file",sharedFileDataOfMenu["_id"])}aria-label="share" title="share">
                <ShareIcon/>
              </IconButton> 
        
            
            
              <IconButton onClick ={()=>{openFile(sharedFileDataOfMenu["_id"])}}>
              <VisibilityIcon />
              </IconButton>
              
              <IconButton aria-label="share" onClick={()=>{openFileInNewTab(sharedFileDataOfMenu["_id"])}}>
              <OpenInNewIcon/> 
              </IconButton>
        
              <IconButton style={{color:'red'}} onClick={()=>{deleteAccessToSharedFile(sharedFileDataOfMenu["_id"])}}>
                  <DeleteIcon aria-label="Delete Access" />
                  </IconButton>
          
        

      </Menu>
          <div className="file-display-container">
            {
              props.allFileUpload &&
               <div spacing={5} alignitems="center">   
                  <Grid container spacing={5} alignitems="center">
                    {
                      filesinDB.filter( (filedata) => filedata.s3_key.includes(props.searchFiled)).slice(0).reverse().map((filedata, i) => {
                        return (
                          <Grid onClick={(event)=>handleMenuOpen(event, filedata)} item key={filedata["_id"]} xs={12} md={3}>
       
                
                            <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                            
                            <CardHeader 
                                avatar={
                                  <Avatar aria-label="name" className={classes.avatar}>
                                    {userName.charAt(0)}
                                  </Avatar>
                                }
                                action={
                                  <div >
                                    <IconButton aria-label="add to favorites" >
                                      <DeleteIcon onClick={()=>removeFile(filedata["_id"])}/>
                                    </IconButton>
                                  
                                  </div>
                                 
                                }
                                 title={filedata["createdAt"].slice(0,10)}
                               
                                
                              />
                              <CardMedia
                                  className={classes.cardMedia} 
                                  
                                  image ={imageFormats.includes(filedata["type"])?filedata["returnFileLink"]:fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                                   
                                  title={filedata["s3_key"]}
                              >
                                
                                </CardMedia>
                              
                              <CardContent className={classes.cardContent}>
                                <Typography variant="subtitle1" color="textSecondary" >
                                {filedata["s3_key"].slice(0,20)}<br/>
                                {fileSize(filedata["size"])}
                                </Typography>
                               
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
                <div spacing={5} alignItems="center">   
                  <Grid container spacing={5} alignItems="center">
                    {filesinDB.filter( (filedata) => filedata.s3_key.includes(props.searchFiled)).sort(function(a,b){
                     return a["updatedAt"]>b["updatedAt"]                   
                    }).slice(0,10).reverse().map((filedata, i) => {
                      return (
                        <Grid item onClick={(event)=>handleMenuOpen(event, filedata)} key={filedata["_id"]} xs={12} md={3}>
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
                            title={filedata["createdAt"].slice(0,10)}
                            
                          />
                          <CardMedia
                              className={classes.cardMedia} 
                              // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                              image={imageFormats.includes(filedata["type"])?filedata["returnFileLink"]:fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                              title="Image title"
                          />
                          
                          <CardContent className={classes.cardContent}>
                            <div className={classes.formText}></div>
                              <Typography variant="subtitle1" color="textSecondary">
                              {filedata["s3_key"].slice(0,20)}
                              </Typography>
                            
                          
                         
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
              <div spacing={5} alignItems="center">   
              <Grid container spacing={5} alignItems="center">
                {filesinDB.filter( (filedata) =>  filedata["favourite"] && filedata.s3_key.includes(props.searchFiled)).map((filedata, i) => {
                  return (
                    <Grid item onClick={(event)=>handleMenuOpen(event, filedata)} key={filedata["_id"]} xs={12} md={3}>
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
                        title={filedata["createdAt"].slice(0,10)}
                       
                      />
                      <CardMedia
                          className={classes.cardMedia} 
                          // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                         image={imageFormats.includes(filedata["type"])?filedata["returnFileLink"]:fileImageMap.get( filedata["s3_key"].split('.').pop() )?fileImageMap.get( filedata["s3_key"].split('.').pop() ) : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="}
                          title="Image title"
                      />
                      
                      <CardContent className={classes.cardContent}>
                        <div className={classes.formText}></div>
                          <Typography variant="subtitle1" color="textSecondary" >
                          {filedata["s3_key"].slice(0,20)}
                          </Typography>
                        
                      
                      
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
              <div spacing={5} alignItems="center">   
                <Grid container spacing={5} alignItems="center">
                {foldersinDB.filter( (folderData) => folderData.Name.includes(props.searchFiled)).slice(0).reverse().map((folderData, i) => {
                  return (
                    <Grid onClick={(event)=>handleFolderMenuOpen(event, folderData)} item key={folderData["_id"]} xs={12} md={3} style={{cursor: 'pointer'}} >
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
                       
                          <CardMedia
                              className={classes.cardMedia} 
                              // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                              image = {FolderIcon}
                              title="Image title"
                              clickable 
                          />
                        
                        <CardContent className={classes.cardContent}>
                            <Typography variant="subtitle1" color="textSecondary" >
                              {folderData["createdAt"].slice(0,10)}
                            </Typography>
                          
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
              <div spacing={5} alignitems="center">   
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
                          state: { folderID: folderData["_id"], id:userDetails}}}  >
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
              <div  spacing={5} alignItems="center">   
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
                          state: { folderID: folderData["_id"], id:userDetails}}}  >
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
                        
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
            }

{props.sharedFilesAndFolders &&  
               
             
                   
               <div style={{ height: 300, width: '100%' }}>

                    
           

                    {sharedFilesinDB.length?
                    <DataGrid  hideFooterSelectedRowCount={false} columns={columns.map((column) => ({...column,disableClickEventBubbling: true,}))} onRowClick={(file, event)=>{handleSharedFilesMenuOpen(event,file["row"])}} rows={sharedFilesinDB} columns={columns} pageSize={5}  />:
                    <Typography>Nothing is shared with you at present</Typography>
                    }
                 </div>
             
}
          </div>
       
        </Typography>
      </Container>
    </React.Fragment>  
  ); 
}