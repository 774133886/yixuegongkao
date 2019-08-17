// pages/activities/activities.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    ptList:[],
    rows:10,
    page:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  choiceTab(e){
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },
  getList(){
    let that = this;
    var data = {};
    data.page = that.data.page;
    data.rows = that.data.rows;
    // data.token = token;
    http.getReq('/api/pintuan/public/get_product_list.htm', data, function (res) {
      if (res.code == 0) {
 
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  goDetail(e){
    wx.navigateTo({
      url: '../courseDetail/courseDetail?state='+e.currentTarget.dataset.state,
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