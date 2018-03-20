//lists.js
//获取应用实例
var app = getApp()
Page({
  data: {
    newsList: [],
    lastid:0,
    lastpage:0,
    toastHidden:true,
    confirmHidden:true,
    isfrist:1,
    loadHidden:true,
    moreHidden:'none',
    msg:'没有更多活动了'
  },
  //顶部搜索
  toSearch: function () {
    var that = this;
    request.getBooklist("", function (res) {
      if (res.data.count == 0) { return; }
      that.setData({ 
        bookList: res.data.data, 
        count: res.data.count, 
        view_show: true 
        });
      that.setData({ view_show: true })
    });
  },

  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '校园聊',
      path: '/pages/alists/alists',
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
  loadData: function (page){
    //显示出加载中的提示
    this.setData({loadHidden:false})
      var limit = 6 //每页显示的数量
      var that = this
      wx.request({
        //url: getApp().globalData.ipport+'/getallactivity',
        url:getApp().globalData.ipport+'/activityparams',
          data: {page:page,size:limit},
          method: 'GET',
          header: {
              'Content-Type': 'application/json'
          },
          success: function(res) {
            console.log(res.data);
            console.log("res.data.last是"+res.data.last+"   page是"+page);
             //当前页数大于1时
               if(page>res.data.last){
                    that.setData({ toastHidden:false }) 
                    that.setData({ moreHidden:'none' })
                    return false                
               }
              
                //var len = res.data.length
                var len=res.data.totalPages
                that.setData({ lastpage:page})
                var dataArr = that.data.newsList
                if(page==0){
                  var newData = res.data.content;
                }else { 
                 var  newData = dataArr.concat(res.data.content);
                }
 
              //  var newData=res.data.content
                //var newData = dataArr.concat(res.data);
               // if(oldLastpage==0){
                //     wx.setStorageSync('aList', newData)
               // }
               
               //缓存第一页的数据
                if (0==page){
                  wx.setStorageSync('aList',res.data.content)
                }
                that.setData({ newsList:newData })
                that.setData({ moreHidden:'' })
                console.log('data from url');
          },
          fail: function(res){
                 if(page==0){
                    var newData = wx.getStorageSync('aList')
                    console.log("newData的数据是:"+newData)
                     if(!newData){
                        that.setData({ newsList:newData })
                        that.setData({ moreHidden:'' })
                          //var len = newData.length
                          //that.setData({ lastid: newData[len-1].id})
                          that.setData({ page:newData.number })
                     }
                     console.log('data from cache');
                } else {
                    that.setData({ toastHidden:false, moreHidden:'none', msg:'当前网格异常，请稍后再试' }) 
                }          
          },
          complete: function(){
              //显示出加载中的提示
              that.setData({loadHidden:true})         
          }
      })
  }, 

  loadMore: function(event){
  //  var id = event.currentTarget.dataset.lastid
  //var page=event.currentTarget.dataset.lastpage+1
  var page=event.currentTarget.dataset.lastpage+1
  var isfrist = event.currentTarget.dataset.isfrist
  console.log("LodMore page是" + page)
  console.log("isFirst是"+isfrist)
    var that = this
    wx.getNetworkType({
      success: function(res) {
        var networkType = res.networkType // 返回网络类型2g，3g，4g，wifi
        if(networkType!='wifi' && isfrist=='1'){
           that.setData({confirmHidden:false})
        }
      }
    })
    this.setData({isfrist:0})
   // this.loadData(id);
   this.loadData(page)
  },
  
  onLoad: function () {
    var that = this
    this.loadData(0);
  },
  //下拉刷新
  onPullDownRefresh: function () {
    this.onLoad(0)
   // wx.showNavigationBarLoading(); //在标题栏中显示加载图标 
  },

  toastChange: function(){
    this.setData({toastHidden:true})
  },
  modalChange: function(){
    console.log('abc');
    this.setData({confirmHidden:true})
  }
})