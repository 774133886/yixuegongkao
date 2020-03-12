// pages/login/login.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 60,
    sServiceTel: '020-88888888',
    phone: '',
    phoneCode:'',
    acidx: 1,
    encryptedData:'',
    iv:'',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // 更换登录方式
  changeidx(e) {
    this.setData({
      acidx: e.currentTarget.dataset.idx
    })
  },
  onLoad: function (options) {
    
  },
  // 验证码手机号获取
  setp: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  setpcode:function(e){
    this.setData({
      phoneCode: e.detail.value
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
    // return false;
    http.postReq('/api/member/login/send_weixin_app_bind_sms.htm', data, function (res) {
      wx.showToast({
        title: res.message,
        icon: 'none',
        duration: 2000
      })
      if (res.code == 0) {
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
  // 提交
  formSubmit: function (e) {

    var that = this;
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!e.detail.value.mobile || !e.detail.value.password) {
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
    // var token = wx.getStorageSync('token');

    var data = e.detail.value;
    // data.token = token;
    http.postReq('/api/member/login/login.htm', data, function (res) {
      if (res.code == 0) {
        wx.setStorageSync('token', res.data);
        console.log(res.data)
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000,
          success(){
            setTimeout(()=>{
              wx.switchTab({
                url: '/pages/index/index'
              })
            },1500)
            
          }
        })
       
        
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
        }
    });
  },
  bindGetUserInfo(e) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          that.userLogin(function () {
            setTimeout(()=>{
              that.formSubmit2()
            })
          })
        }
      }
    })
  },
  formSubmit2() {

    var that = this;
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    if (!this.data.phone || !this.data.phoneCode) {
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var myreg = /^[1][0-9][0-9]{9}$/;
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    var token = wx.getStorageSync('token');

    var data = {};
    data.token = token;
    data.mobile = this.data.phone;
    data.checkcode = this.data.phoneCode;
    wx.login({
      success: function (res1) {
        if (res1.code) {
          wx.getUserInfo({
            success: function (res) {
              data.encryptedData = res.encryptedData;
              data.iv = res.iv;
              data.code = res1.code;
              // return false;
              http.postReq('/api/member/login/weixin_app_bind.htm', data, function (res2) {
                if (res.code == 0) {
                  wx.showToast({
                    title: "登陆成功",
                    icon: 'none',
                    duration: 2000
                  });
                  wx.setStorageSync('token', res2.data.session);
                  if (res.data.member.status==4){
                    wx.navigateTo({
                      url: '../setUserInfo/setUserInfo'
                    })
                  }else{
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.message,
                    icon: 'none',
                    duration: 2000
                  })
                }
              });
            }
          })
        }
      }
    })
  },
  goForget: function(){
    wx.navigateTo({url: "../forget/forget"})
  },
  goRegister(){
    wx.navigateTo({ url: "../register/register" })
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
    this.userLogin()
  },
  userLogin(callBack){
    var that = this;
    // 微信自己登录
    wx.login({
      success: function (res1) {
        if (res1.code) {
          wx.getUserInfo({
            success: function (res) {
              //获取用户敏感数据密文和偏移向量
              that.setData({ encryptedData: res.encryptedData })
              that.setData({ iv: res.iv })
              that.setData({ code: res1.code })
            },
            fail: function (res) {
              console.log(res)
            }
          })
          wx.request({
            url: 'https://www.yixuegongkao.com/api/member/login/weixin_app_login.htm?code=' + res1.code,
            method: 'POST',
            header: http.header,
            success: function (res2) {
              if (res2.data.code == 0) {
                wx.setStorageSync('token', res2.data.data.session);
                if (res2.data.data.member.status == 4) {
                  wx.navigateTo({
                    url: '../setUserInfo/setUserInfo'
                  })
                }else{
                  wx.switchTab({
                    url: '../index/index',
                  })
                }
              }else if(res2.data.code == 1){
                typeof callBack == "function" && callBack()
              } else {
                wx.showToast({
                  title: res2.data.message,
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
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