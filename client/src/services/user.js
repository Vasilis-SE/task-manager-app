import axios from "axios";

export default {
	async getUserData() {
		axios.get("http://localhost:3000/users/profile")
			.then((response) => {
				return {
					data: response.data,
					status: response.status
				};
			})
			.catch((error) => {
				return {
					data: error.data,
					status: error.status
				};
			})
	}
};