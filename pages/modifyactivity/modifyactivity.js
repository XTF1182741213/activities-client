//aboutme.js
//获取应用实例
var app = getApp()
Page({
  data: {
    toastHidden: true,
    src: "../../images/icons/add.png",
    src2: "../../images/icons/add.png",
    id: 0,
    title:'',
    time:'',
    place: '',
    aname: '',
    types: '',
    rank: '',
    target: '',
    sponsor: '',
    content: '',
    picture: '',
  },

  onLoad: function (options) {
    this.setData({
      id: options.id,
    });
    var that = this
    wx.request({
      url: getApp().globalData.ipport + '/findbyactivityid',
      data: { id: options.id },
      header: {
        method: 'GET',
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          id:res.data.id,
          title:res.data.title,
          time: res.data.time,
          place: res.data.place,
          aname: res.data.aname,
          types: res.data.type,
          rank: res.data.rank,
          target: res.data.target,
          sponsor: res.data.sponsor,
          content: res.data.content,
          picture:res.data.picture,
        })
        console.log('data from server')
        console.log(options.id)  //这里传递id成功了      
      },
      fail: function (res) {
        console.log('server error')
        that.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    })
    
  },

  //删除活动
  deleteActivity:function(e){
    console.log("id是"+e.target.dataset.id);
    wx.request({
      url: getApp().globalData.ipport + '/deleteactivitybyid',
      data: {
        id: e.target.dataset.id,
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        if (res.data) { //检验是否添加成功
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500,
            success: function () {
              setTimeout(function () {
                //要延时执行的代码
                wx.redirectTo({
                  url: '../alistsperson/alistsperson'
                })
              }, 1500) //延迟时间
            }
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 1500,
          })
        }

      },
      fail: function (res) {
      },
      complete: function () {
      }
    })
  },
  //修改活动信息
  modifyActivity: function (e) {
    /*
    wx.request({
      url: getApp().globalData.ipport + '/getactivityid',
      data:{
        id: e.target.dataset.id,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
      },
      complete: function () {
      }
    })
    */
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var formData = e.detail.value
    formData.img=this.data.img
    formData.picture=this.data.picture
    formData.actid = e.target.dataset.id
    console.log('form发生了事件，携带数据为：', formData)
    var that = this
    wx.request({
      url: getApp().globalData.ipport + '/modifyactivity',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 1500,
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'none',
            duration: 1500,
          })
        }    
        
      },
      complete: function () {
      }
    })
  },

  chooseimg: function () {
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
                img: data,
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
  choosepicture: function () {
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
                src2: tempFilePaths[0],
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

  //选择用户头像
  /*
  chooseImgs: function () {
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
        // wx.setStorage({ key: "card", data: tempFilePaths[0] })
        // wx.setStorageSync( 'icon', tempFilePaths[0] )
        wx.uploadFile({
          url: getApp().globalData.ipport + '/uploadimg',
          filePath: tempFilePaths[0],
          //filePath:wx.getStorageSync('icon'),
          name: 'file',
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