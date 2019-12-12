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
    myList: [],
    token: wx.getStorageSync("token") || "",
    deployInfo: wx.getStorageSync("deployInfo") || {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  playLive(e){
    var item = e.currentTarget.dataset.item;
    // if (!item.today_rooms[0].can_open_live){
    //   return;
    // }
    wx.navigateTo({
      url: '../liveRoom/liveRoom?id=' + item.today_rooms[0].room_id
    })
  },
  goLive(e){
    wx.navigateTo({
      url: '../LiveStudio/LiveStudio?id='+e.currentTarget.dataset.id
    })
  },
  goDetail(e){
    var item = e.currentTarget.dataset.id;
    var id = "";
    var state = 0;
    if (item.promotions && item.promotions.length){
      if (item.promotions[0].promotion_type == 4){
        id = item.promotions[0].promotion_id;
        state = item.promotions[0].promotion_type == 4 ? 1 : 0
      }
    }else{
      id = item.course_id
    }
    wx.navigateTo({
      url: '../courseDetail/courseDetail?c_id=' + id + '&state=' + state
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
    this.getMyCourse();
    this.setData({
      token: wx.getStorageSync("token")
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