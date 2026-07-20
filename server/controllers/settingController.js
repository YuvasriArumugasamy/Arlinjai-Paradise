const Settings = require('../models/Settings')

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'global' })
    if (!settings) {
      settings = await Settings.create({ key: 'global', isPeakSeason: false, gstRate: 12 })
    }
    res.json({ success: true, settings })
  } catch (error) {
    next(error)
  }
}

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private (Admin/Manager)
const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ key: 'global' })
    if (!settings) {
      settings = new Settings({ key: 'global' })
    }

    const { isPeakSeason, gstRate, specialPrices, standardCheckInTime, standardCheckOutTime, earlyCheckInFee, lateCheckOutFee } = req.body

    if (isPeakSeason !== undefined) settings.isPeakSeason = isPeakSeason
    if (gstRate !== undefined) settings.gstRate = Number(gstRate)
    if (specialPrices !== undefined) settings.specialPrices = specialPrices
    if (standardCheckInTime !== undefined) settings.standardCheckInTime = standardCheckInTime
    if (standardCheckOutTime !== undefined) settings.standardCheckOutTime = standardCheckOutTime
    if (earlyCheckInFee !== undefined) settings.earlyCheckInFee = Number(earlyCheckInFee)
    if (lateCheckOutFee !== undefined) settings.lateCheckOutFee = Number(lateCheckOutFee)

    await settings.save()

    res.json({ success: true, message: 'Settings updated successfully', settings })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSettings,
  updateSettings,
}
