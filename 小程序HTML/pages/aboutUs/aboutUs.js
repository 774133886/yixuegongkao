// pages/aboutUs/aboutUs.js
let WxParse = require('../../wxParse/wxParse.js');
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    article: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // WxParse.wxParse('article', 'html', article, that, 5);
    this.getInfo()
  },
  getInfo(){
    var that = this;
    http.postReq("/api/app/wxapp_about_us.htm",{},function(res){
      if(res.code==0){
        that.setData({
          article: res.data.content
        });
        var article = that.data.article;
        WxParse.wxParse('article', 'html', article, that, 5);
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
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