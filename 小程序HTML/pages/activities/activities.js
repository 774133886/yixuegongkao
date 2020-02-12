// pages/activities/activities.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
let pt_set = null;
let ms_set = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [[], []],
    pt_list: [],
    ms_list: [],
    pages: [{}, {}],
    isShow: true,
    nomore: false,
    refreshing: true,
    deployInfo: wx.getStorageSync("deployInfo") || { audit_mode: "1" }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
  choiceTab(e){
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },
  swiperChange(e) {
    this.setData({
      active: e.detail.current
    });
    if (this.data.list[this.data.active].length == 0) {
      this.getList()
    }
  },
  //下拉刷新监听函数
  _onPullDownRefresh: function () {
    this.setData({
      isShow: true
    });
    this.getList();
  },
  getList(obj){
    let that = this;
    var data = {};
    var url = "";
    if(this.data.active==0){
      url = "/api/pintuan/public/get_product_list.htm"
    } else if (this.data.active==1){
      url = "/api/public/get_promotion_list.htm";
      data.type = 2
    }
    Object.assign(data, obj ? obj : {});
    // data.token = token;
    http.getReq(url, data, function (res) {
      if (res.code == 0) {
        res.data.list.forEach(function (v, i) {
          v.last_time = (new Date(v.end_time.replace('-', '/').replace('-', '/')).getTime() - Date.parse(new Date())) / 1000;
        });
        var list = that.data.list;
        if (list[that.data.active].length == 0 || that.data.isShow) {
          list[that.data.active] = res.data.list;
        } else {
          list[that.data.active] = list[that.data.active].concat(res.data.list);
        }
        var pages = that.data.pages;
        pages[that.data.active] = res.data.pagination; 
        that.setData({
          list: list,
          pages: pages,
          isShow: false,
          refreshing: false
        });
        that.setData({
          pt_list: that.data.list[0],
          ms_list: that.data.list[1]
        });
        that.startTime()
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  startTime(){
    var that = this;
    var aclist = [];
    if (this.data.active == 0) {
      clearInterval(pt_set);
      pt_set = setInterval(time1, 1000);
    } else if (this.data.active == 1) {
      clearInterval(ms_set);
      ms_set = setInterval(time2, 1000);
    }
    function time1() {
      aclist = that.data.pt_list;
      
      aclist.forEach(function (a, i) {
        var time = a.last_time
        if (a.last_time) {
          if (a.last_time == 1) {
            a.last_time = 0;
            clearInterval(countTime);
            // 重新获取数据
            that.getList();
          } else {
            a.last_time--;
          }
          that.setData({
            pt_list: aclist
          })

        } else {
          return false;
        }
      })
    }
    function time2() {
      aclist = that.data.ms_list;

      aclist.forEach(function (a, i) {
        var time = a.last_time
        if (a.last_time) {
          if (a.last_time == 1) {
            a.last_time = 0;
            clearInterval(countTime);
            // 重新获取数据
            that.getList();
          } else {
            a.last_time--;
          }
          that.setData({
            ms_list: aclist
          })

        } else {
          return false;
        }
      })
    }
  },
  goDetail(e){
    wx.navigateTo({
      url: '../courseDetail/courseDetail?c_id=' + e.currentTarget.dataset.id +'&state='+(this.data.active?"0":"1"),
    })
  },
  bindscrolltolower() {
    var page = this.data.pages[this.data.active].page_index;
    var max_page = this.data.pages[this.data.active].max_page_index;
    if (page == max_page) {
      return;
    }
    this.getList({ page: page + 1 })
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
    this.setData({
      isShow: true
    })
    this.getList()
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