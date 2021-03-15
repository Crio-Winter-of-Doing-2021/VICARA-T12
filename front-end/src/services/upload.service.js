
import axiosInstance from '../axios'

class UploadService{
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
}
export default new UploadService();