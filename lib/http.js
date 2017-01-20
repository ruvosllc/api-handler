'use strict'

module.exports = apiMethod => (req, res, next) => {
  const handleErr = (err) => {
    if (err && err.status >= 400) {
      res.status(err.status).send(err.message)
    } else {
      next(err)
    }
  }

  try {
    return apiMethod(req)
    .then((apiResponse) => {
      res.json(apiResponse)
    }).catch(handleErr)
  } catch (err) {
    handleErr(err)
  }
}
