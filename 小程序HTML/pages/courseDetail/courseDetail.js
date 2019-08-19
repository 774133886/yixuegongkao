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
    shareShow:false,
    contactShow:false,
    sServiceTel:'15928773528',
    state:0,
    pjshow:true,
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var content = "<img style='margin-left: 0;border-radius:10px; width:100%;' src='../../files/indexBanner.png'/><div>此处为富文本<div/>" ;
    WxParse.wxParse('article', 'html', content, that, 5);
    this.setData({
      state: options.state
    })
    if (options.type){
      this.setData({
        type: options.type
      })
    }
    // 获取详情
    this.getptList()
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

  // 获取拼团详情
  getptList(){
    let that = this;
    var data = {};
    data.id = 550580447711305;
    console.log(data)
    http.postReq('/api/pintuan/public/get_product_detail.htm', data, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })

      } else {

        return false;
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