Page({
  data: {
    array: ['无', '思德素拓', '文化素拓', '身心素拓', '双创素拓', '技能素拓'],
    types: 0,
    is_dev: 0,
    src:"../../images/icons/add.png",
    src2: "../../images/icons/add.png",
    img:"", 
    picture:"",
  },

  bindPickerChange: function (e) {
    console.log('form发生了Picker事件，携带数据为：', e.detail.value)
    this.setData({ types: e.detail.value });
  },

 chooseimg:function(){
   var that=this;
   wx.chooseImage({
     count:1,
     sizeType:['compressed'],
     sourceType:['album','camera'],
     success:function(res){
       var tempFilePaths=res.tempFilePaths;
       wx.showToast({
         icon:"loading",
         title:"正在上传"
       }),
       wx.uploadFile({
         url: getApp().globalData.ipport + '/uploadimg',
         filePath: tempFilePaths[0],
         name: 'file',
         header:{ "Content-Type":"multipart/form-data"},
         formData:{ 'session_token':wx.getStorageSync('session_token')},
         success:function(res){
           console.log("上传图片返回的数据是"+res.data);
           if(res.statusCode!=200){
             wx.showModal({
               title: '提示',
               content: '上传失败',
               showCancel:false
             })
             return ;
           }
           var data=res.data
           that.setData({
             src: tempFilePaths[0],
             img:data,
           })
         },
        fail:function(e){
          console.log(e);
          wx.showModal({
            title:'提示',
            content:'上传失败',
            showCancel:false
          })
        },
        complete:function(){
          wx.hideToast();
        }
       })
     }
   })
 },

/*
  choose: function () {
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
          //url: 'http://localhost:5678/uploadimg',
          url: getApp().globalData.ipport + '/uploadimg',
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


  getUserid: function () {
    wx.request({
      url: getApp().globalData.ipport + '/agetuserid',
      data: {
        username: wx.getStorageSync('key'),
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('data from server')
      },
      fail: function (res) {
        console.log('server error')
        //that.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    })
  },

  formSubmit: function (e) {
    wx.request({
      url: getApp().globalData.ipport + '/agetuserid',
      data: {
        username: wx.getStorageSync('key'),
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log('data from server')
      },
      fail: function (res) {
        console.log('server error')
        //that.setData({ toastHidden: false, msg: '当前网格异常，请稍后再试' })
      },
    })
    //console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var formData = e.detail.value
    formData.type = this.data.types
    formData.username=wx.getStorageSync('key')
    formData.img=this.data.img
    formData.picture=this.data.picture
    console.log('form发生了事件，携带数据为：', formData)
    var that = this 
    wx.request({
      //url:'http://localhost:5678/addactivity',
      url: getApp().globalData.ipport + '/addactivity',
      data: formData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data) { //检验是否添加成功
          wx.showToast({
            title: '活动发布成功',
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
        } else {
          wx.showToast({
            title: '发布失败',
            icon: 'none',
            duration: 1500,
          })

        }
      },
      complete: function () {
      }
    })














  }
})