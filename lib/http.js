'use strict'

module.exports = (apiMethod) => {
  return (req, res, next) => apiMethod(req)
    .then((apiResponse) => {
      res.json(apiResponse || {})
  }).catch(next)
}
