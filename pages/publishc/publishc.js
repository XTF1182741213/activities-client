//aboutme.js
//获取应用实例
var app = getApp()
Page({
  data: {
    toastHidden: true,
    replyname: '',
    topicid:0,
    //id:0,
    userid:0,
    src: "../../images/icons/add.png",
    replypicture:'',
  },
/*
  onLoad: function (options) {
    this.setData({
      username: getApp().globalData.username,
    });
    console.log(getApp().globalData.username)
    var that = this
    wx.request({
      url: 'http://localhost:5678/getuserid',
      data: { username: getApp().globalData.username },
      header: {
        method: 'POST',
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data)
        that.setData({ id: res.data })
        //wx.setStorageSync(key, res.data)
        console.log('data from server')
      },
      fail: function (res) {
        console.log('server error')
        that.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    })
    //console.log(that.data.id)  //这里传递登录名成功了
  },
  */

  onLoad: function (options) {
    var that = this
    this.setData({
      replyname: wx.getStorageSync('key'),
      //replyname: getApp().globalData.username,
     // topicid:1,
    });
    that.setData({topicid:options.id})
    //console.log(getApp().globalData.username)
    console.log(wx.getStorageSync('key'))
    console.log("topicid是"+options.id)//topicid
    //console.log(that.data.id)  //这里传递登录名成功了
  },
  addcommentpicture: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        }),
          wx.uploadFile({
            url: getApp().globalData.ipport + '/uploadimg',
            filePath: tempFilePaths[0],
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            formData: { 'session_token': wx.getStorageSync('session_token') },
            success: function (res) {
              console.log("上传图片返回的数据是" + res.data);
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: '上传失败',
                  showCancel: false
                })
                return;
              }
              var data = res.data
              that.setData({
                src: tempFilePaths[0],
                replypicture: data,
              })
            },
            fail: function (e) {
              console.log(e);
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function () {
              wx.hideToast();
            }
          })
      }
    })
  },
  addComment: function (res) {
    var that=this
    console.log(that.data.topicid)//传递登录用户的id
    //console.log(res.data)
    //var details = res.detail.value.detail
    if (res.detail.value.replydetail == '') {
      console.log("内容不能为空")
      wx.showToast({
        title: '发布失败,内容不能为空!',
        icon: 'none',
        duration: 1500
      })
    } else {
    wx.request({
      //url: 'http://localhost:5678/addreply',
      url: getApp().globalData.ipport + '/addreply',   
      data:{
        replydetail: res.detail.value.replydetail,
        //replyname: getApp().globalData.username,
        replyname: wx.getStorageSync('key'),
        topicid: that.data.topicid,
        replypicture:that.data.replypicture
      },
     
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data) { //检验是否添加成功
          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '../detailc/detailc?id='+that.data.topicid
                })
              }, 1500) //延迟时间
            }
          })
          } else {
            wx.showToast({
              title: '评论失败',
              icon: 'none',
              duration: 1500,
            })
          
        }
      },
      fail: function (res) {
        console.log("评论失败!");
      }
    })
    }
  },
  /*
  addcommentpicture: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.showToast({
          icon: "loading",
          title: "正在上传"
        }),
          wx.uploadFile({
          url: getApp().globalData.ipport + '/uploadcommentpicture',
            filePath: tempFilePaths[0],
            name: 'file',
            header: { "Content-Type": "multipart/form-data" },
            formData: { 'session_token': wx.getStorageSync('session_token') },
            success: function (res) {
              console.log(res);
              if (res.statusCode != 200) {
                wx.showModal({
                  title: '提示',
                  content: '上传失败',
                  showCancel: false
                })
                return;
              }
              var data = res.datat
              that.setData({
                src: tempFilePaths[0]
              })
            },
            fail: function (e) {
              console.log(e);
              wx.showModal({
                title: '提示',
                content: '上传失败',
                showCancel: false
              })
            },
            complete: function () {
              wx.hideToast();
            }
          })
      }
    })
  },
 */

  //添加评论图片
  /*
  addcommentpicture: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
        console.log(res.tempFilePaths)
        wx.setStorage({ key: "card", data: tempFilePaths[0] })
        wx.uploadFile({
          //url: 'http://192.168.1.104/weicms/index.php?s=/application/Home/Home/uploadPicture',
          //url: 'http://localhost:5678/uploadcommentpicture',
          url: getApp().globalData.ipport + '/uploadcommentpicture',
          filePath: tempFilePaths[0],
          name: 'file',
          // formData: {
          //  'session_token': wx.getStorageSync('session_token')
          // },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            var data = res.data
            console.log(res);
          }
        })
      },
    })
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