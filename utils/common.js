function loadInfo(id, obj){
   // var key = 'info_' + id
   var key=id
    var info = wx.getStorageSync(key)
    if(info){
        console.log('data from localCache')
        obj.setData({ info:info })
        return true
    }

    wx.request({
      //url: 'http://192.168.1.104/weicms/index.php?s=/addon/Cms/Cms/getDetail',
      url: 'https://www.tengfeistudio.cn/getactivity',
        data: {id:id},
        header: {
          method: 'GET',
            'Content-Type': 'application/json'
        },
        success: function(res) {
                console(res.data)
                obj.setData({ info:res.data })
                console.log(key)
                wx.setStorageSync(key, res.data)
                console.log('data from server')
        },
        fail: function(res){
            console.log('server error')       
            obj.setData({ toastHidden:false, msg:'当前网格异常，请稍后再试' }) 
        },        
    })    
}
module.exports = {
  loadInfo: loadInfo
}