// pages/LiveStudio/LiveStudio.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseid: '',
    sort: 1,
    list: [],
    pages: {},
    info: {},
    vid: "",
    deployInfo: wx.getStorageSync("deployInfo") || {
      audit_mode: "1"
    }
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
  playLive(e) {
    var item = e.currentTarget.dataset.item;
    if (item.status_text == "观看回放") {
      wx.navigateTo({
        url: '../liveRoom/liveRoom?id=' + item.room_id
      })
    } else if (item.can_open_live) {
      wx.navigateTo({
        url: '../liveRoom/liveRoom?id=' + item.room_id
      })
    } else {
      wx.showToast({
        title: '视频制作中，请稍后再试',
        icon: 'none'
      })
    }
  },
  goDetail() {
    var item = this.data.info;
    var id = "";
    var state = 0;
    if (item.promotions && item.promotions.length) {
      if (item.promotions[0].promotion_type == 4) {
        id = item.promotions[0].promotion_id;
        state = item.promotions[0].promotion_type == 4 ? 1 : 0
      } else {
        id = item.course_id
      }
    } else {
      id = item.course_id
    }
    wx.navigateTo({
      url: '../courseDetail/courseDetail?c_id=' + id + '&state=' + state
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getList(page) {
    var that = this;
    var id = this.data.courseid;
    http.postReq("/api/public/get_course_room_list.htm", {
      page: page ? page : 1,
      courseid: id,
      sort: this.data.sort
    }, function (res) {
      if (res.code == 0) {
        if (page > 1) {
          that.setData({
            list: that.data.list.concat(res.data.list),
            pages: res.data.pagination
          })
        } else {
          that.setData({
            list: res.data.list,
            pages: res.data.pagination
          })
        }
      }
    })
  },
  getInfo() {
    var that = this;
    var id = this.data.courseid;
    http.postReq("/api/public/get_course_detail.htm", {
      courseid: id
    }, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data
        })
      }
    })
  },
  changeSort() {
    this.setData({
      sort: this.data.sort == 1 ? 2 : 1
    })
    this.getList()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    var deployInfo = wx.getStorageSync("deployInfo");
    if (deployInfo) {
      this.setData({
        deployInfo: deployInfo
      })
    }
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
    var idx = this.data.pages.page_index;
    var max_idx = this.data.pages.max_page_index;
    if (idx == max_idx) return;
    this.getList(idx + 1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})