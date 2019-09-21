// pages/orderDetail/orderDetail.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    payShow: false,
    payInfo: {},
    wxPay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
  },
  goDetail(){
    wx.navigateTo({
      url: '../courseDetail/courseDetail',
    })
  },
  getInfo(){
    var that = this;
    http.postReq("/api/business/get_order_detail.htm", { orderid: this.data.id},function(res){
      if (res.code == 0) {
        var content = res.data.tip_message;
        WxParse.wxParse('article', 'html', content, that, 5);
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
  orderButtonClick(e) {
    var that = this;
    var type = e.currentTarget.dataset.type;
    var text = e.currentTarget.dataset.text;
    switch (text) {
      case '立即支付':
        var info = that.data.info;
        var payInfo = {};
        payInfo.order_id = info.order_id;
        payInfo.price = info.pay_price;
        that.setData({
          wxPay: true,
          payInfo: payInfo
        });
        break;
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
        if (info && info.service_phone) {
          wx.makePhoneCall({
            phoneNumber: info.service_phone,
          })
        }
      case '评价课程':
        var info = that.data.info;
        wx.navigateTo({
          url: '../evaluation/evaluation?id=' + info.course.id,
        })
        break;
      case '拼团中':
        var info = that.data.info;
        wx.navigateTo({
          url: '../assembling/assembling?g_id=' + info.pintuan.group.id + '&p_id=' + info.product_id,
        })
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
    this.getInfo();
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