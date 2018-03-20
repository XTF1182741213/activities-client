// pages/login/login.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  motto: '欢迎登录掌上活动',
  userInfo:{},
  id_token:'',
  responseData:'',
  boo:false,
  hasUserInfo: false,
  canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  bindViewTap:function(){
    wx.navigateTo({
      url: '../logs/logs',
    })
  },
  bindViewTap2: function () { //点击按钮跳转到注册页面
    wx.navigateTo({
      url: '../register/register',
    })
  },
  login_json:function(res){
    var that = this; 
    app.globalData.username = res.detail.value.username
    console.log(res.detail.value.username)
    wx.request({
      //url: 'http://localhost:5678/login',
      url: getApp().globalData.ipport + '/login',
      data: res.detail.value,
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        console.log(res.data);
       
        if(res.data){ //校验账号密码是否正确，如果返回true跳转到alists页面
          wx.switchTab({
            url: '../alists/alists',
          })
          wx.setStorageSync('key', app.globalData.username)
          
        }else{
          wx.showToast({
            title: '账号或密码错误!',
            icon:'none',
            duration:1500,
          })
        }
      },
      fail:function(res){
        console.log("登录失败!");
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /*
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  */
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
  onLoad: function () {
    var value = wx.getStorageSync('key')
    console.log("value的值是:" + value)
    if(value){
      wx.switchTab({
        url: '../alists/alists',
      })
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
