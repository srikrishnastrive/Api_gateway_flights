const express = require('express');
const { UserController } = require('../../controllers');
const {AuthRequestMiddlewares} = require('../../middlewares');



const userRoutes = express.Router();

userRoutes.post('/signup',AuthRequestMiddlewares.validateAuthRequest,UserController.createUser);
userRoutes.post('/signin',AuthRequestMiddlewares.validateAuthRequest,UserController.signIn);

module.exports = userRoutes;