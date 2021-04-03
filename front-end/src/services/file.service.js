
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
        "Content-Type": "multipart/form-data; charset=utf-8;",
       
      }
  })
}


shareFile(fileToBeShared, mailshared, id){
  let fileIDmailAddedUserID = [fileToBeShared, mailshared, id];
  return axiosInstance.patch(`api/upload/addUserToFolder/${fileIDmailAddedUserID}`,{ },{
    headers:{
      "Content-Type": "multipart/form-data; charset=utf-8;",
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

  downloadFile(fileName, userDetails){
    let fileNameUserDetails = [fileName, userDetails]
    return axiosInstance.get(`api/upload/url/${fileNameUserDetails}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    })
  }

  getFilesWithinAFolder(folderid, userId){
    
    let folderiduserId=[folderid, userId];
    
    return axiosInstance.get(`api/upload/displayfileswithinfolder/${folderiduserId}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    });
  
  }

  getFolders(id){
    if(id)
      return axiosInstance.get(`api/upload/folder/${id["id"]}`,{
        headers:{
          "Content-Type": "multipart/form-data; charset=utf-8;",
        }
      });
      
  }
  getFiles(id) {
    console.log(id["id"]);
     //alert(jwtToken);
    if(id)
      return axiosInstance.get(`api/upload/${id["id"]}`,{
        headers:{
          "Content-Type": "multipart/form-data; charset=utf-8;",
        }
      });
  }
  updateFavouriteFiles(fileID, userID){
    let fileIDUserID = [fileID, userID];
    return axiosInstance
    .patch(`api/upload/files/${fileIDUserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
       
      }
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }

  updateFavouriteFolders(folderID, userID){
    let folderIDuserID = [folderID, userID];
    return axiosInstance.patch(`api/upload/folder/${folderIDuserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",    
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
    let fileIDuserIDfolderID=[fileID, userID, folderID].join('&');
    
    return axiosInstance.delete(`api/upload/fileInFolder/${fileIDuserIDfolderID}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",

      }
    })
  }
  
  removeFile(id, userID){
    let fileIDuserID = [id, userID];
    return axiosInstance.delete(`api/upload/${fileIDuserID}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    });
  }

  removeFolder(folderID, userID){
    let folderIDuserID = [folderID, userID]
    alert(folderID);
    return axiosInstance.delete(`api/upload/folder/${folderIDuserID}`, {
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    })
  }
}
export default new FileService();