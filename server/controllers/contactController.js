const Contact = require('../models/Contact')
const { validationResult } = require('express-validator')
const nodemailer = require('nodemailer')

const sendAcknowledgementEmail = async (contact) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT),
      secure: false,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: contact.email,
      subject: 'We received your message – Arlinjai Paradise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #08111F; padding: 25px; text-align: center;">
            <h1 style="font-family: Georgia; color: #C9A227; margin: 0;">ARLINJAI PARADISE</h1>
          </div>
          <div style="padding: 30px; background: white;">
            <p>Dear <strong>${contact.name}</strong>,</p>
            <p>Thank you for contacting us. We have received your message regarding <strong>"${contact.subject}"</strong>.</p>
            <p>Our team will get back to you within 24 hours. For urgent inquiries, please call us at <strong>9486271234</strong> or WhatsApp at <strong>+91 9486271234</strong>.</p>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #C9A227;">
              <p style="margin: 0; font-style: italic; color: #666;">"${contact.message}"</p>
            </div>
            <p style="color: #888; font-size: 13px;">Warm regards,<br/><strong>Arlinjai Paradise Team</strong><br/>No. 5/69, Beach Road, Kanyakumari</p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('Acknowledgement email failed:', err.message)
  }
}

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() })
    }

    const { name, email, phone, subject, message, inquiryType } = req.body

    const contact = await Contact.create({ name, email, phone, subject, message, inquiryType })

    // Send acknowledgement email (async)
    sendAcknowledgementEmail(contact)

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will reply within 24 hours.',
      contact,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all contacts (admin)
// @route   GET /api/contact
// @access  Private
const getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query
    const query = {}
    if (status) query.status = status

    const total = await Contact.countDocuments(query)
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    res.json({ success: true, count: contacts.length, total, contacts })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private
const getContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'read' },
      { new: true }
    )
    if (!contact) return res.status(404).json({ message: 'Contact not found' })
    res.json({ success: true, contact })
  } catch (error) {
    next(error)
  }
}

// @desc    Reply to contact
// @route   POST /api/contact/:id/reply
// @access  Private
const replyContact = async (req, res, next) => {
  try {
    const { replyText } = req.body
    const contact = await Contact.findById(req.params.id)
    if (!contact) return res.status(404).json({ message: 'Contact not found' })

    // Send reply email
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT),
        secure: false,
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      })

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: contact.email,
        subject: `Re: ${contact.subject} – Arlinjai Paradise`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #08111F; padding: 25px; text-align: center;">
              <h1 style="font-family: Georgia; color: #C9A227; margin: 0;">ARLINJAI PARADISE</h1>
            </div>
            <div style="padding: 30px; background: white;">
              <p>Dear <strong>${contact.name}</strong>,</p>
              <p>${replyText.replace(/\n/g, '<br/>')}</p>
              <p style="color: #888; font-size: 13px;">Warm regards,<br/><strong>Arlinjai Paradise Team</strong></p>
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Reply email failed:', emailErr.message)
    }

    contact.reply = { text: replyText, sentAt: new Date(), sentBy: req.user?.id }
    contact.status = 'replied'
    await contact.save()

    res.json({ success: true, message: 'Reply sent successfully' })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) return res.status(404).json({ message: 'Contact not found' })
    res.json({ success: true, message: 'Contact deleted' })
  } catch (error) {
    next(error)
  }
}

module.exports = { submitContact, getContacts, getContact, replyContact, deleteContact }
