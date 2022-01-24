const express = require('express');
const router = express.Router();
const {getList, getDetail, newBlog, updateBlog, deleteBlog} = require("../controller/blog")
const {SuccessModel, ErrorModel} = require("../model/resModel")
const {format} = require('../utils/format')
const loginCheck = require('../middleware/loginCheck')

router.get('/list', loginCheck, (req, res, next) => {
  const author = req.query.author || ''
  const keyword = req.query.keyword || ''

  const result = getList(author, keyword)
  return result.then(listData => {
    listData.forEach(item => {
      item.createdTime = format(2, '-', item.time_stamp)
      item.editeTime = format(2, '-', item.edit_time_stamp)
      delete item.time_stamp
      delete item.edit_time_stamp
    })
    res.json(new SuccessModel(listData))
  })
})
router.get('/detail', loginCheck, (req, res, next) => {
  const id = req.query.id
  if (!id) {
    res.json(new ErrorModel('Id is required！'))
    return
  }
  const result = getDetail(id)
  return result.then(data => {
    data.createdTime = format(2, '-', data.time_stamp)
    data.editeTime = format(2, '-', data.edit_time_stamp)
    delete data.time_stamp
    delete data.edit_time_stamp
    res.json(new SuccessModel(data, 'success'))
  })

})
router.get('/delete', loginCheck, (req, res, next) => {
  const id = req.query.id
  if (!id) {
    res.json(new ErrorModel('Id is required！'))
    return
  }
  const author = req.session.username
  const result = deleteBlog(id, author)
  return result.then(data => {
    if (!data) {
      res.json(new ErrorModel('操作失败'))
      return
    }
    res.json(new SuccessModel('操作成功'))
  })
})
router.post('/update', loginCheck, (req, res, next) => {
  let {id, title, content} = req.body
  if (!id) {
    res.json(new ErrorModel('Id is required！'))
    return
  }
  if (!content) {
    content = null
  }
  if (!title) {
    title = null
  }
  const blogData = {
    content,
    title,
    author: req.session.username
  }
  const result = updateBlog(id, blogData)
  return result.then(data => {
    if (!data) {
      res.json(new ErrorModel('操作失败'))
      return
    }
    res.json(new SuccessModel('操作成功'))
  })
})
router.post('/new', loginCheck, (req, res, next) => {
  const {title, content} = req.body
  if (!title) {
    res.json(new ErrorModel('Title is required!'))
  }
  const blogData = {
    title,
    content,
    author: req.session.username
  }
  const result = newBlog(blogData)
  return result.then(data => {
    res.json(new SuccessModel(data, '操作成功'))
  })
})

module.exports = router
