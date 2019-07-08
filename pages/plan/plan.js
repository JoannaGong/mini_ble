import * as echarts from '../../ec-canvas/echarts';

const interfaces = require('../../utils/data.js')
const app = getApp();

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    pointIdArr: [],
    planId: '',
    planName: '',
  },

  onLoad: function (options) {
    var planId = getApp().globalData.planId
    var pointIdArr = getApp().globalData.pointIdArr
    var planName = getApp().globalData.planName
    this.setData({
      planId: planId,
      pointIdArr: pointIdArr,
      planName: planName
    })

    this.chartComponnet = this.selectComponent('#mychart-dom');
    this.init_chart();
  },

  // init_chart: function () {
  //   this.chartComponent.init((canvas, width, height) => {
  //     const chart = echarts.init((canvas, null, {
  //       width: width,
  //       height: height
  //     }))
  //     chart.setOption(this.getOption())
  //     return chart
  //   })
  // },

  // onShow() {
  //   if (this.planId) {
  //     const cash = {
  //       symbolSize: 12,
  //       data: this.pointIdArr,
  //       type: 'scatter',
  //       animation: False,
  //       itemStyle: {
  //         color: '#000'
  //       },
  //       zlevel: 2
  //     }
  //     option.series.push(cash)
  //   }
  // },

  // initChart: function (canvas, width, height) {
  //   const chart = echarts.init(canvas, null, {
  //     width: width,
  //     height: height
  //   });
  //   canvas.setChart(chart);

  //   let dataAll = [];
  //   let id_1 = 1;
  //   let x_1 = 20;
  //   let y_1 = 0;

  //   for (let j = 0; id_1 < 22; j++ , id_1++) {

  //     dataAll.push({
  //       id: id_1,
  //       value: [x_1, y_1]
  //     })

  //     x_1 = x_1 - 1;
  //     y_1 = y_1 === 0 ? -0.5 : 0
  //   }

  //   let id = 23;
  //   let x = 0;
  //   let y = 1;
  //   for (let i = 0; id < 221; i++ , id++) {
  //     if (y == 19) {
  //       x = x + 2;
  //       y = 1
  //     }

  //     dataAll.push({
  //       id: id,
  //       value: [x, y]
  //     })

  //     y = y + 1;
  //   }

  //   var option = {
  //     grid: [{
  //       top: 0,
  //       left: 0,
  //       right: 10,
  //       bottom: 40,
  //       width: '100%',
  //       containLabel: true
  //     }],
  //     xAxis: [{
  //       data: ['A', '', 'B', '', 'C', '', 'D', '', 'E', '', 'F', '', 'G', '', 'H', '', 'I', '', 'J', '', 'K'],
  //       gridIndex: 0,
  //       minInterval: 1,
  //       axisLine: {
  //         show: false
  //       },
  //       axisTick: {
  //         show: false,
  //         alignWithLabel: true
  //       },
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     {
  //       data: ['A', '', 'B', '', 'C', '', 'D', '', 'E', '', 'F', '', 'G', '', 'H', '', 'I', '', 'J', '', 'K'],
  //       gridIndex: 0,
  //       minInterval: 1,
  //       axisLine: {
  //         show: false
  //       },
  //       axisTick: {
  //         show: false,
  //         alignWithLabel: true
  //       },
  //       splitLine: {
  //         show: false
  //       },
  //       offset: 1
  //     }
  //     ],
  //     yAxis: [{
  //       type: "value",
  //       min: 1,
  //       max: 18,
  //       splitNumber: 18,
  //       gridIndex: 0,
  //       axisLine: {
  //         show: false
  //       },
  //       axisTick: {
  //         show: false
  //       },
  //       splitLine: {
  //         show: false
  //       }
  //     },
  //     {
  //       type: "value",
  //       min: 1,
  //       max: 18,
  //       splitNumber: 20,
  //       gridIndex: 0,
  //       axisLine: {
  //         show: false
  //       },
  //       axisTick: {
  //         show: false
  //       },
  //       splitLine: {
  //         show: false
  //       }
  //     }
  //     ],

  //     series: [{
  //       symbolSize: 12,
  //       data: dataAll.map((item, index) => {
  //         let symbol = "";
  //         let color = "";
  //         if (item.value[1] < 4) {
  //           symbol = 'circle'
  //           color = "#DC143C"
  //         } else if (item.value[1] < 18) {
  //           symbol = "circle"
  //           color = "#fff"
  //         } else {
  //           symbol = "circle";
  //           color = "#FFD700"
  //         }
  //         return {
  //           ...item,
  //           symbol: symbol,
  //           itemStyle: {
  //             color: color
  //           }
  //         }
  //       }),
  //       type: 'scatter',
  //     }]
  //   };

  //   chart.setOption(option);

  //   chart.on('click', (params) => {
  //     // console.log(this.pointIdArr)
  //     let id = params.data.id;
  //     let value = params.data.value;
  //     let index = this.pointIdArr.findIndex(item => item.id == id);
  //     if (index == -1) {
  //       this.pointIdArr.push({
  //         id,
  //         value
  //       })
  //     } else {
  //       this.pointIdArr.splice(index, 1)
  //     }
  //   })
  //   return chart;
  // },

  getOption() {
    let dataAll = [];
    let id_1 = 1;
    let x_1 = 20;
    let y_1 = 0;

    for (let j = 0; id_1 < 22; j++ , id_1++) {

      dataAll.push({
        id: id_1,
        value: [x_1, y_1]
      })

      x_1 = x_1 - 1;
      y_1 = y_1 === 0 ? -0.5 : 0
    }

    let id = 23;
    let x = 0;
    let y = 1;
    for (let i = 0; id < 221; i++ , id++) {
      if (y == 19) {
        x = x + 2;
        y = 1
      }

      dataAll.push({
        id: id,
        value: [x, y]
      })

      y = y + 1;
    }

    return {
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
        symbolSize: 12,
        data: dataAll.map((item, index) => {
          let symbol = "";
          let color = "";
          if (item.value[1] < 4) {
            symbol = 'circle'
            color = "#DC143C"
          } else if (item.value[1] < 18) {
            symbol = "circle"
            color = "#fff"
          } else {
            symbol = "circle";
            color = "#FFD700"
          }
          return {
            ...item,
            symbol: symbol,
            itemStyle: {
              color: color
            }
          }
        }),
        type: 'scatter',
      }],
      animationDelay: function (idx) {
        return idx * 50;
      },
      animationEasing: 'elasticOut'
    }
  },

  amend(e) {
    const params = {
      id: this.data.planId,
      name: this.data.planName,
      content: JSON.stringify(this.data.pointIdArr),
      disabled: e.currentTarget.dataset.disabled
    }

    wx.request({
      url: interfaces.amendPlan + '/' + params.id,
      method: 'put',
      data: params,
      success(res) {
        console.log(res)
        if (res.statusCode === 200) {
          wx.showToast({
            title: '修改成功！',
            icon: 'success',
            duration: 2000
          })

          wx.switchTab({
            url: '../list/list',
          })
        }
      }
    })
  },

  reset: function() {
    this.data.pointIdArr = [];
  }
})