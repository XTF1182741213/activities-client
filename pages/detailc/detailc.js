 
var util = require("../../utils/util.js")
var comobj = require("../../data/comobj.js")
//index.js
//获取应用实例 
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    articles: [],
    pageIndex: 1,
    pageSize: 2,
    audioIcon: "https://www.tengfeistudio.cn/showImg?url=upload/icon/voiceplaying.png",//声音图标
    css: {
      "bankuaiSelected": ""
    },
    typeList: [],
    currentTypeId: 0,
    hot: 0,
    topicid: 0,
    scrollLeft: 0,
    number:0,

    replies:[],

    //弹出的选择按钮
    tip: '',
    buttonDisabled: false,
    modalHidden: true,
    show: false,

    IsPraise: 0,
    praiseNumber: 0,
    listid: 0,

  },
  //点赞
  addpraise: function (e) {
    var that = this
    var topicid = e.currentTarget.id;
    var topicpraise = e.currentTarget.dataset.praise
    //增加点赞
    wx.request({
      url: getApp().globalData.ipport + "/addpraise",
      data: {
        username: wx.getStorageSync('key'),
        praise: topicpraise + 1,
        topicid: topicid,
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log("已经点赞了")
        that.setData({
          IsPraise: 1,
          praiseNumber: topicpraise + 1,
          listid: topicid,
        })
      }
    })
  },
  //分享
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '评论详情',
      path: '/pages/detailc/detailc',
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
  //事件处理函数
  toPublishc: function (e) {
    var index=e.currentTarget.id; 
    console.log("index="+index)
    //用户名不为空时
    if(wx.getStorageSync('key')){
      wx.redirectTo({
        url: '../publishc/publishc?id=' + wx.getStorageSync('topicid')
      })
    }else{
      this.setData({
        modalHidden: !this.data.modalHidden
      })
    }
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

  onLoad: function (options) {
    console.log('onLoad')
    var that = this
   // that.setData({ topicid: options.id })
   // wx.setStorageSync('topicid',options.id);
    this.ready(that);
  },

  more_bankuai: function () {
    console.log("获取更多版块");
  },

  // 加载数据
  ready: function(that){
    console.log("detailc中的topicid是:" + that.data.topicid),
    wx.request({
      //url: 'http://localhost:5678/getalltopic',
      url: getApp().globalData.ipport + '/gettopicbyid',
      data: { 
       // topicid: that.data.topicid, 
       topicid:wx.getStorageSync('topicid'),
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success:function(res){
        console.log(res.data);
        console.log("res.data.id是"+res.data.id)
        that.setData({
          //articles:res.data.slice(0,10)   //设置显示10条
          articles:res.data,
        })
      },
      fail:function(res){
      },
      complete: function (){
      }
    })
    
    //通过topic的id查询评论 
    /*     
     wx.request({
      url: getApp().globalData.ipport +'/findreplybytopicid',
      data: {
        topicid:that.data.topicid,
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          replies:res.data,
        })
      },
      fail:function(res){
      },
      complete: function (){
      }
    })
    */
      
      
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











  // 点击版块跳转
  toBankuai: function (event) {
    console.log("点击版块跳转");
    console.log(event);
    var typeId = event.currentTarget.dataset.typeid;
    var hot = event.currentTarget.dataset.hot;
    if (hot) {
      typeId = 0;
      hot = 1;
    } else {
      typeId = typeId;
      hot = 0;
    }
    console.log(this.data.currentTypeId);
    console.log(this.data.hot);
    this.setData({
      articles: this.data.articles,
      currentTypeId: typeId,
      hot: hot
    });
  },



  // 展开箭头 举报
  openArrow: function (event) {
    console.info("openArrow: ");
    var user = event.currentTarget.dataset.userId;
    console.log(user)
    wx.showActionSheet({
      itemList: ["举报", "取消"],
      success: function (res) {
        if (res.tapIndex == 0) {
          // 举报
          console.info("举报");
          util.tipOff(user);
        }
      }
    });
  },



  // 播放声音
  playAudio: function (event) {
    console.info("播放声音");
    var voiceId = event.currentTarget.dataset.vId;
    console.info(voiceId);
    var storageVoice = app.globalData.voice;
    var audioContext = wx.createAudioContext(voiceId + "");
    // 获取正在播放的内容
    if (typeof storageVoice == "undefined" || storageVoice == "" || storageVoice == null) {
      // 当前未播放
      audioContext.play();
      storageVoice = new Object();
      storageVoice.id = voiceId;
      storageVoice.status = 2;
    } else if (storageVoice.id == voiceId) {
      // 暂定状态
      if (storageVoice.status == 1) {
        audioContext.play();
        storageVoice.status = 2;
      } else
        // 播放状态 - 转为暂停
        if (storageVoice.status == 2) {
          audioContext.pause();
          storageVoice.status = 1;
        }
    } else {
      // 停止当前的，播放另一个
      var usingAudioContext = wx.createAudioContext(storageVoice.id + "")
      usingAudioContext.seek(0);
      usingAudioContext.pause();
      storageVoice = new Object();
      storageVoice.id = voiceId;
      storageVoice.status = 2;
      audioContext.play();
    }
    app.setGlobalData({
      voice: storageVoice
    })

  },


  // 更多版块
  moreType: function (event) {
    var that = this;
    var types = app.globalData.types;
    console.log(event);
    if (typeof types == "undefined") {
      return;
    }
    var typeIds = [];
    var typeNames = [];
    for (var i = 0; i < types.length; i++) {
      typeIds[i] = types[i].ArticleTypeID;
      typeNames[i] = types[i].ArticleTypeName;
    }
    wx.showActionSheet({
      itemList: typeNames,
      success: function (res) {
        if (res.cancel) {
          console.log("取消");
        } else {
          // 获取新的内容
          var idx = res.tapIndex;
          var typeId = typeIds[idx];
          that.typeChange(typeId);
        }
      }
    })
  },





  // 切换版块
  typeChange: function (typeId) {
    var that = this;
    var pn = 1;
    var h = 0;
    var hongbao = "";
    var rspan = 1;
    app.getMoreArticle(pn, typeId, h, hongbao, rspan, function (res) {
      var articleList = res.ArtList;
      that.data.articles = that.data.articles(articleList);
    })
    var tmp = this.data.typeList;
    var typeList = tmp;
    for (var i = 0; i < typeList.length; i++) {
      if (typeList[i].ArticleTypeID == typeId) {
        var tmpType = {
          ArticleTypeID: typeId,
          ArticleTypeName: typeList[i].ArticleTypeName
        }
        typeList.splice(i, 1);
        typeList.splice(1, 0, tmpType);
      }
    }
    that.setData({
      currentTypeId: typeId,
      typeList: typeList,
      scrollLeft: -900
    })
    console.log(this.data.currentTypeId);
  }
})
