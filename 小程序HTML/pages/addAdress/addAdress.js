// pages/addAdress/addAdress.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payShow: false,
    region: ['北京市', '朝阳区'],
    phone:'',
    name:"",
    doorNum:''

  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // 支付
  payTab: function (e) {
    var that = this;
    if(!this.data.phone||!this.data.name||!this.data.doorNum){
      wx.showToast({
        title: '输入不能为空',
        icon: 'none',
        duration: 2000
      })
      return false
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
    this.setData({ payShow: !this.data.payShow })
  },
  // input
  changeInput: function(e){
    var key = e.currentTarget.dataset.keyName;
    var value = e.detail.value;
    this.setData({
      [key]:value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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