'use strict'

module.exports = apiMethod => (req, res, next) => {
  const handleErr = (err) => {
    if (err && err.status >= 400) {
      res.status(err.status).send(err.message)
    } else {
      next(err)
    }
  }

  const handleResolution = (resolution) => {
    if (resolution && resolution.status && typeof resolution.status === 'number') {
      res.status(resolution.status)
      delete resolution.status
    }
    if (resolution && resolution.data) {
      res.json(resolution.data)
    } else {
      res.json(resolution)
    }
  }

  try {
    return apiMethod(req)
      .then(handleResolution)
      .catch(handleErr)
  } catch (err) {
    handleErr(err)
  }
}
