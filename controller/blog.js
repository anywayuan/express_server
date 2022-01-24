const {exec} = require("../db/mysql")
const xss = require('xss')

// 列表
const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `
  if (author) {
    sql += `and author="${author}" `
  }
  if (keyword) {
    sql += `and title like "%${keyword}%" `
  }
  sql += `order by time_stamp desc;`
  return exec(sql)
}
// 详情
const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`
  return exec(sql).then(rows => {
    return rows[0]
  })
}
// 新建
const newBlog = (blogData = {}) => {
  // 预防xss攻击
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createTime = Date.now()

  const sql = `insert into blogs (title, content, time_stamp, author, edit_time_stamp) values ('${title}', '${content}', ${createTime}, '${author}', '${createTime}');`
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}
// 更新
const updateBlog = (id, blogData = {}) => {
  const {title, content} = blogData
  const edit_time_stamp = new Date().getTime()
  const sql = `update blogs set title='${title}', content='${content}', edit_time_stamp='${edit_time_stamp}' where id=${id} and author='${blogData.author}'`
  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}
// 删除
const deleteBlog = (id, author) => {
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  return exec(sql).then(deleteData => {
    if (deleteData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  deleteBlog
}
