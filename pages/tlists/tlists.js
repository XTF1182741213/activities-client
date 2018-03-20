//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    articles: [],
    articel: [], 
    lists: [],
    pageIndex: 1,
    pageSize: 2,
    audioIcon: "https://www.tengfeistudio.cn/showImg?url=upload/icon/voiceplaying.png",//声音图标
    css: {
      "bankuaiSelected": ""
    },
    typeList: [],
    currentTypeId: 0,
    hot: 0,
    scrollLeft: 0,
    len: 0,
    IsPraise:0,
    praiseNumber:0,
    listid:0,
  },
//点赞
  addpraise:function(e){
    var that=this
    var topicid=e.currentTarget.id;
    var topicpraise=e.currentTarget.dataset.praise
    
    /*
    console.log("topicid是"+topicid)
    var topicpraise=0;
    console.log("praise是"+topicpraise)
    //查询点赞数量
   wx.request({
     url: getApp().globalData.ipport +'/countpraisebytopicid',
     data:{
       topicid:topicid,
     },
     method:'GET',
     header: {
       'Content-Type': 'application/json'
     },
     success:function(res){
      topicpraise=res.data;
       console.log("topicpraise是"+topicpraise)
     }
   })
   console.log("topicpraise2是" + topicpraise),
   */
   //增加点赞
   wx.request({
     url: getApp().globalData.ipport +"/addpraise",
     data:{
       username:wx.getStorageSync('key'),
       praise:topicpraise+1,
       topicid:topicid,
     },
     method:'GET',
     header:{
       'Content-Type':'application/json'
     },
     success:function(res){
        console.log("已经点赞了")
        that.setData({
          IsPraise:1,
          praiseNumber:topicpraise+1,
          listid:topicid,
        })
     }
   })
  },

  //转发功能
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("res.target是" + res.target);
       this.sendTopicId(res);
    }
    return {
      title: '校园聊',
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
  sendTopicId: function (e) {
    var index = e.currentTarget.id;
    console.log("e.currentTarget.id是" + e.currentTarget.id)
    wx.setStorageSync('topicid', index);
  },

  //跳转到评论详细页面
  toDetailc: function (e) {
    var index = e.currentTarget.id;
    console.log("index=" + index)
    wx.setStorageSync('topicid', index);
    wx.navigateTo({
      url: '../detailc/detailc?id=' + index,
    })
  },
  onShow: function () {
    console.log('onLoad')
    var that = this
    this.ready(0);
  },
  more_bankuai: function () {
    console.log("获取更多版块");
  },
  ready: function (page) {
    var size = 8
    var that = this
    wx.request({
      //url: 'http://localhost:5678/getalltopic',
      //url: getApp().globalData.ipport + '/getalltopic',
      url: getApp().globalData.ipport + "/topicparams",
      data: {
        page: page,
        size: size
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          //articles: index.articles.slice(0, 10),
          //articles:res.data.slice(0,10)   //设置显示10条
          //articles:res.data.content,
          pageIndex: res.data.number,
          pageSize: res.data.size,
          len: res.data.totalElements,
        })
        var newArticle = res.data.content;
        if (page > 0) {
          that.setData({
            articles: that.data.articles.concat(newArticle),
          });
        } else {
          that.setData({
            articles: newArticle
          })
        }
      },
      fail: function (res) { },
      complete: function () { }
    })
  },
  moreArticles: function (event) {
    this.data.pageIndex = event.currentTarget.dataset.pageIndex + 1
    this.ready(this.data.pageIndex);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    // wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    this.ready(0);
    wx.stopPullDownRefresh;
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
