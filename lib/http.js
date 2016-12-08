'use strict'

module.exports = (apiMethod) => {
  return (req, res, next) => apiMethod(req)
  .then((apiResponse) => {
    res.json(apiResponse)
  }).catch((err) => {
    if (err && err.status >= 400) {
      res.status(err.status).send(err.message)
    } else {
      next(err)
    }
  })
}
