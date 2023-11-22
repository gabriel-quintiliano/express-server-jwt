// So environment is configure according to .env file (or something like that)
require('dotenv').config()

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')

// makes the application use the json passed in the body of the request
app.use(express.json())

const posts = [
	{
		username: "gabriel",
		title: "post 1"
	},
	{
		username: "silvia",
		title: "post 2"
	}
]

const post = ["só um post man"]

app.get('/posts', authenticateToken, (req, res) => {
	console.log(req)
	res.json(posts.filter(post => post.username === req.user.name))
})

app.post('/login', (req, res) => {
	// Authenticate user

	const username = req.body.username;
	const user = { name: username }

	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
	res.json({ accessToken: accessToken })
})

function authenticateToken(req, res, next) {

	const authHeaderAuthorizationValue = req.rawHeaders.find(elem => elem.includes('Bearer'))

	// is there is an authorization header its format will be:
	// Bearer the_JWT_token 
	// hence we're splitting it according to the ' ' -> ['Bearer', 'the_JWT_token']
	// and taking the 2nd elem of the array, the token
	// if there is no authHeader, token will be null
	const token = authHeaderAuthorizationValue && authHeaderAuthorizationValue.split(' ')[1]
	console.log(token)

	if (token == null) return res.sendStatus(401) // no token provided

	// if it's past the if statement, then we know a token was provided
	// and so we can try and authenticate it
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403) // not a valid token

		// if there was no error, then we have a valid token
		req.user = user;
		console.log('user: ', user)
		next()
	})

}

app.listen(3000)