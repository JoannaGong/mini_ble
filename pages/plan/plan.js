let WxChart = require("../../dist/wxcharts-min.js");
let pointImg = require("../../images/pointImg.png")
let pointWhite = require("../../images/point_white.png")
let pointYellow = require("../../images/point_yellow.png")

Page({
  onReady: function (e) {
    var ctx = wx.createCanvasContext('myCanvas')
    
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

    let markLineOpt = {
      animation: false
    }

    option = {
      grid: [
        {
          top: 0,
          left: 0,
          right: 10,
          bottom: 30,
          width: '100%',
          containLabel: true
        },
      ],
      xAxis: [
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
      yAxis: [
        {
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
        symbolSize: 22,
        data: dataAll.map((item, index) => {
          let symbol = "";
          if (item.value[1] < 4) {
            symbol = 'image://' + pointImg
          } else if (item.value[1] < 18) {
            symbol = 'image://' + pointWhite
          } else {
            symbol = 'image://' + pointYellow
          }
          return {
            ...item,
            symbol: symbol
          }
        }),
        type: 'scatter',
      }]
    };

  }
})