
var util = require("../../utils/util.js")
var comobj = require("../../data/comobj.js")
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    articles: [],
    articel:[],
    lists:[],
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
    len:0,

  },
  
  // 展开箭头 举报
  openArrow: function (event) {
    console.info("openArrow: ");
    var topicid = event.currentTarget.dataset.userId;
    console.log(topicid)
    wx.showActionSheet({
      itemList: ["删除", "取消"],
      success: function (res) {
        if (res.tapIndex == 0) {
          // 删除
          console.info("删除");
          //util.tipOff(user);
          wx.request({
            url: getApp().globalData.ipport + '/deletetopicbyid',
            data: {
              id:topicid,
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
                        url: '../modifytopic/modifytopic'
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
        }
      }
    });
  },



  onShow: function () {
    console.log('onLoad')
    var that = this
    this.ready(that);
  },

  more_bankuai: function () {
    console.log("获取更多版块");
  },
  ready: function(that){
   // var size=8
    //var that=this
    wx.request({
      url: getApp().globalData.ipport + '/findtopicbyuserid',
      //url: getApp().globalData.ipport + "/topicparams",
      data: {
        usernames:wx.getStorageSync('key')
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json'
      },
      success:function(res){
        console.log(res.data);
        that.setData({
          //articles: index.articles.slice(0, 10),
          //articles:res.data.slice(0,10)   //设置显示10条
          articles:res.data,
          //pageIndex:res.data.number,
          //pageSize:res.data.size,
         // len: res.data.totalElements,
        })
        var newArticle = res.data;
        articles:newArticle;
        /*
        if(page>0){
          that.setData({
            articles: that.data.articles.concat(newArticle),
          });
        }else{
          that.setData({
            articles: newArticle
          })
        }
        */

      },
      fail:function(res){

      },
      complete: function (){

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
/*
moreArticles:function(event){
  this.data.pageIndex = event.currentTarget.dataset.pageIndex+1
  this.ready(this.data.pageIndex);
} , 
*/
  //下拉刷新
  /*
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
    this.onLoad()
   wx.stopPullDownRefresh;
  },
  */







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
