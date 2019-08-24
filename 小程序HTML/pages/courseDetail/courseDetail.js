// pages/courseDetail/courseDetail.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    shareShow:false,
    contactShow:false,
    sServiceTel:'15928773528',
    state:0,
    pjshow:true,
    type:0,
    c_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    this.setData({
      state: options.state
    })
    if (options.c_id){
      this.setData({
        c_id: options.c_id
      })
    }
    // 获取详情
    this.getInfo();
    this.getpjList();
  },
  //分享遮罩
  shareTab: function (e) {
    this.setData({ shareShow: !this.data.shareShow })
  },
  contactTab: function (e) {
    this.setData({ contactShow: !this.data.contactShow })
  },
  // 回到首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //电话
  phonecallevent: function (e) {
    var phoneNum = e.currentTarget.dataset.pnum
    wx.makePhoneCall({
      phoneNumber: phoneNum.toString()
    })
  },
  writeInfo: function (e) {
    wx.navigateTo({
      url: '/pages/addAdress/addAdress'
    })
  },
  writeInfo2: function (e) {
    wx.navigateTo({
      url: '/pages/chooseJob/chooseJob'
    })
  },
  // 评价折叠
  changepj(){
    this.setData({ pjshow: !this.data.pjshow })
  },

  // 获取课程详情
  getInfo(){
    let that = this;
    var data = {};
    data.courseid = this.data.c_id;
    console.log(data)
    http.postReq('api/public/get_course_comment_list.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({ info: res.data})
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取评价详情
  getpjList() {
    let that = this;
    var data = {};
    data.courseid = this.data.c_id;
    console.log(data)
    http.postReq('api/public/get_course_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({ info: res.data })
        var content = res.data.intro
        WxParse.wxParse('article', 'html', content, that, 5);
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
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