const express = require('express');
const router = express.Router();

const {userLogin} = require("../controller/user")
const {SuccessModel, ErrorModel} = require("../model/resModel")
const {format} = require('../utils/format')
const {json} = require('express')

// login
router.post('/login', function (req, res, next) {
  const {username, password} = req.body
  if (!username) return res.json(new ErrorModel("Login name cannot be empty!"))
  if (!password) return res.json(new ErrorModel("Login password cannot be empty!"))

  const result = userLogin(username, password)
  return result.then(data => {
    if (data.username) {
      // set session
      req.session.username = data.username
      req.session.realname = data.realname
      req.session.userId = data.id

      let userCreateDate = format(2, '-', Number(data.time_stamp))
      data.userCreateDate = userCreateDate
      delete data.time_stamp

      return res.json(new SuccessModel(data, 'Login succeeded!'))
    }
    res.json(new ErrorModel("Login failed!"))
  })
});
// Log out
router.post('/logout', (req, res, next) => {
  res.json(new SuccessModel('退出登录'))
})
// validate logon
router.get('/login-test', (req, res, next) => {
  if (req.session.username) {
    let session = req.session
    res.json(new SuccessModel("Logged in"))
    return
  }
  res.json(new ErrorModel("Not logged in!"))
})
module.exports = router;
