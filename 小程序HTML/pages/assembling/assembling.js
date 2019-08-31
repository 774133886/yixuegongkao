// pages/assembling/assembling.js
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
    shareShow: false,
    payShow:false,
    nomore: false,
    sServiceTel: '15928773528',
    p_id:''
  },

  // 支付
  payTab: function (e) {
    this.setData({ payShow: !this.data.payShow })
  },
  //分享遮罩
  shareTab: function (e) {
    this.setData({ shareShow: !this.data.shareShow })
  },
  //拼团失败遮罩
  closeMark: function (e) {
    this.setData({ nomore: !this.data.nomore })
  },
  //电话
  phonecallevent: function (e) {
    var phoneNum = e.currentTarget.dataset.pnum
    wx.makePhoneCall({
      phoneNumber: phoneNum.toString()
    })
  },
  // 获取拼团详情
  getInfo() {
    let that = this;
    var data = {};
    data.id = this.data.p_id;
    http.postReq('api/pintuan/public/get_product_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data,
        })
        // var content = res.data.intro;
        // WxParse.wxParse('article', 'html', content, that, 5);
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.p_id) {
      this.setData({
        p_id: options.p_id
      })
    }
    that.getInfo();
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