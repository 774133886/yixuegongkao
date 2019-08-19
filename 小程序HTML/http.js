var rootDocment = 'https://yxgk.kulend.com/';
var header = {
  'Accept': 'application/x-www-form-urlencoded',
  'content-type': 'application/x-www-form-urlencoded',
  'Authorization': wx.getStorageSync('token') || null,
  
  
}

function getReq(url, data, cb) {
  var token = wx.getStorageSync('token');
  if (!token) {
    wx.showToast({
      icon: 'none',
      title: '重新登录',
    })
    setTimeout(() => {
      // 去登录
      wx.reLaunch({
        url: '/pages/login/login'
      })
    }, 2000)
    return false;
  }
  wx.showLoading({
    title: '加载中',
  })
  if (!data) {
    data = {};
  }
  wx.request({
    url: rootDocment + url,
    data: data,
    header: header,
    method: 'get',
    success: function (res) {

      wx.hideLoading();

      if (res.data.code == 920 || res.data.rcode == 921) {
        wx.showToast({
          title: res.data.ret_msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          // 去登录
          wx.removeStorageSync('subject');
          wx.removeStorageSync('back');
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }, 2000)
      } else {
        return typeof cb == "function" && cb(res.data)
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}
// post
function postReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
  if (!data) {
    data = {};
  }
  var token = wx.getStorageSync('token');
  console.log(data);
  wx.request({
    url: rootDocment + url + '?token=' + token,
    header:header,
    data: data,
    method: 'post',
    success: function (res) {
      wx.hideLoading();
      if (res.data.code == 920) {
        wx.showToast({
          title: res.data.ret_msg,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          // 去登录
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }, 2000)

      } else {
        return typeof cb == "function" && cb(res.data)
      }
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })

}
// PATCH
function patchReq(url, data, cb) {
  wx.showLoading({
    title: '加载中',
  })
  if (!data) {
    data = {};
  }
  var token = wx.getStorageSync('token');
  console.log(data);
  wx.request({
    url: rootDocment + url + '?token=' + token,
    data: data,
    method: 'put',
    success: function (res) {
      wx.hideLoading();
    },
    fail: function () {
      wx.hideLoading();
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })

}


module.exports = {
  getReq: getReq,
  postReq: postReq,
  header: header,
}  
