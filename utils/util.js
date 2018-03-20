function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}

//论坛
function getData(){
  wx.request({
    url: 'http://www.tengfeistudio.cn',
    data:{},
    method:'GET',
    success:function(res){

    },
    fail:function(){

    },
    complete:function(){

    }
  })
}

//举报
function tipOff(user){
  console.info("举报");
}
