const App = require('./app')
const Response = require('./app/response')

exports.sendmail = event => {
    return App(event)
        .then(body => Response.ok(body))
        .catch(err => Response.error(err))
}
