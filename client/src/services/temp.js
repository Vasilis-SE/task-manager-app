import axios from 'axios'

export default() => {
	return axios
		.get('http://localhost:3000/status')
		.then(response => {
			console.log(response.data.message);
		})
		.catch(e => {
			console.log(e);a
		})
};