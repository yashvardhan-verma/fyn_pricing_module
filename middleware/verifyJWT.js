//impementing middleware using jwt only those user can access who have tocken
const jwt = require('jsonwebtoken')
const userModel = require('../models/userModel')
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || 'yashvardhan';


module.exports = {
  verifyToken: (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
      return res.status(401).json({ error: "you must be logged in" })
    }
    const token = authorization
    jwt.verify(token, JWT_SECRET, (err, payload) => {
      if (err) {
        return res.status(401).json({ error: "you must be logged in" })
      }
      const { id } = payload
      userModel.findById(id).lean().then(userdata => {
        if (userdata === null) {
          return res.status(401).json({ error: "Token is invalid" })
        }
        if (userdata.jwtToken.includes(token)) {
          userdata.jwtToken = [token];
          req.user = userdata
          next()
        } else {
          return res.status(401).json({ error: "Token is invalid" })
        }
      })

    })
  }
}
