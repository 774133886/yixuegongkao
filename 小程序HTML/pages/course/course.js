// pages/course/course.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: ["6","1","2","3","4","8","9"],
    courseList: [
      [],[],[],[],[],[],[]
    ],
    pageList: [
      {},{},{},{},{},{},{}
    ],
    scrollList: [0,0,0,0,0,0,0],
    floorstatus: false,
    isShow: true
  },
  choiceTab(e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },
  swiperChange(e){
    this.setData({
      active: e.detail.current
    });

    var flag = false;
    if (this.data.scrollList[this.data.active] > 100) {
      flag = true
    } else {
      flag = false
    }
    this.setData({
      floorstatus: flag
    });
    if(this.data.courseList[this.data.active].length == 0){
      this.getInfo()
    }
  },
  getInfo(obj){
    var that = this;
    var active = this.data.active;
    var data = {};
    if(active==5){
      data["type"] && delete data["type"];
      data.promotionType = 4
    } else if (active == 6){
      data["type"] && delete data["type"];
      data.promotionType = 2
    } else if (active == 0) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 5
    } else {
      data["promotionType"] && delete data["promotionType"];
      data.type = active
    }
    var params = Object.assign(data, obj ? obj : {})
    http.postReq('/api/public/get_course_list.htm', params,function(res){
      if(res.code == 0){
        var list = that.data.courseList;
        var pages = that.data.pageList;
        pages[that.data.active] = res.data.pagination;
        if (list[that.data.active].length == 0 || that.data.isShow){
          list[that.data.active] = res.data.list;
        }else{
          list[that.data.active] = list[that.data.active].concat(res.data.list);
        }
        that.setData({
          courseList: list,
          pageList: pages,
          isShow: false,
          refreshing: false
        })
      }
    })
  },
  bindscrolltolower(){
    var page = this.data.pageList[this.data.active].page_index;
    var max_page = this.data.pageList[this.data.active].max_page_index;
    if (page == max_page){
      return;
    }
    this.getInfo({ page: page+1})
  },
  // 获取滚动条当前位置
  scrollChange: function (e) {
    var list = this.data.scrollList;
    var active = this.data.active;
    list[active] = e.detail.scrollTop;
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true,
        scrollTop: list
      });
    } else {
      this.setData({
        floorstatus: false,
        scrollTop: list
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    var list = this.data.scrollList;
    var active = this.data.active;
    list[active] = 0;
    setTimeout(()=>{
      this.setData({
        scrollList: list
      })
    })
  },
  //下拉刷新监听函数
  _onPullDownRefresh: function () {
    this.setData({
      isShow: true
    });
    this.getInfo();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        active: options.type
      })
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
    var type = wx.getStorageSync("c_type");
    if (type){
      this.setData({
        active: type
      })
    }
    this.setData({
      isShow: true
    })
    this.getInfo();
    wx.removeStorageSync("c_type");
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