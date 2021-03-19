
import axiosInstance from '../axios'

class FileService{
    async upload(file, users){
        let formData = new FormData();
        formData.append("file", file);
        formData.append("users", users)
        return await axiosInstance.post("api/upload/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
              },
             // onUploadProgress,
        });    
    }
    async getFiles(id) {
        return await axiosInstance.get("api/upload/", id);
      }
    async updateFavourite(id, value){
          return await axiosInstance
          .patch(`api/upload/${id}`,{
            favourite: value,
          })
          .then(response => { 
            console.log(response)
        })
        .catch(error => {
            console.log(error);
        });
      }

      async removeFile(id){
         alert(id);
          return await axiosInstance.delete(`api/upload/${id}`);
      }
}
export default new FileService();