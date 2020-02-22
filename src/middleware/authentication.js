const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (request, response, next) => {
	try {
		let token = request.header('Authorization').replace('Bearer', '').trim();
		let decodedToken = jwt.verify(token, '4!L4pL9W@LqtgL*3Q@cg');

		// Fetch the user which token matches the on that the client send and that it is
		// one of the stored tokens from the tokens array that the user has (tokens.token: token).
		let user = await User.findOne({_id: decodedToken._id, 'tokens.token': token});

		if(!user) {
			throw new Error(); // Dont need message cause when throw it will catch the error bellow
		}

		request.token = token;
		request.user = user;
		next();
	} catch(err) {
		response.status(401).send({error: "Please authenticate!"});
	}
}

module.exports = auth;