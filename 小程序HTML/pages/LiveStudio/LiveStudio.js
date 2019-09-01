// pages/LiveStudio/LiveStudio.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var bjy = require('../../sdk/BJYMain');
var eventEmitter = bjy.eventEmitter;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseid: '',
    sort: 1,
    list: [],
    info: {},
    vid: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      courseid: options.id
    })
    this.getInfo();
    this.getList();
  },
  playLive(e){
    this.setData({
      vid: e.currentTarget.dataset.id
    });
    this.customPlay();
  },
  // 自定义播放
  customPlay: function () {
    var me = this;
    me.selectComponent('#bjy-player').customPlay();
  },
  goDetail(){
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getList(){
    var that = this;
    var id = this.data.courseid;
    http.postReq("/api/public/get_course_room_list.htm", { courseid: id, sort: this.data.sort},function(res){
      if(res.code == 0){
        that.setData({
          list: res.data.list
        })
      }
    })
  },
  getInfo() {
    var that = this;
    var id = this.data.courseid;
    http.postReq("/api/public/get_course_detail.htm", { courseid: id},function(res){
      if (res.code == 0) {
        that.setData({
          info: res.data
        })
      }
    })
  },
  changeSort(){
    this.setData({
      sort: this.data.sort==1?2:1
    })
    this.getList()
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