const express = require('express');
const apiRouter = express.Router();

const { handleRegister } = require('../controllers/register');
const { handleSignin } = require('../controllers/signin');
const { handleApiCall, handleImage } = require('../controllers/image.apicall');


apiRouter.post('/signin', handleSignin);

apiRouter.post('/register', handleRegister);

apiRouter.post('/imageurl', handleApiCall);

apiRouter.put('/image', handleImage);

module.exports = apiRouter;