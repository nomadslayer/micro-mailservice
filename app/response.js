const _ = require('lodash')

module.exports = {
  ok: body => ({
    statusCode: 200,
    headers: {
      /* Required for CORS support to work */
      'Access-Control-Allow-Origin': '*',
      /* Required for cookies, authorization headers with HTTPS */
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  }),

  error: err => {
    let msg = err.toString()
    let statusCode = 500

    if (!_.isEmpty(_.trim(err.msg))) {
      msg = err.msg
    }

    if (!isNaN(parseInt(err.code))) {
      statusCode = err.code
    }

    return {
      statusCode,
      headers: {
        /* Required for CORS support to work */
        'Access-Control-Allow-Origin': '*',
        /* Required for cookies, authorization headers with HTTPS */
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ msg })
    }
  }

}
