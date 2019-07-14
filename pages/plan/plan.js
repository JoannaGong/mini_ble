import * as echarts from '../../ec-canvas/echarts.js';

const interfaces = require('../../utils/data.js')
const app = getApp();
var Chart = null;
var dataList = [];

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    pointIdArr: [],
    planId: '',
    planName: '',
    orderPlan: '',
    planNameList: ''
  },

  onLoad(options) {
    this.echartsComponnet = this.selectComponent('#mychart');
  },

  onShow: function() {
    // 获取方案列表，避免命名重复
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
        let planNameList = []
        res.data.data.forEach(item => {
          planNameList.push(item.name)
        })
        self.setData({
          planNameList: planNameList
        })
        wx.hideLoading()
      }
    })

    this.setData({
      planId: app.globalData.planId,
      pointIdArr: app.globalData.pointIdArr,
      planName: app.globalData.planName
    })

    let dataAll = [];
    let id_1 = 0;
    let x_1 = 20;
    let y_1 = 0;

    for (let j = 0; id_1 < 21; j++, id_1++) {
      dataAll.push({
        id: id_1,
        value: [x_1, y_1]
      })
      x_1 = x_1 - 1;
      y_1 = y_1 === 0 ? -0.5 : 0
    }

    let x = 0;
    let y = 1;
    for (let id = 21; id < 220; id++) {
      dataAll.push({
        id: id,
        value: [x, y]
      })

      y = parseInt((id - 21) / 11) + 1;
      if (y % 2 == 0) {
        x = 20 - 2 * ((id - 21) % 11);
      } else {
        x = 0 + 2 * ((id - 21) % 11);
      }
    }

    dataList = dataAll.map((item, index) => {
      let color = "";
      let symbolSize = 12
      if (item.value[1] < 4) {
        color = "#DC143C"
      } else if (item.value[1] < 18) {
        color = "#fff"
      } else {
        color = "#FFD700"
      }
      return {
        ...item,
        itemStyle: {
          color: color
        },
        symbolSize
      }
    })


    if (app.globalData.planId) {
      app.globalData.pointIdArr.forEach(item => {
        dataList[item.id].itemStyle = {
          color: "#000"
        }
        dataList[item.id].symbolSize = 14
      })
    }

    if (!Chart) {
      this.init_echarts(); //初始化图表
    } else {
      this.setOption(Chart); //更新数据
    }
  },

  init_echarts() {
    this.echartsComponnet.init((canvas, width, height) => {
      Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      this.setOption(Chart);
      return Chart;
    });
  },

  setOption(Chart) {
    Chart.on('click', params => {
      let id = params.data.id;
      let value = params.data.value;
      dataList[id].itemStyle = { color: '#000' }
      dataList[id].symbolSize = 14
      if (this.data.pointIdArr) {
        let index = this.data.pointIdArr.findIndex(item => item.id == id);
        if (index == -1) {
          this.data.pointIdArr.push({
            id,
            value
          });
          
        } else {
          this.data.pointIdArr.splice(index, 1);
          if (dataList[id].value[1] < 4) {
            dataList[id].itemStyle = {
              color: "#DC143C"
            }
          } else if (dataList[id].value[1] < 18) {
            dataList[id].itemStyle = {
              color: "#fff"
            }
          } else {
            dataList[id].itemStyle = {
              color: "#FFD700"
            }
          }
          dataList[id].symbolSize = 12
        }
      } else {
        let pointIdArr = []
        pointIdArr[0] = {
          id,
          value
        }
        this.setData({
          pointIdArr: pointIdArr
        })
      }
      // console.log(this.data.pointIdArr)
      // console.log(dataList)
      Chart.setOption(this.getOption());
    })
    Chart.setOption(this.getOption());
  },

  getOption() {
    var option = {
      grid: [{
        top: 0,
        left: 0,
        right: 10,
        bottom: 40,
        width: '100%',
        containLabel: true
      }],
      xAxis: [{
          data: ['A', '', 'B', '', 'C', '', 'D', '', 'E', '', 'F', '', 'G', '', 'H', '', 'I', '', 'J', '', 'K'],
          gridIndex: 0,
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          splitLine: {
            show: false
          }
        },
        {
          data: ['A', '', 'B', '', 'C', '', 'D', '', 'E', '', 'F', '', 'G', '', 'H', '', 'I', '', 'J', '', 'K'],
          gridIndex: 0,
          minInterval: 1,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            alignWithLabel: true
          },
          splitLine: {
            show: false
          },
          offset: 1
        }
      ],
      yAxis: [{
          type: "value",
          min: 1,
          max: 18,
          splitNumber: 18,
          gridIndex: 0,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        },
        {
          type: "value",
          min: 1,
          max: 18,
          splitNumber: 20,
          gridIndex: 0,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          }
        }
      ],

      series: [{
        data: dataList,
        type: 'scatter',
        symbol: 'circle',
      }],
      // animationDelay: function (idx) {
      //   return idx * 50;
      // },
      // animationEasing: 'elasticOut'
    }
    return option;
  },

  // 修改方案
  amend(e) {
    const params = {
      id: this.data.planId,
      name: this.data.planName,
      content: JSON.stringify(this.data.pointIdArr),
      disabled: e.currentTarget.dataset.disabled
    }
    let temp = []
    this.data.pointIdArr.forEach(item => {
      temp.push(item.id)
    })
    temp = temp.sort(this.sortNum)
    wx.request({
      url: interfaces.amendPlan + '/' + params.id,
      method: 'put',
      data: params,
      success(res) {
        if (res.statusCode === 200) {
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 2000
          })
          if (e.currentTarget.dataset.disabled == 0) {
            app.globalData.orderPlan = 'z' + temp.join(",") + ',;'
            wx.switchTab({
              url: '../functionPage/functionPage',
            })
          } else {
            wx.switchTab({
              url: '../list/list',
            })
          }
        }
      }
    })
  },

  getPlanName(e) {
    this.setData({
      planName: e.detail.value
    })
  },

  // 新建并保存方案
  savePlan(e) {
    if (!this.data.planName) {
      wx.showToast({
        title: '请填写方案名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }else{
      if(this.data.planNameList.findIndex(item => item === this.data.planName) != -1){
        wx.showToast({
          title: '方案名称重复',
          icon: 'none',
          duration: 2000
        })
        return;
      }
    }
    let sendData = {
      name: this.data.planName,
      content: JSON.stringify(this.data.pointIdArr),
      disabled: e.currentTarget.dataset.disabled
    }
    let temp = []
    this.data.pointIdArr.forEach(item => {
      temp.push(item.id)
    })
    temp = temp.sort(this.sortNum)
    
    wx.request({
      url: interfaces.addPlan,
      method: 'post',
      data: sendData,
      success(res) {
        wx.showToast({
          title: '保存成功！',
          icon: 'success',
          duration: 2000
        })
        if (e.currentTarget.dataset.disabled == 0){
          app.globalData.orderPlan = 'z' + temp.join(",") + ',;'
          wx.switchTab({
            url: '../functionPage/functionPage',
          })
        }else{
          wx.switchTab({
            url: '../list/list',
          })
        }
      }
    })
  },

  reset(e) {
    Chart.clear()
    this.data.pointIdArr.forEach(item => {
      let color = ''
      if (item.value[1] < 4) {
        color = "#DC143C"
      } else if (item.value[1] < 18) {
        color = "#fff"
      } else {
        color = "#FFD700"
      }
      dataList[item.id].itemStyle = {
        color: color
      }
      dataList[item.id].symbolSize = 12
    })
    app.globalData.pointIdArr = []
    this.init_echarts()
    // Chart.setOption(this.getOption());
  },

  sortNum(a, b) {
    return a - b
  },

  launch(e){
    let temp = []
    this.data.pointIdArr.forEach(item => {
      temp.push(item.id)
    })
    temp = temp.sort(this.sortNum)
    app.globalData.orderPlan = 'z' + temp.join(",") + ',;'
    wx.switchTab({
      url: '../functionPage/functionPage',
    })
  }
})