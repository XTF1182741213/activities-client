//aboutme.js
//获取应用实例
var app = getApp()
Page({
  data: {
    toastHidden: true,
    username: '',
    id:0,
    userid:0,
    src: "../../images/icons/add.png",
    picture:''
  },

  onLoad: function (options) {
    this.setData({
      username: getApp().globalData.username,
    });
    console.log(wx.getStorageSync('key'))
    var that = this
  },
  addpicture: function () {
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
                picture: data,
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
  addTopic: function (res) {
    var that=this
    console.log(that.data.id)//传递登录用户的id
    if(res.detail.value.detail==''){
      console.log("内容不能为空")
      wx.showToast({
        title: '发布失败,内容不能为空!',
        icon:'none',
        duration:1500
      })
    }else{
    wx.request({
      //url: 'http://localhost:5678/addtopic',
      url: getApp().globalData.ipport + '/addtopic',
      data:{
        theme:res.detail.value.theme,
        detail: res.detail.value.detail,
        topicusername: wx.getStorageSync('key'),
        title: res.detail.value.title,
        picture:that.data.picture
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },

      success: function (res) {
        console.log(res.data);
        if (res.data) { //检验是否添加成功
          console.log("添加成功!")
          wx.showToast({ 
            title: '发帖成功',
            icon:'success',
            duration:1500,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
               wx.switchTab({
                  url: '../mine/mine',
                })
              }, 1500) //延迟时间
            }
          })
        }else{
          wx.showToast({
            title: '发帖失败',
            icon:'none',
            duration:1500,
          })
        }
      },
      fail: function (res) {
        console.log("添加失败!");
      }
    })
    }
  },
/*
  addpicture: function () {
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
          url: getApp().globalData.ipport + '/uploadpicture',
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
  //添加图片
  /*
  addpicture: function () {
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
         // url: 'http://localhost:5678/uploadpicture',
          url: getApp().globalData.ipport + '/uploadpicture',
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