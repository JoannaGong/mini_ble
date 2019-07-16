import * as echarts from '../../ec-canvas/echarts.js';
var utils = require("../../utils/util.js");

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
    planNameList: '',
    textLog: "",
    deviceId: "",
    name: "",
    allRes: "",
    serviceId: "",
    readCharacteristicId: "",
    writeCharacteristicId: "",
    notifyCharacteristicId: "",
    connected: true,
    canWrite: false,
  },

  onLoad(options) {
    this.echartsComponnet = this.selectComponent('#mychart');
  },

  onShow: function() {
    console.log(app.globalData.pointIdArr)
    // 获取方案列表，避免命名重复
    const that = this
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: interfaces.listpage,
      success(res) {
        let planNameList = []
        res.data.data.forEach(item => {
          planNameList.push(item.name)
        })
        that.setData({
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
    for (let id = 21; id < 219; id++) {
      y = parseInt((id - 21) / 11) + 1;
      if (y % 2 == 0) {
        x = 20 - 2 * ((id - 21) % 11);
      } else {
        x = 0 + 2 * ((id - 21) % 11);
      }
      dataAll.push({
        id: id,
        value: [x, y]
      })
    }

    dataList = dataAll.map((item, index) => {
      let color = "";
      let symbolSize = 16
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
        dataList[item.id].symbolSize = 18
      })
    }

    if (!Chart) {
      this.init_echarts(); //初始化图表
    } else {
      this.setOption(Chart); //更新数据
    }

    // 蓝牙连接部分
    var devid = decodeURIComponent(app.globalData.deviceId);
    var devname = decodeURIComponent(app.globalData.name);
    var devserviceid = decodeURIComponent(app.globalData.serviceId);
    var log = that.data.textLog + "设备名=" + devname + "\n设备UUID=" + devid + "\n服务UUID=" + devserviceid + "\n";
    this.setData({
      textLog: log,
      deviceId: devid,
      name: devname,
      serviceId: devserviceid
    });

    //获取特征值
    that.getBLEDeviceCharacteristics();

    if (wx.setKeepScreenOn) {
      wx.setKeepScreenOn({
        keepScreenOn: true,
        success: function (res) {
          //console.log('保持屏幕常亮')
        }
      })
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
      dataList[id].symbolSize = 18
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
          dataList[id].symbolSize = 16
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
        bottom: 50,
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
            this.data.orderPlan = 'z' + temp.join(",") + ',;'
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
          this.data.orderPlan = 'z' + temp.join(",") + ',;'
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
    var that = this;
    var orderStr = 'z;';//指令
    let order = utils.stringToBytes(orderStr);
    that.writeBLECharacteristicValue(order);
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
      dataList[item.id].symbolSize = 16
    })
    app.globalData.pointIdArr = []
    this.setData({
      pointIdArr: []
    })
    console.log(this.data.pointIdArr)
    this.init_echarts()

    
    // Chart.setOption(this.getOption());
  },

  sortNum(a, b) {
    return a - b
  },

  launch(e){
    var that = this;
    if(!this.data.pointIdArr){
      app.showModal("数据为空!")
      return
    }else{
      let temp = []
      this.data.pointIdArr.forEach(item => {
        temp.push(item.id)
      })
      temp = temp.sort(this.sortNum)
      this.setData({
        orderPlan: 'z' + temp.join(",") + ',;'
      })
        
      var orderStr = this.data.orderPlan;//指令
      if(orderStr == 'z,;'){
        orderStr = 'z;'
      }
      let order = utils.stringToBytes(orderStr);
      that.writeBLECharacteristicValue(order);
    }
  },

  //获取蓝牙设备某个服务中的所有 characteristic（特征值）
  getBLEDeviceCharacteristics: function (order) {
    var that = this;
    wx.getBLEDeviceCharacteristics({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      success: function (res) {
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          if (item.properties.read) {//该特征值是否支持 read 操作
            var log = that.data.textLog + "该特征值支持 read 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              readCharacteristicId: item.uuid
            });
          }
          if (item.properties.write) {//该特征值是否支持 write 操作
            var log = that.data.textLog + "该特征值支持 write 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              writeCharacteristicId: item.uuid,
              canWrite: true
            });
          }
          if (item.properties.notify || item.properties.indicate) {//该特征值是否支持 notify或indicate 操作
            var log = that.data.textLog + "该特征值支持 notify 操作:" + item.uuid + "\n";
            that.setData({
              textLog: log,
              notifyCharacteristicId: item.uuid,
            });
            that.notifyBLECharacteristicValueChange();
          }
        }
      }
    })
    // that.onBLECharacteristicValueChange();   //监听特征值变化
  },

  //启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值。
  //注意：必须设备的特征值支持notify或者indicate才可以成功调用，具体参照 characteristic 的 properties 属性
  notifyBLECharacteristicValueChange: function () {
    var that = this;
    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.notifyCharacteristicId,
      success: function (res) {
        var log = that.data.textLog + "notify启动成功" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
        that.onBLECharacteristicValueChange();   //监听特征值变化
      },
      fail: function (res) {
        wx.showToast({
          title: 'notify启动失败',
          mask: true
        });
        setTimeout(function () {
          wx.hideToast();
        }, 2000)
      }

    })

  },
  //监听低功耗蓝牙设备的特征值变化。必须先启用notify接口才能接收到设备推送的notification。
  onBLECharacteristicValueChange: function () {
    var that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      var resValue = utils.ab2hext(res.value); //16进制字符串
      var resValueStr = utils.hexToString(resValue);
      var log0 = that.data.textLog + "成功获取：" + resValueStr + "\n";
      that.setData({
        textLog: log0,
      });

    });
  },

  //向低功耗蓝牙设备特征值中写入二进制数据。
  //注意：必须设备的特征值支持write才可以成功调用，具体参照 characteristic 的 properties 属性
  writeBLECharacteristicValue: function (order) {
    var that = this;
    let byteLength = order.byteLength;
    var log = that.data.textLog + "当前执行指令的字节长度:" + byteLength + "\n";
    that.setData({
      textLog: log,
    });
    wx.writeBLECharacteristicValue({
      deviceId: that.data.deviceId,
      serviceId: that.data.serviceId,
      characteristicId: that.data.writeCharacteristicId,
      // 这里的value是ArrayBuffer类型
      value: order.slice(0, 20),
      success: function (res) {
        if (byteLength > 20) {
          setTimeout(function () {
            that.writeBLECharacteristicValue(order.slice(20, byteLength));
          }, 150);
        }
        var log = that.data.textLog + "写入成功：" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      },
      fail: function (res) {
        var log = that.data.textLog + "写入失败" + res.errMsg + "\n";
        that.setData({
          textLog: log,
        });
      }
    })
  },
})