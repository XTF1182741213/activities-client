//aboutme.js
//获取应用实例
var app = getApp()
Page({
  data: {
    toastHidden: true,
    id:0,
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '校园聊',
      path: '/pages/detaila/detaila',
      success: function (res) {
        // 转发成功
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  onLoad: function (options) {
    //var common = require('../../utils/common.js')
    //common.loadInfo("8", this)

    this.setData({
      id: options.id,
      title:options.title,
      aname:options.aname,
      time:options.time,
     // picture:options.picture,
      //img:options.img,
      place:options.place,
      types:options.type,
      rank:options.rank,
      target:options.target,
      sponsor:options.sponsor,
      content:options.content,
    });
    var that=this
    /*
    wx.request({
      //url: 'http://localhost:5678/findImgById',
      url: getApp().globalData.ipport +'/findImgById',
      data: { id: options.id },
      header: {
        method: 'POST',
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({ 
          img: res.data,
          //picture:res.data 
        })
        console.log('data from server')
      },
      fail: function (res) {
        console.log('server error')
        that.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    })
    */
    console.log(options.id)  //这里传递id成功了
    wx.request({
      //url: 'http://localhost:5678/findImgById',
      url: getApp().globalData.ipport + '/findbyactivityid',
      data: { id: options.id },
      header: {
        method: 'GET',
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          picture: res.data.picture,
          img:res.data.img
        })
        console.log('data from server')
      },
      fail: function (res) {
        console.log('server error')
        that.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    }) 
  },
  
/*
  loadInfo:function(id, obj) {
    var key = 'info_' + id
    var info = wx.getStorageSync(key)
      console.log("id是"+id)
      console.log("key是"+key)
      if (info) {
      console.log('data from localCache')
      obj.setData({ info: info })
      obj.setData({id:id})
      return true
    }

      wx.request({
      //url: 'http://192.168.1.104/weicms/index.php?s=/addon/Cms/Cms/getDetail',
      url: 'http://localhost:5678/getactivity',
      data: { id: id },
      header: {
        method: 'GET',
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console(res.data)
        this.setData({ info: res.data })
        console.log(key)
        wx.setStorageSync(key, res.data)
        console.log('data from server')
      },
      fail: function (res) {
        console.log('server error')
        obj.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    })
  },

    module.exports = {
    loadInfo: loadInfo
  },


*/





  closepage: function () {
    wx.navigateBack()
  },
  toastChange: function () {
    this.setData({ toastHidden: true })
    wx.navigateBack()
  },
})