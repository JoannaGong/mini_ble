const interfaces = require('../../utils/data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    planList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this

    wx.showLoading({
      title: '加载中...'
    })

    wx.request({
      header: {
        'content-type': 'application/json'
      },
      url: interfaces.listpage,
      success(res) {
        console.log(res)
        let planList = res.data;

        planList.forEach(item => {
          let point = "";
          let content = item.content;
          content.forEach(item => {
            point = point + item.id + ","
          })
          point = point.substring(0, point.length - 1)
          item.point = point;
        })

        this.planList = planList;
        wx.hideLoading()
      }
    })
  },

  handleClick(e) {
    // const index = e.currentTarget.dataset.index;
    // const id = this.data.cartArray[index].id
    const id = e.id
    const disabled = e.disabled === 0 ? 1 : 0;
    const msg = row.disabled === 0 ? '禁用成功' : '启用成功'
    const params = {
      id, disabled
    }
    let planList = this.planList;

    wx.request({
      header: {
        'content-type': 'application/json'
      },
      url: interfaces.setPlan,
      success(res) {
        console.log(res)
        planList.forEach(item => {
          if (item.id === id) {
            item.disabled = item.disabled === 0 ? 1 : 0;
            item.disabled_name = item.disabled === 0 ? "启用" : "禁用"
          } else {
            item.disabled = 1
            item.disabled_name = "禁用"
          }
        })
        this.planList = planList;
        Message({
          message: msg,
          type: 'success',
          duration: 2 * 1000
        })
        wx.hideLoading()
      }
    })
  },

  toCheck(e) {

  },

  toDel(e) {

  }


})