
import axiosInstance from '../axios'

class UploadService{
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
}
export default new UploadService();