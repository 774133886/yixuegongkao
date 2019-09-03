// pages/orderDetail/orderDetail.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // id: options.id
      id: '00221162'
    });
    this.getInfo();
  },
  goDetail(){
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },
  getInfo(){
    var that = this;
    http.postReq("/api/business/get_order_detail.htm", { orderid: this.data.id},function(res){
      if(res.code==0){
        that.setData({
          info: res.data
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
        })
      }
    })
  },
  //点击按钮
  orderButtonClick() {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var text = e.currentTarget.dataset.text;
    switch (text) {
      case '开始学习':
        var info = that.data.info;
        if (info.course && info.course.id){
          wx.navigateTo({
            url: '../LiveStudio/LiveStudio?id=' + info.course.id,
          })
        }
        break;
      case '联系客服':
        var info = wx.getStorageSync("deployInfo");
        if (info && info.info.service_phone) {
          wx.makePhoneCall({
            phoneNumber: info.service_phone,
          })
        }
        break;
      default:
        break;
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