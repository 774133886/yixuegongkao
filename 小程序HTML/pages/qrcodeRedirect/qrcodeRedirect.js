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
  onLoad: function (query) {
    // scene 需要使用 decodeURIComponent 才能获取到生成二维码时传入的 scene
    const scene = decodeURIComponent(query.scene);
    let id = scene.split(':')[1];
    if (scene.includes('pintuan')){
      wx.redirectTo({
        url: '/pages/courseDetail/courseDetail?c_id=' + id +'&&state=1',
      })
    }else{
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    if (scene.includes('course')) {
      wx.redirectTo({
        url: '/pages/courseDetail/courseDetail?c_id=' + id + '&&state=0',
      })
    } else {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }
    
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