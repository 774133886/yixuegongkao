// pages/personal/personal.js
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    info: {},
    kefuPhone: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var deployInfo = wx.getStorageSync("deployInfo");
    this.setData({
      kefuPhone: deployInfo.service_phone
    })
  },
  goFollow(){
    wx.navigateTo({url: '../follow/follow',})
  },
  goAbout(){
    wx.navigateTo({ url: '../aboutUs/aboutUs', })
  },
  goOrder() {
    wx.navigateTo({ url: '../myOrder/myOrder', })
  },
  goEvaluate(){
    wx.navigateTo({ url: '../myEvaluate/myEvaluate', })
  },
  callTell(){
    wx.makePhoneCall({
      phoneNumber: this.data.kefuPhone,
    })
  },
  getInfo(){ 
    var that = this;
    http.getReq('api/member/member_detail.htm',{}, function (res) {
      if (res.code == 0) {
        res.data.mobile2 = res.data.mobile.substring(0, 3) + "****" + res.data.mobile.substring(7, 11)
        that.setData({
          info: res.data,
          isLogin: true
        })
      }else{
        that.setData({
          isLogin: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goLogin: function(){
    this.setData({
      isLogin: true
    })
    wx.navigateTo({
      url: '../login/login',
    })
  },
  goInfo(){
    if(!this.data.isLogin)return;
    wx.navigateTo({
      url: '../userInfo/userInfo',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getInfo()
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