const express = require('express');
const { UserController } = require('../../controllers');



const userRoutes = express.Router();

userRoutes.post('/',UserController.createUser);

module.exports = userRoutes;