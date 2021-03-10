import axios from 'axios';
// Defining a base url so can be called 
const baseURL = 'http://localhost:8080/';

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json',
		accept: 'application/json',
	}, 
});

export default axiosInstance;