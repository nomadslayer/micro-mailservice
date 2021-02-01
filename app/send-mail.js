module.exports = (transport, body) => new Promise((resolve, reject) => {
  transport.sendMail(body, (err, response) => {
    if (err) {
      console.log(err)
      err.msg = 'Error during sending the email. Please re-try again'
      err.extra = {body}
      reject(err)
    } else {
      resolve(response)
    }
  })
})
