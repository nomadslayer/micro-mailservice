const async = require('async')
const AWS = require('aws-sdk')

const bucket = new AWS.S3({
  region: process.env.BUCKET_REGION,
  params: {
    Bucket: process.env.BUCKET_NAME
  }
})

module.exports = body => new Promise((resolve, reject) => {
  setAttachments(body.attachments)
    .then(bodyAttachments => {
      body.attachments = bodyAttachments
      resolve(body)
    })
    .catch(reject)
})

function setAttachments (bodyAttachments) {
  return new Promise((resolve, reject) => {
    let attachments = []
    async.each(bodyAttachments, (attachment, callback) => {
      getObject(attachment.key)
        .then(data => {
          if (data) {
            attachments.push({
              filename: attachment.filename,
              content: data.Body,
              cid: attachment.cid || null
            })
          }
          return null
        })
        .then(() => callback())
        .catch(callback)
    }, err => {
      if (err) {
        reject(err)
      } else {
        resolve(attachments)
      }
    })
  })
}

function getObject (Key) {
  return new Promise((resolve, reject) => {
    bucket.getObject({ Key }, (err, data) => {
      if (err) {
        err.msg = 'Error during getting attachment object'
        err.code = 500
        err.extra = {Key}
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
