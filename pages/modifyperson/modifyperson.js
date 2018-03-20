Page({
  data: {
    card: 0,
    cardpassword: '',
    email: '',
    icon: '',
    password: '',
    phone: 0,
    realname: '',
    username: '',
    src: "../../images/icons/add.png",
  },
  onLoad: function () {
    var that = this
    wx.request({
      url: getApp().globalData.ipport + '/findUserByUsername',
      data: {
        username: wx.getStorageSync('key'),
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('data from server')
        console.log(res.data)
        that.setData({
          card: res.data.card,
          cardpassword: res.data.cardpassword,
          email: res.data.email,
          icon: res.data.icon,
          password: res.data.password,
          phone: res.data.phone,
          realname: res.data.realname,
          username: res.data.username,
        })   
      },
      fail: function (res) {
        console.log('server error')
      },
    })
  },
  chooseIcons: function () {
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
                icon: data,
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
  //修改用户信息
  modifyUser: function (e) {
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var formData = e.detail.value
    formData.icon=this.data.icon
    console.log('form发生了事件，携带数据为：', formData)
    var that = this
    wx.request({
      url: getApp().globalData.ipport + '/modifyuserbyusername',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 1500,
          success: function () {
            setTimeout(function () {
              //要延时执行的代码
              wx.switchTab({
                url: '../mine/mine'
              })
            }, 1500) //延迟时间
          }
        })
      },
      complete: function () {
      }
    })
  },

 //选择用户头像
 /*
  chooseIcons: function () {
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
       // wx.setStorageSync( 'icon', tempFilePaths[0] )
        wx.uploadFile({
          url: getApp().globalData.ipport + '/uploadicons',
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
  }
  */





})