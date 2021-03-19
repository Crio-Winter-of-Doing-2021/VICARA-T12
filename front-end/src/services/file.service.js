
import axiosInstance from '../axios'

class FileService{
  
  upload(file, users){
    let formData = new FormData();
    formData.append("file", file);
    formData.append("users", users)
    return axiosInstance.post("api/upload/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
          },
          // onUploadProgress,
    });    
  }

  getFiles(id) {
    return axiosInstance.get("api/upload/", id);
  }

  updateFavourite(id){
    return axiosInstance
    .patch(`api/upload/${id}`,{
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
}
export default new FileService();