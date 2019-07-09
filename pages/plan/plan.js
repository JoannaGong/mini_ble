import * as echarts from '../../ec-canvas/echarts.js';

const interfaces = require('../../utils/data.js')
const app = getApp();
var pointIdArr = []
var planId = ''
var planName = ''

function init_chart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart)

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

    y = parseInt((id-21)/11)+1;
    if (y % 2 == 0){
      x = 20-2*((id-21)%11);
    } 
    else{
      x = 0 + 2 * ((id - 21) % 11);
    }
  }

  var initOption = {
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

  if (planId) {
    const cash = {
      symbolSize: 12,
      data: pointIdArr,
      type: 'scatter',
      animation: false,
      itemStyle: {
        color: '#000'
      }
    }
    initOption.series.push(cash)
  }

  this.option = initOption
  
  chart.on('click', (params) => {
    console.log(pointIdArr)
    let id = params.data.id;
    let value = params.data.value;
    // let index = pointIdArr.findIndex(item => item.id == id);
    // if (index == -1) {
    //   pointIdArr.push({
    //     id,
    //     value
    //   })
    // } else {
    //   pointIdArr.splice(index, 1)
    // }
    
  })

  chart.setOption(initOption)
  return chart
}

Page({
  data: {
    ec: {
      onInit: init_chart
    }
  },

  onShow: function() {
    planId = getApp().globalData.planId
    pointIdArr = getApp().globalData.pointIdArr
    planName = getApp().globalData.planName
    this.setData({
      planId: planId,
      pointIdArr: pointIdArr,
      planName: planName
    })
  },

  // 修改方案
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

  // 保存方案
  savaPlan(e){
    if(!planName){
      wx.showToast({
        title: '请填写方案名称',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    let sendData = {
      name: planName,
      content: JSON.stringify(pointIdArr),
      disabled: e.currentTarget.dataset.disabled
    }
    wx.request({
      url: interfaces.setPlan,
      method: 'post',
      data: sendData,
      success(res){
        console.log(res)
      }
    })
  },

  reset: function() {
    this.data.pointIdArr = [];
  }
})