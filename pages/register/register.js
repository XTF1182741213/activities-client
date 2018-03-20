// pages/login/login.js
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  motto: '欢迎注册账号',
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
  register_json:function(res){
    var that=this;
    wx.request({
     //url:'http://localhost:5678/register',
      url: getApp().globalData.ipport + '/register',
      data: res.detail.value,
      method:'GET',
      header:{
        'content-type':'application/json'
      },
      success:function(res){
        console.log(res.data);
        if(res.data){ //如果返回是true,跳转登录页面
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 1300,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '../login/login'
                })
              }, 1300) //延迟时间
            }
          })
        }else{
          wx.showToast({
            title: '用户名重复!失败',
            icon: 'none',
            duration: 1500
          });
        }
      },
      fail:function(res){
        console.log("注册失败!");

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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})