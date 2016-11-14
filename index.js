'use strict'

const http = (apiMethod) => {
   return (req, res, next) => apiMethod(req)
   .then((apiResponse) => {
      res.json(apiResponse || {})
   }).catch(next)
}

module.exports = {
   http
}
