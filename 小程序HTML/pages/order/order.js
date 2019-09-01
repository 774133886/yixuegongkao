// pages/order/order.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    myList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  goLive(e){
    wx.navigateTo({
      url: '../LiveStudio/LiveStudio?id='+e.currentTarget.dataset.id
    })
  },
  goDetail(){
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },
  getTodayCourse(){
    var that = this;
    http.postReq("/api/business/get_member_course_today_list.htm",{rows: 20},function(res){
      if(res.code==0){
        that.setData({
          courseList: res.data.list
        })
      }
    })
  },
  getMyCourse(){
    var that = this;
    http.postReq("/api/business/get_member_course_list.htm", { rows: 20 }, function (res) {
      if (res.code == 0) {
        that.setData({
          myList: res.data.list
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
    this.getTodayCourse();
    this.getMyCourse()
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