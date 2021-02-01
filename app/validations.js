const _ = require('lodash')
const htmlToText = require('html-to-text')

module.exports = body => new Promise(resolve => {

  if (_.isEmpty(_.trim(body.html))) {
    let err = new Error('HTML is required!')
    err.code = 400
    throw err
  } else if (_.isEmpty(_.trim(body.subject))) {
    let err = new Error('Subject of the email is required!')
    err.code = 400
    throw err
  }

  if (_.isEmpty(_.trim(body.from))) {
    body.from = process.env.MAIL_FROM
  }

  if (_.isEmpty(_.trim(body.text))) {
    body.text = htmlToText.fromString(body.html)
  }

  resolve(body)
})
