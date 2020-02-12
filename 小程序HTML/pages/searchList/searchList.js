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
    s_history:[],
    nomore:false,
    page: 1,
    totalPage: 1,
    rows: 10,
    noData: false,
    deployInfo: wx.getStorageSync("deployInfo") || { audit_mode: "1" }
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
        if (that.data.page == 1) {
          that.setData({
            tjList: res.data.list,
            totalPage: Math.ceil(res.data.pagination.max_row_count / that.data.rows)
          });
        } else {
          that.setData({
            tjList: that.data.tjList.concat(res.data.list),
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

  setp: function (e) {
    console.log(e.detail.value);
    this.setData({
      shText: e.detail.value
    })
  },
  goSearch() {
    if (!this.data.shText) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      })
    } else {
      var s_history = this.data.s_history;
      console.log(typeof s_history)
      s_history.unshift(this.data.shText);
      wx.setStorageSync('s_history', s_history);
      this.setData({
        page: 1,
      })
      this.getlist();
    }
  },

  onLoad: function (options) {
    this.setData({
      shText: options.kw,
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
    if (wx.getStorageSync('s_history')) {
      this.setData({
        // 数组去重
        s_history: Array.from(new Set(wx.getStorageSync('s_history'))).slice(0, 9)
      })
    } else {
      this.setData({
        s_history: []
      })
    }
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
    // 分页加载
    var pages = this.data.page;
    var total = this.data.totalPage;
    console.log(pages, total)
    if (pages >= total) {
      this.setData({
        nomore: true
      });
      return false;
    }
    pages++;
    this.setData({
      page: pages
    });
    this.getlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})