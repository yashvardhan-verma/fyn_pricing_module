const express = require('express');
const userController = require('../controllers/userController')

const router = express.Router()

// Get users
router.get('/users', userController.getUser);
// Create new user
router.post('/users', userController.createUser);
// update user
router.patch('/users/:id', userController.updateUser);
// delete user
router.delete('/users/:id', userController.deleteUser);

module.exports = router