const express = require('express')
const { getUsers, getUser, updateUser, deleteUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const { adminOnly } = require('../middleware/roleMiddleware')

const router = express.Router()

router.route('/')
  .get(protect, adminOnly, getUsers)

router.route('/:id')
  .get(protect, adminOnly, getUser)
  .put(protect, adminOnly, updateUser)
  .delete(protect, adminOnly, deleteUser)

module.exports = router
