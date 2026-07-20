const Settings = require('../models/Settings')

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res, next) => {
  try {
    let settingsDoc = await Settings.findOne({ key: 'global' }).lean()
    if (!settingsDoc) {
      settingsDoc = await Settings.create({
        key: 'global',
        isPeakSeason: false,
        gstRate: 12,
        standardCheckInTime: '11:00',
        standardCheckOutTime: '09:00',
        earlyCheckInFee: 500,
        lateCheckOutFee: 500,
      })
      settingsDoc = settingsDoc.toObject ? settingsDoc.toObject() : settingsDoc
    }
    const settings = {
      key: 'global',
      isPeakSeason: false,
      gstRate: 12,
      standardCheckInTime: '11:00',
      standardCheckOutTime: '09:00',
      earlyCheckInFee: 500,
      lateCheckOutFee: 500,
      ...settingsDoc,
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
    const {
      isPeakSeason,
      gstRate,
      specialPrices,
      standardCheckInTime,
      standardCheckOutTime,
      earlyCheckInFee,
      lateCheckOutFee,
    } = req.body

    const updateFields = {}
    if (isPeakSeason !== undefined) updateFields.isPeakSeason = Boolean(isPeakSeason)
    if (gstRate !== undefined) updateFields.gstRate = Number(gstRate)
    if (specialPrices !== undefined) updateFields.specialPrices = specialPrices
    if (standardCheckInTime !== undefined) updateFields.standardCheckInTime = String(standardCheckInTime)
    if (standardCheckOutTime !== undefined) updateFields.standardCheckOutTime = String(standardCheckOutTime)
    if (earlyCheckInFee !== undefined) updateFields.earlyCheckInFee = Number(earlyCheckInFee)
    if (lateCheckOutFee !== undefined) updateFields.lateCheckOutFee = Number(lateCheckOutFee)

    const settings = await Settings.findOneAndUpdate(
      { key: 'global' },
      { $set: updateFields },
      { new: true, upsert: true, runValidators: true }
    )

    res.json({ success: true, message: 'Settings updated successfully', settings })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getSettings,
  updateSettings,
}
