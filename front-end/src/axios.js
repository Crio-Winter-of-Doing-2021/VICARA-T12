import axios from 'axios';
// Defining a base url so can be called 
const baseURL = 'https://vicara-storage-drive.herokuapp.com/';
const axiosInstance = axios.create({
	baseURL: baseURL,
		headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 
	crossdomain: true ,
	withCredentials: true,

});

export default axiosInstance;