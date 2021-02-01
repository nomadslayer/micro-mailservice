var fs = require('fs')
module.exports = (DB, body, apiKey) => new Promise(async (resolve, reject) => {
  try {

    const SQL = "INSERT INTO notification(`data`, api_key) VALUES ('" + JSON.stringify(body) + "', '" + apiKey + "')"
    const results = await DB.query(SQL)

    await DB.end()

    resolve(results.insertId)
  } catch (err) {
    console.log(err)
    err.msg  = 'Email is send, But fail to save the details.'
    err.code = 206
    reject(err)
  }
})
