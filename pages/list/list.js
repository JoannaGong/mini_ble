const interfaces = require('../../utils/data.js')
var app = getApp();

Page({
  data: {
    planList: [],
    id: '',
    disabled: '',
    disabled_name: '',
    noData: false   // 是否有更多数据
  },

  onShow: function () {
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
        self.setData({
          planList: res.data.data
        })
        wx.hideLoading()
      }
    })
  },

  // 启用/禁用切换
  handleClick(e) {
    const self = this
    const msg = e.currentTarget.dataset.disabled === 0 ? '禁用成功' : '启用成功'
    let planList = self.data.planList
    const disabled = e.currentTarget.dataset.disabled === 0 ? 1 : 0
    const id = e.currentTarget.dataset.id
    const params = {
      id,disabled
    }
    
    // 将某个方案里具体id值连接成字符串，并以z开头，以;结尾
    const content = e.currentTarget.dataset.content
    const index = e.currentTarget.dataset.index
    let temp = [];
    content.forEach(item => {
      temp.push(item.id)
    })

    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params,
      url: interfaces.setPlan,
      success(res) {
        planList.forEach(item => {
          if (item.id === id) {
            item.disabled = item.disabled === 0 ? 1 : 0
            item.disabled_name = item.disabled === 0 ? '启用' : '禁用'
          }else {
            item.disabled = 1
            item.disabled_name = "禁用"
          }
        })
        self.setData({
          planList: planList,
        })
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 1000
        })

        if(planList[index].disabled === 0){
          getApp().globalData.orderPlan = 'z' + temp.join(",") + ',;'
          wx.switchTab({
            url: '../functionPage/functionPage',
          })
        }
        wx.hideLoading()
      }
    })
  },

  // 修改
  toCheck(e) {
    getApp().globalData.planId = e.currentTarget.dataset.id
    getApp().globalData.pointIdArr = e.currentTarget.dataset.content
    getApp().globalData.planName = e.currentTarget.dataset.name
    wx.switchTab({
      url: '../plan/plan',
      success(res){
        // console.log(res)
      }
    })
  },

  // 删除
  toDel(e) {
    const self = this;
    wx.showModal({
      content: '确定要删除该方案吗？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({ title: '正在删除' });
          wx.request({
            url: interfaces.delPlan + e.currentTarget.dataset.id,
            data: {
              id: e.currentTarget.dataset.id
            },
            method: 'delete',
            success(res) {
              if (res.statusCode === 200) {
                wx.showToast({
                  title: '删除成功！',
                  icon: 'success',
                  duration: 2000
                })
                let index = self.data.planList.findIndex(item => item.id === e.currentTarget.dataset.id)
                let planList = self.data.planList
                planList.splice(index, 1)
                self.setData({
                  planList: planList
                })
              }
            }
          })
        }
      }
    })
  }
})