const express = require('express')
const { getSettings, updateSettings } = require('../controllers/settingController')
const { protect } = require('../middleware/authMiddleware')
const { managerAndAbove } = require('../middleware/roleMiddleware')

const router = express.Router()

router.route('/')
  .get(getSettings)
  .put(protect, managerAndAbove, updateSettings)

module.exports = router
