// pages/myEvaluate/myEvaluate.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    page: {},
    starList: [1, 2, 3, 4, 5]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  goDetail(e) {
    wx.navigateTo({
      url: '../courseDetail/courseDetail?c_type=3&c_id=' + e.currentTarget.dataset.id,
    })
  },
  getList(page) {
    var that = this;
    http.postReq("/api/business/get_member_comment_list.htm", {
      page: page ? page : 1
    }, function (res) {
      if (res.code == 0) {
        if (page > 1) {
          that.setData({
            list: that.data.list.concat(res.data.list),
            page: res.data.pagination
          })
        } else {
          that.setData({
            list: res.data.list,
            page: res.data.pagination
          })
        }
        // that.setData({
        //   list: res.data.list,
        //   page: res.data.pagination
        // })
      }
    })
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
    var idx = this.data.page.page_index;
    var max_idx = this.data.page.max_page_index;
    if (idx == max_idx) return;
    this.getList(idx + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})