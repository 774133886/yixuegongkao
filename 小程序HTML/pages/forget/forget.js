// pages/forget/forget.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btntext: "获取验证码",
    isEdit: false,
    time: 60
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type){
      this.setData({
        isEdit: true
      })
      wx.setNavigationBarTitle({
        title: '修改密码'
      })
    }
  },

  getCode: function () {
    //这里是要调api接口的，我这里就假装已经调成功了，返回200了
    if (this.data.btntext != "获取验证码") {
      return false;
    }
    var _this = this
    var coden = 60    // 定义60秒的倒计时
    var codeV = setInterval(function () {
      _this.setData({    // _this这里的作用域不同了
        btntext: (--coden) + 's'
      })
      if (coden == -1) {  // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
        clearInterval(codeV)
        _this.setData({
          btntext: '获取验证码'
        })
      }
    }, 1000)  //  1000是1秒
  },
  goLogin:function(){
    wx.navigateBack({url: '../login/login'})
  },
  // 验证码手机号获取
  setp: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取验证码
  getCode: function () {
    var that = this;
    var time = this.data.time;
    var phone = this.data.phone;
    var myreg = /^[1][0-9][0-9]{9}$/;
    // console.log(phone);
    if (!myreg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    console.log(this.data.time)
    this.sendcode(phone);
  },
  // 发送短信
  sendcode: function (phone) {
    var data = {};
    data.mobile = phone;
    var time = this.data.time;
    var that = this;
    console.log(data)
    // return false;
    http.postReq(this.data.isEdit?'/api/member/send_change_pwd_sms.htm':'/api/member/login/send_find_password_sms.htm', data, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
        if (time == 60) {
          var countTime = setInterval(function () {
            if (time == 1) {
              time = 60;
              clearInterval(countTime);
            } else {
              time--;
            }
            that.setData({
              time: time
            })
          }, 1000)
        }
      } else {
        return false;
      }
    })
  },
  formSubmit(e) {

    var that = this;
    console.log(e.detail.value);
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.mobile || !e.detail.value.checkcode || !e.detail.value.password || !e.detail.value.password2) {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var myreg = /^[1][0-9][0-9]{9}$/;
    if (!myreg.test(e.detail.value.mobile)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    if (e.detail.value.password != e.detail.value.password2){
      wx.showToast({
        title: '密码不一致',
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    var data = e.detail.value;
    data.code = e.detail.value.checkcode;
    // data.token = token;
    // return false;
    http.postReq(this.data.isEdit ?'/api/member/member_change_password.htm':'/api/member/login/find_password_reset.htm', data, function (res) {
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      })
      if (res.code == 0) {
        setTimeout(()=>{
          wx.navigateBack()
        })
      } else {

      }


      console.log(res)
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})