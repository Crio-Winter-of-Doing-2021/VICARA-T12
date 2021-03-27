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
import { Route, useLocation} from 'react-router-dom'
import Header from '../Main/header'
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
                fontSize: `8px`
	},
	formTitle: {
		fontSize: '8px',
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
    const loc = useLocation();
    const classes = useStyles();
    const [folderID, setFolderID]= useState({});
    const [userID, setUserID] = useState({});
    const [filesInFolder, setFilesInFolder]=useState([])
    useEffect(()=>{
        setUserID(loc.state.id);
        setFolderID(loc.state.folderID);
       
        
        
            
            
        
    },[loc]);

    useEffect(()=>{
        getFilesWithinAFolder(loc.state.token, loc.state.folderID,loc.state.id)
    },[loc.state.id])

    

    const getFilesWithinAFolder=(token, fid, uid)=>{
        fileService.getFilesWithinAFolder(token, fid, uid).then((docs)=>{
            console.log(docs["data"]);
            setFilesInFolder(docs.data)
            
            
        })
    }
    const downloadFile=(fileName)=>{
        FileService.downloadFile(loc.state.token, fileName).then((link)=>{
          console.log(link["data"]);
           window.open(link["data"],"_blank")
             
        })
       }

    const removeFile = (fileID)=>{
        FileService.removeFileInAFolder(loc.state.token,fileID, userID, folderID).then(()=>{
          setFilesInFolder(filesInFolder.filter((file)=>file["_id"] !== fileID));
          toastContainerFunction(`Removed!`)
        })
      }
      const makefavouriteFile= (fileID)=>{
        FileService.updateFavouriteFiles(loc.state.token,fileID).then(()=>{
          let foundIndex = filesInFolder.findIndex((fileinFolder)=>fileinFolder["_id"] === fileID);
          let newfilesinFolder = [...filesInFolder];
          newfilesinFolder[foundIndex] = {...newfilesinFolder[foundIndex], favourite:!(newfilesinFolder[foundIndex]["favourite"])}
          setFilesInFolder(newfilesinFolder);  
          
        })
      };


    
    return(
        <div>
        <Header/>
        <div container spacing={2} alignitems="center" component="div" style={{ top:'20vh', height: '100vh' }}>   
        <Grid container spacing={2} alignitems="center">
          {
            filesInFolder.map( (filedata) => {
              return (
                <Grid item key={filedata["_id"]} xs={12} md={3}>
                  <Card className={classes.card} style={{backgroundColor:"#fafafa"}} title={filedata["s3_key"]}> 
                  <CardHeader 
                      
                      action={
                        <div onClick={()=>removeFile(filedata["_id"])}>
                          <IconButton aria-label="add to favorites" >
                            <DeleteIcon/>
                          </IconButton>
                        </div>
                      }
                    
                     
                    />
                    <CardMedia
                        className={classes.cardMedia} 
                        // Checking if image url ends in either a png or jpeg format. If not then, return 404 error image
                        image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX////0myXzlQD0miD1pT/++O/zkwD86dTzlgn0nCX72br0nij0mRP85dH2rVf1qEb97t33unj61Kz++/X1ojn+9Or85Mv4vn/60qj2sF/869j5y5v738P4xIv3tmz5z6L5yJX2r131qU762bX3t3AjskLOAAAE00lEQVR4nO2d7XaiMBRFIdGYSmpt0Wm1Sh067/+MM+UjVgG1yxMSmLN/qguzBa7k5sKNIkIIIYQQQgghhBBCCCFumLog9W31HaOECyavn1PfahWJjF0gjRbZ1rdcgSPDwlJlIRyuDg3j2Jhfvv0cG/7bjS++BR0bxrF/xcTg0Upp+8OpAA5UPOnybSFqRxHK3waaWWJKQ7PxPRRnbHR1nO58j8QZm3Ivytz3QNwxKc9FtfQ9EGdsVWGo330PxB1ZsRPlwvc43LErg430PQ53pKWhCuEK3BGjDzXRqlBUYcwUnVD+X6iZ73G4w7vhu1EQzOS5/dLMt+FGoaaB0qikbSbo1zCdGJRgISmemvMkr4ZLiZ7eS9mImT4NdwKfv5BiHY7hB+wUPFFMgjF8PRMUdwbTOi+j94EY/tb1j14JztK7WM9XVdRSp8epJ8NpPZzYTFbluO6/cFyU2zSnO9GP4dbUMUb/ri8cAZfG5Zbk6uRFL4ZzG0TVa50RRhjuRMth6sPw3cYY9RYhDau5oDjJAHswfK4FZTkUnGFUHfnz76/1bpgu6iBqkvJoAho+BGC4rvPQsc6rxMK4DGc2iKrn+rVRGX4qK3hMYI7J8GBjzPeFhBEZZqIWjL/rjMYwzesgqicnycuxGK4f7HpldvrOSAx/2UVndTh7axyGL8cY83n+3igM91bQNHPPYzC0QdSsWmoGhm94TBnq1oqBwRsubRD9mgy2MHTD3fFCraM2aeCGbzbG6K7KpGEb2pRhPRlsYdCGG3uhtuheZR6w4TFleJwMtjBgw8wKflz62IANq8JReaWqbMiGpeDDlbEP3jC5VskydEM5ufoxGt4ODdH8v4bZ6eItsPAsFMPnthITGt4EDdHQcLyGf5RuMipDd9AQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfHQEA0N8dAQDQ3x0BANDfEEY/iSLe5n0/LImVAMMyURiKdQDXeoO5xFo9QqEMODvjDqnyCz800HYviBMjSNesBADNe2avhO1GOghtFOQJ46W9xiG6ZhlD4iaLmxIRhDZ9AQDQ3x0BANDfHQEA0N8dAQDQ3xhGOYOupCEorhOr/z0Wwlk+ZNqYEYpgYzx5fNottADF9geZr9+aYDMTygnugZbK5tjsqX6kOghlGuISeikY1wGophtJctxfo/xfxppqKCMXQGDdHQEA8N0dAQDw3R0BAPDdHQEE+bYVLmPEZsuC2YOemG1Gn4sXi6n/zQHHSboUu6DBeYqi993uchGENY1VezXVwghj1Xfbmkw/ANlk1sPGkyEMMpqL2MbHYaC8Qw2iaIqi9lmo+BC8Uwipaz+2lrFReOoStoiIaGeGiIhoZ4aIiGhnhoiIaGeGiIhoZ4aIiGhnh6N/zKqZ31PXWL9GEYy76+LoqmVR/Sy70YgOSFoejqL4OnqlztryNn+bzg/k7EtCpcFU5W0tqYl626zKafb1yvqo4heS9f90VaNSMz8v0RkAK+zG5vW49f7PmCZW9bBQGy+FfQtrZa9ycYpRJ05/1P6GoN5oYZajH0dvSlxksOmKOen3Cz4KJfwSjaatR66C3IjvZ8Tkn3AlOaf13PqLzXHvGW6edG9BBMxerQtqTYF4ib1X5+KxshhBBCCCGEEEIIIYSQe/gLEeV5y4CZvuUAAAAASUVORK5CYII="
                        title="Image title"
                    />
                    
                    <CardContent className={classes.cardContent}>
                      <Typography variant="subtitle1" color="textSecondary" >
                      {filedata["s3_key"].slice(0,10)}
                      </Typography>
                      <CardActions disableSpacing style={{display:'flex', top:'0px'}}>
                        <div onClick={()=>{makefavouriteFile( filedata["_id"] )}}>
                          <IconButton aria-label="add to favorites" >
                            { filedata["favourite"] ?<StarIcon style={ {color:"orange" }} />:<StarBorderIcon />}
                          </IconButton>
                        </div>
                        <IconButton aria-label="share" className={classes.download}>
                          <OpenInNewIcon onClick={()=>{downloadFile(filedata["_id"])}}/>
                        </IconButton>
                      </CardActions>
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
