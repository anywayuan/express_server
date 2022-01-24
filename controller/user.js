const {exec, escape} = require("../db/mysql")
const {genPassword} = require('../utils/cryp')

const userLogin = (username, password) => {
  // 预防sql注入
  username = escape(username)
  password = escape(password)

  // 密码加密
  password = genPassword(password)

  const sql = `select 
                id, username, realname, mobile, time_stamp, sex 
                from users 
                where 
                username=${username} and password='${password}';`
  return exec(sql).then(rows => {
    return rows[0] || {}
  })
}

module.exports = {
  userLogin
}
