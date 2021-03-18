import axios from 'axios';
// Defining a base url so can be called 
const baseURL = 'http://localhost:3000/';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeOut:10000,
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 
});

export default axiosInstance;