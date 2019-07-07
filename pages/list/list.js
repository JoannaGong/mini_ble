const interfaces = require('../../utils/data.js')

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
    let index = e.currentTarget.dataset.index
    let planList = self.data.planList
    planList.forEach(item => {
      if (item.id === e.currentTarget.dataset.id) {
        item.disabled = e.currentTarget.dataset.disabled === 0 ? 1 : 0
        item.disabled_name = e.currentTarget.dataset.disabled === 1 ? '启用' : '禁用'
      }
    })
    wx.request({
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        id: e.currentTarget.dataset.id,
        disabled: planList[index].disabled
      },
      url: interfaces.setPlan,
      success(res) {
        self.setData({
          planList: planList,
        })
        wx.hideLoading()
      }
    })
  },

  // 修改
  toCheck(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      // url: interfaces.listpage + '?id=' + id
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
              if (res.statusCode != 200) {
                return;
              } else {
                wx.showToast({
                  title: '删除成功！',
                  icon: 'success',
                  duration: 2000
                })
              }
              self.setData({
                planList: res.data.data
              })
            }
          })
        }
      }
    })
  }
})