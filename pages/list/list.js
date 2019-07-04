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
      success(res){
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})