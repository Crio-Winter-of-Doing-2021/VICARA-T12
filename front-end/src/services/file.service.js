
import axiosInstance from '../axios'

class FileService{
  
  upload(file, users){
    let formData = new FormData();
    formData.append("file", file);
    formData.append("users", users);
    return axiosInstance.post("api/file/upload", formData, {
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

    return axiosInstance.post("api/folder/uploadFile", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        
      }
    })
  }

  renameFile(filetobeRenamed, newName, id){
    let fileIDnewNameUserID = [filetobeRenamed, newName, id];
     return axiosInstance.patch(`api/file/rename/${fileIDnewNameUserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data",
        
      }
    })
  }

  renameFolder(foldertobeRenamed, newName, id){
    let folderIDnewNameUserID = [foldertobeRenamed, newName, id];
    return axiosInstance.patch(`api/folder/rename/${folderIDnewNameUserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;", 
      }
  })
}

shareFile(access, fileToBeShared, mailshared, id){
  let accessFileIDmailAddedUserID = [access,fileToBeShared, mailshared, id];
  return axiosInstance.patch(`api/file/addUser/${accessFileIDmailAddedUserID}`,{ },{
    headers:{
      "Content-Type": "multipart/form-data; charset=utf-8;",
    }
  })
}
removeAccess(fileId, userDetails){
  let fileIDuserID =[fileId, userDetails];
  return axiosInstance.patch(`api/file/removeUser/${fileIDuserID}`,{},{
    headers:{
      "Content-Type": "multipart/form-data; charset=utf-8;",
    }
  })
}
shareFolder(access, folderToBeShared, mailshared, id){
  let accessFolderIDmailAddedUserID = [access,folderToBeShared, mailshared, id];
  return axiosInstance.patch(`api/folder/addUser/${accessFolderIDmailAddedUserID}`,{ },{
    headers:{
      "Content-Type": "multipart/form-data; charset=utf-8;",
    }
  })
}

getSharedFiles(userID){
  return axiosInstance.get(`api/file/shareView/${userID}`,{
    headers:{
      "Content-Type": "multipart/form-data; charset=utf-8;",
    }
  })
}
  uploadFolder(folderName, users){
 
    let formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("users",users);
    return axiosInstance.post("api/folder/upload", formData,{
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    })   
  }

  openFile(fileName, userDetails){
    let fileNameUserDetails = [fileName, userDetails]
    return axiosInstance.get(`api/file/getPresignedUrl/${fileNameUserDetails}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    })
  }

  downloadFile(fileName, userDetails){
    let fileNameUserDetails = [fileName, userDetails]
    return axiosInstance.get(`api/file/download/${fileNameUserDetails}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    })
  }

  getFilesWithinAFolder(folderid, userId){
    
    let folderiduserId=[folderid, userId];
    
    return axiosInstance.get(`api/folder/getFiles/${folderiduserId}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    });
  
  }

  getFolders(id){
    if(id)
      return axiosInstance.get(`api/folder/get/${id["id"]}`,{
        headers:{
          "Content-Type": "multipart/form-data; charset=utf-8;",
        }
      });
      
  }
  getFiles(id) {
  
    
    if(id)
      return axiosInstance.get(`api/file/get/${id["id"]}`,{
        headers:{
          "Content-Type": "multipart/form-data; charset=utf-8;",
        }
      });
  }
  updateFavouriteFiles(fileID, userID){
    let fileIDUserID = [fileID, userID];
    return axiosInstance
    .patch(`api/file/favourite/${fileIDUserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
       
      }
    })
    .then(response => { 
  
   })
    .catch(error => {

    });
  }

  updateFavouriteFolders(folderID, userID){
    let folderIDuserID = [folderID, userID];
    return axiosInstance.patch(`api/folder/favourite/${folderIDuserID}`,{ },{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",    
      }
    })
    .then(response => { 
  
   })
    .catch(error => {

    });
  }

  removeFileInAFolder(fileID, userID, folderID){
    let fileIDuserIDfolderID=[fileID, userID, folderID].join('&');
    
    return axiosInstance.delete(`api/folder/deletefile/${fileIDuserIDfolderID}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",

      }
    })
  }
  
  removeFile(id, userID){
    let fileIDuserID = [id, userID];
    return axiosInstance.delete(`api/file/delete/${fileIDuserID}`,{
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    });
  }

  removeFolder(folderID, userID){
    let folderIDuserID = [folderID, userID]
  
    return axiosInstance.delete(`api/folder/delete/${folderIDuserID}`, {
      headers:{
        "Content-Type": "multipart/form-data; charset=utf-8;",
      }
    })
  }
}
export default new FileService();