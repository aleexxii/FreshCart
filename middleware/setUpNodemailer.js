const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER, // my Gmail address from env file
      pass: process.env.GMAIL_PASS, // my google app password from env file
    },
})

module.exports = transport