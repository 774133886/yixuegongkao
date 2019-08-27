// pages/commentDtl/commentDtl.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layer: false,
    pjInfo: {},
    pjList: [],
    pjscore: 0,
    nomore: false,
    page: 1,
    totalPage: 1,
    rows: 10,
    cid:0,
  },
  layershow(e) {
    this.setData({
      layer: true
    });
    let cid = e.currentTarget.dataset.comid;
    if(cid){
      this.setData({
        cid: cid
      });
    }else{
      this.setData({
        cid: 0
      });
    }
  },
  layerhide() {
    this.setData({
      layer: false
    })
  },
  // 赞
  liketap(e) {
    let that = this;
    let islike = e.currentTarget.dataset.like;
    let index = e.currentTarget.dataset.idx;
    console.log(islike)
    let com_id = e.currentTarget.dataset.comid;
    let pjList = that.data.pjList;
    if (!islike) {
      var data = {};
      data.commentid = com_id;
      http.postReq('api/business/comment_praise.htm', data, function (res) {
        if (res.code == 0) {
          pjList[index].praise_count++;
          pjList[index].is_member_praise = true;
          that.setData({
            pjList: pjList
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    } else {
      var data = {};
      data.commentid = com_id;
      http.postReq('api/business/comment_praise_cancel.htm', data, function (res) {
        if (res.code == 0) {
          pjList[index].praise_count--;
          pjList[index].is_member_praise = false;
          that.setData({
            pjList: pjList
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pjscore: Math.floor(Number(options.score)),
      score: Number(options.score),
      c_id: options.c_id
    });
    // 获取详情
    this.getpjList(options.c_id);
    
    
  },

  // 获取评价详情
  getpjList(e) {
    let that = this;
    var data = {};
    data.courseid = e;
    data.page = that.data.page;
    data.rows = that.data.rows;
    http.postReq('api/public/get_course_comment_list.htm', data, function (res) {
      if (res.code == 0) {
        
        if (that.data.page == 1) {
          console.log(res.data)
          that.setData({
            pjInfo: res.data,
            pjList: res.data.list,
            totalPage: Math.ceil(res.data.pagination.max_row_count / that.data.rows)
          });
        } else {
          that.setData({
            pjList: that.data.pjList.concat(res.data.list),
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
    this.getpjList(this.data.c_id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})