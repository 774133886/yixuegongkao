// pages/searchList/searchList.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shText:'',
    tjList:[],
    page: 1,
    totalPage: 1,
    rows: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  //getlist
  getlist: function () {
    var token = wx.getStorageSync('token');
    if (!token) return;
    var that = this;
    let data = {};
    data.keyword = this.data.shText;
    data.page = that.data.page;
    data.rows = that.data.rows;
    // data.sort = 2;
    http.getReq('/api/public/get_course_list.htm', data, function (res) {
      // res.data.rows[0].articles[1].time = '2019.06.09'
      if (res.code == 0) {
        console.log(res.data.list);
        that.setData({
          tjList: res.data.list,
          totalPage: Math.ceil(res.data.pagination.max_row_count / that.data.rows)
        });
        if (res.data.list.length == 0) {
          that.setData({
            noData2: true
          });
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  onLoad: function (options) {
    this.setData({
      shText: options.kw
    })
    // 获取首页数据
    this.getlist();
    console.log(options.kw)
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