module.exports = body => new Promise(resolve => {
  try {
    resolve(JSON.parse(body))
  } catch (e) {
    resolve(body)
  }
})
