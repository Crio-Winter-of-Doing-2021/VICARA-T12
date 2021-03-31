
import axiosInstance from '../axios'
import Cookies from 'js-cookie';

const jwtToken = Cookies.get("jwt");

class FileService{
  
  upload(file, users){
    let formData = new FormData();
    formData.append("file", file);
    formData.append("users", users);
    return axiosInstance.post("api/upload/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            
          },
          // onUploadProgress,
    });    
  }

  uploadFilesInFolder(folderID, file, users){
    let formData = new FormData();
    formData.append("folderID", folderID);
    formData.append("file", file);
    formData.append("users", users);

    return axiosInstance.post("api/upload/fileinfolder", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        
      }
    })
  }
  renameFile(filetobeRenamed, newName, id){
    let fileIDnewNameUserID = [filetobeRenamed, newName, id];
     return axiosInstance.patch(`api/upload/renameFile/${fileIDnewNameUserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data",
        
      }
    })
    
      
  }

  renameFolder(foldertobeRenamed, newName, id){
    let folderIDnewNameUserID = [foldertobeRenamed, newName, id];
    return axiosInstance.patch(`api/upload/renameFolder/${folderIDnewNameUserID}`,{ },{
      headers:{
        
       
      }
  })
}


shareFile(fileToBeShared, mailshared, id){
  let fileIDmailAddedUserID = [fileToBeShared, mailshared, id];
  return axiosInstance.patch(`api/upload/addUserToFolder/${fileIDmailAddedUserID}`,{ },{
    headers:{
      
    }
  })
}
  uploadFolder(folderName, users){
    console.log(users);
    let formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("users",users);
    console.log(formData.get("folderName"));
    return axiosInstance.post("api/upload/folder", formData,{
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;",
        
      }
    })   
  }

  downloadFile(fileName){

    return axiosInstance.get(`api/upload/url/${fileName}`,{
      headers:{
        
      }
    })
  }

  getFilesWithinAFolder(folderid, userId){
    
    let folderiduserId=[folderid, userId];
    
    return axiosInstance.get(`api/upload/displayfileswithinfolder/${folderiduserId}`,{
      headers:{
        
      }
    });
  
  }

  getFolders(id){
    if(id)
      return axiosInstance.get(`api/upload/folder/${id["id"]}`,{
        headers:{
         
        }
      });
      
  }
  getFiles(id) {
    console.log(id["id"]);
     //alert(jwtToken);
    if(id)
      return axiosInstance.get(`api/upload/${id["id"]}`,{
        headers:{
         
        }
      });
  }
  updateFavouriteFiles(id){
    return axiosInstance
    .patch(`api/upload/files/${id}`,{ },{
      headers:{
        
       
      }
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }

  updateFavouriteFolders(id){
    return axiosInstance.patch(`api/upload/folder/${id}`,{ },{
      headers:{
               
      }
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }

  removeFileInAFolder(fileID, userID, folderID){
    let fileIDuserIDfolderID=[fileID, userID, folderID]
    return axiosInstance.delete(`api/upload/fileInFolder/${fileIDuserIDfolderID}`,{
      headers:{
       

      }
    })
  }
  
  removeFile(id){
    return axiosInstance.delete(`api/upload/${id}`,{
      headers:{
        
      }
    });
  }

  removeFolder(folderID){
    console.log(folderID)
    alert(folderID);
    return axiosInstance.delete(`api/upload/folder/${folderID}`, {
      headers:{
        
      }
    })
  }
}
export default new FileService();