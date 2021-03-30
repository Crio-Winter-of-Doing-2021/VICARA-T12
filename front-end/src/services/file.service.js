
import axiosInstance from '../axios'

class FileService{
  
  upload(jwtToken, file, users){
    let formData = new FormData();
    formData.append("file", file);
    formData.append("users", users);
    return axiosInstance.post("api/upload/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `${jwtToken}`
          },
          // onUploadProgress,
    });    
  }

  uploadFilesInFolder(jwtToken, folderID, file, users){
    let formData = new FormData();
    formData.append("folderID", folderID);
    formData.append("file", file);
    formData.append("users", users);

    return axiosInstance.post("api/upload/fileinfolder", formData,{
      headers: {
        "Content-Type": "multipart/form-data",
        'Authorization': `${jwtToken}`
      }
    })
  }
  renameFile(jwtToken, filetobeRenamed, newName, id){
    let fileIDnewNameUserID = [filetobeRenamed, newName, id];
     return axiosInstance.patch(`api/upload/renameFile/${fileIDnewNameUserID}`,{ },{
      headers:{
        
        'Authorization': `${jwtToken}`
      }
    })
    
      
  }
  uploadFolder(jwtToken,folderName, users){
    console.log(users);
    let formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("users",users);
    console.log(formData.get("folderName"));
    return axiosInstance.post("api/upload/folder", formData,{
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;",
        'Authorization': `${jwtToken}`
      }
    })   
  }

  downloadFile(jwtToken, fileName){

    return axiosInstance.get(`api/upload/url/${fileName}`,{
      headers:{
        'Authorization': `${jwtToken}`
      }
    })
  }

  getFilesWithinAFolder(jwtToken, folderid, userId){
    
    let folderiduserId=[folderid, userId];
    
    return axiosInstance.get(`api/upload/displayfileswithinfolder/${folderiduserId}`,{
      headers:{
        'Authorization': `${jwtToken}`
      }
    });
  
  }

  getFolders(jwtToken, id){
    if(id)
      return axiosInstance.get(`api/upload/folder/${id["id"]}`,{
        headers:{
          'Authorization': `${jwtToken}`
        }
      });
      
  }
  getFiles(jwtToken,id) {
    console.log(id["id"]);
     //alert(jwtToken);
    if(id)
      return axiosInstance.get(`api/upload/${id["id"]}`,{
        headers:{
          'Authorization': `${jwtToken}`
        }
      });
  }
  updateFavouriteFiles(jwtToken,id){
    return axiosInstance
    .patch(`api/upload/files/${id}`,{ },{
      headers:{
        
        'Authorization': `${jwtToken}`
      }
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }

  updateFavouriteFolders(jwtToken,id){
    return axiosInstance.patch(`api/upload/folder/${id}`,{ },{
      headers:{
               'Authorization': `${jwtToken}`
      }
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }

  removeFileInAFolder(jwtToken,fileID, userID, folderID){
    let fileIDuserIDfolderID=[fileID, userID, folderID]
    return axiosInstance.delete(`api/upload/fileInFolder/${fileIDuserIDfolderID}`,{
      headers:{
        'Authorization': `${jwtToken}`

      }
    })
  }
  
  removeFile(jwtToken,id){
    return axiosInstance.delete(`api/upload/${id}`,{
      headers:{
        'Authorization': `${jwtToken}`
      }
    });
  }

  removeFolder(jwtToken,folderID){
    console.log(folderID)
    alert(folderID);
    return axiosInstance.delete(`api/upload/folder/${folderID}`, {
      headers:{
        'Authorization': `${jwtToken}`
      }
    })
  }
}
export default new FileService();