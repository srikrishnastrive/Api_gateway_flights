const express = require('express');
const { UserController } = require('../../controllers');



const userRoutes = express.Router();

userRoutes.post('/signup',UserController.createUser);
userRoutes.post('/signin',UserController.signIn);

module.exports = userRoutes;