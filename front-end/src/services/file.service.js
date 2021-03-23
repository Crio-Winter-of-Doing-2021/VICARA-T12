
import axiosInstance from '../axios'

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

  uploadFolder(folderName, users){
    alert(folderName);
    console.log(users);
    let formData = new FormData();
    formData.append("folderName", folderName);
    formData.append("users",users);
    console.log(formData.get("folderName"));
    return axiosInstance.post("api/upload/folder", formData,{
      headers: {
        "Content-Type": "multipart/form-data; charset=utf-8;"
      }
    })   
  }

  getFolders(id){
    if(id)
      return axiosInstance.get(`api/upload/folder/${id["id"]}`);
  }
  getFiles(id) {
    console.log(id["id"]);
    if(id)
      return axiosInstance.get(`api/upload/${id["id"]}`);
  }
  updateFavouriteFiles(id){
    return axiosInstance
    .patch(`api/upload/files/${id}`,{
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }

  updateFavouriteFolders(id){
    return axiosInstance
    .patch(`api/upload/folder/${id}`,{
    })
    .then(response => { 
      console.log(response)
   })
    .catch(error => {
      console.log(error);
    });
  }
  
  removeFile(id){
    return axiosInstance.delete(`api/upload/${id}`);
  }

  removeFolder(folderID){
    console.log(folderID)
    alert(folderID);
    return axiosInstance.delete(`api/upload/folder/${folderID}`)
  }
}
export default new FileService();