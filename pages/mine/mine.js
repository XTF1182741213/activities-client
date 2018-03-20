//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
   //下面才是我要的
    icon:'',
    level:1,
    username:'',
    id:0,
    topicNumber:0,
    activityNumber:0,
    replyNumber:0,


    //弹出的选择按钮
    tip: '',
    buttonDisabled: false,
    modalHidden: true,
    show: false,
  },

  //弹出的选择提示
  modalBindaconfirm: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
      show: !this.data.show,
      tip: '您点击了【确认】按钮！',
      buttonDisabled: !this.data.buttonDisabled
    })
    wx.navigateTo({
      url: '../login/login',
    })
  },
  modalBindcancel: function () {
    this.setData({
      modalHidden: !this.data.modalHidden,
      tip: '您点击了【取消】按钮！'
    })
  },














  //跳转到修改信息页面
  tomodifyPerson:function(){
    if(wx.getStorageSync('key')){
    wx.navigateTo({
      url: '../modifyperson/modifyperson',
    })
  }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
  }
  },
  //跳转到个人帖子页面
  tomodifytopic: function () {
    if(wx.getStorageSync('key')){ 
    wx.navigateTo({
      url: '../modifytopic/modifytopic',
    })
    }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
    }
  },
  //跳转到个人发布活动页面
  toalistsperson: function () {
    if(wx.getStorageSync('key')){ 
    wx.navigateTo({
      url: '../alistsperson/alistsperson',
    })
    }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
    }
  },

  //跳转到发布活动页面publisha
  topublisha: function () {
    if(wx.getStorageSync('key')){ 
    wx.navigateTo({
      url: '../publisha/publisha'
    })
    }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
    }
  },
  //跳转到发布帖子页面publisht
  topublisht: function () {
    if(wx.getStorageSync('key')){ 
    wx.navigateTo({
      url: '../publisht/publisht',
    })
  }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
  }
  },
  //跳转到回复页面
  toreply:function(){
    if(wx.getStorageSync('key')){
       wx.showToast({
         title: '该功能尚未开放',
         icon:'none',
         duration:1500,
       })
    }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
    }
  },
  //注销退出界面
  logoutbind: function () {
    wx.clearStorageSync()
    wx.navigateTo({
      url: '../login/login',
    })
  },
  //初次加载
  onShow: function () {
    var that = this
    wx.request({
      url: getApp().globalData.ipport + '/findUserByUsername',
      data: {
        username: wx.getStorageSync('key'),
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          icon: res.data.icon,
          level:res.data.level,
          username:res.data.username,
          id:res.data.id,
        })
      },
      fail: function (res) {
       console.log("用户信息获取失败!")
      },
      complete: function () {
      }
    })
    this.countTopicNumber(that);
    this.countActivityNumber(that);
    this.countRelyNumber(that);
  },


//计算帖子数量
  countTopicNumber:function(that){
    wx.request({
      url: getApp().globalData.ipport + '/counttopicbyuserid',
      data: {
        usernames: wx.getStorageSync('key'),
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          topicNumber: res.data,
        })
      },
      fail: function (res) {
        console.log("获取失败!")
      },
      complete: function () {
      }
    })
  },
//计算活动数量
  countActivityNumber: function (that) {
    wx.request({
      url: getApp().globalData.ipport + '/countactivitybyuserid',
      data: {
        usernames: wx.getStorageSync('key'),
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          activityNumber: res.data,
        })
      },
      fail: function (res) {
        console.log("获取失败!")
      },
      complete: function () {
      }
    })
  },
  //计算回复数量
  countRelyNumber: function (that) {
    wx.request({
      url: getApp().globalData.ipport + '/countreplybyuserid',
      data: {
        usernames: wx.getStorageSync('key'),
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          replyNumber: res.data,
        })
      },
      fail: function (res) {
        console.log("获取失败!")
      },
      complete: function () {
      }
    })
  },



  ready: function (that) {
    wx.request({
      //url: 'http://localhost:5678/getalltopic',
      url: getApp().globalData.ipport + '/getalltopic',
      data: {},
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          //articles: index.articles.slice(0, 10),
          //articles:res.data.slice(0,10)   //设置显示10条
          articles: res.data
        })
      },
      fail: function (res) {

      },
      complete: function () {

      }
    })

  },


  //得到更多
  moreArticle: function (event) {
    console.log("moreArticle: 加载更多");
    console.log("moreArticle: pageIndex: " + event.currentTarget.dataset.pageIndex);
    wx.showNavigationBarLoading();
    var first = (this.data.pageIndex) * this.data.pageSize;
    //this.getArticle(first);
  },

  //得到文章
  getArticle: function (first) {
    console.info(first);
    if ((first == "undefined") || (first == null)) {
      first = 1;
    }
    if (first > index.articles.length) {
      wx.hideNavigationBarLoading();
      return
    }
    var end = first + this.data.pageSize;
    if (end > index.articles.length) {
      end = index.articles.length;
    }
    var newArticle = index.articles.slice(first, end);
    this.setData({
      articles: this.data.articles.concat(newArticle),
      pageIndex: parseInt(this.data.pageIndex) + 1
    });
    wx.hideNavigationBarLoading();
  },
})
