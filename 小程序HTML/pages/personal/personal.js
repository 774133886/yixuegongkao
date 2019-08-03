// pages/personal/personal.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      phoneNumber: '002-6432-569',
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
    wx.navigateTo({
      url: '../userInfo/userInfo',
    })
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