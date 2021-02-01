const _ = require('lodash')
//const Sentry = require('@sentry/node')
const AWS = require('aws-sdk')
const nodemailer = require('nodemailer')
const mysql = require('mysql')

/*if (!_.isEmpty(process.env.SENTRY_ID)) {
  Sentry.init({
    dsn: process.env.SENTRY_ID,
    environment: process.env.ENVIRONMENT || 'DEVELOPMENT'
  })
}*/

const ParseJSON = require('./parse-json')
const Validations = require('./validations')
const Attachments = require('./attachments')
const Sendmail = require('./send-mail')
const Audit = require('./audit')

module.exports = context => new Promise(async (resolve, reject) => {
  try {
    const apiKey = context.headers['x-api-key']
    //Sentry.configureScope(scope => scope.setUser({id: apiKey}))

    const SES = new AWS.SES({region: process.env.SES_REGION})
    let transport = nodemailer.createTransport({SES})
    const DB = mysql.createConnection({
      user: process.env.DBUSER,
      host: process.env.DBHOST,
      database: process.env.DBNAME,
      password: process.env.DBPASSWORD,
      port: 3306,
      multipleStatements: true
    })

    await DB.connect()

    let body = await ParseJSON(context.body)
    body = await Validations(body)
    body = await Attachments(body)

    body.response = await Sendmail(transport, body)
    body.response.audit_id = await Audit(DB, body, apiKey)
    console.log(body.response)
    resolve(body.response)
  } catch (err) {
    /*Sentry.withScope(scope => {
      if (err.extra) {
        _.each(err.extra, (value, key) => {
          scope.setExtra(key, value)
        })
      }
      Sentry.captureException(err)
    })*/

    reject(err)
  }
})
