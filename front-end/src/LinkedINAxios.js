import axios from 'axios';
// Defining a base url so can be called 
const baseURL = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))';

const axiosLinkdeInInstance = axios.create({
	baseURL: baseURL,
		headers: {
		'Authorization': 'Bearer AQXWNTmfO3YCqbR9WfSLjFHB7fiZEiEyKgA1Xj4-so4gqLdzEWIMl0V4cAEd7KnivezZh3g4nrEDaRE4YRc37Rb6WXV06B2kne5YIv1YH2etJNRFVB3bj2Sd_e66mx2j9dRx2Cq9KoyC43d1CBTAfo_uwB_AH6R_uWZTWeV7uzWDqoj4XCAH5W3v4gkr8GatEr7OK92M6XNQT5oA--2fohviFBk_ZLrOa_vrhJ0Ja_lhhkiOS-ga1M0JQPVrutl62aCZqirtzunXQZzBDG-s9EcOeyqzDSkwc3aHlxcA5NE-ijyx8SUqwooCeZr_N7OwNdij-M2xdc_qspiRJMne2xJwRYxFCw',
	}, 
});

export default axiosLinkdeInInstance;