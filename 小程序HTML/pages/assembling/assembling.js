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
    info_con:{},
    shareShow: false,
    payShow:false,
    nomore: false,
    sServiceTel: '15928773528',
    p_id:'',
    c_id:''
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
    data.groupId = this.data.g_id;
    http.postReq('api/pintuan/public/get_group_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data.product,
          info_con: res.data,
          c_id: res.data.product.course.id
        })
        console.log(res.data.product.description.split(',')) 
        var content = res.data.product.course.intro;
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.g_id) {
      this.setData({
        g_id: options.g_id
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
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var info = that.data.Info;
    return {
      title: '跟我一起学习这门课程',
      path: '/pages/assembling/assembling?g_id=' + that.data.g_id,
      imageUrl: info.image_large,
      success: (res) => {    // 成功后要做的事情
        //console.log(res.shareTickets[0])
        // console.log
        that.setData({
          shareShow: false
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})