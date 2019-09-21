// pages/allApply/allApply.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layer:false,
    pjInfo:{},
    pjList: [],
    nomore: false,
    page: 1,
    totalPage: 1,
    rows: 10,
    c_id:'',
  },
  layershow(){
    this.setData({
      layer:true
    })
  },
  layerhide() {
    this.setData({
      layer: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      c_id: options.com_id
    });
    // 获取评价列表
    this.getpjList();
  },

  // 获取
  getpjList() {
    let that = this;
    var data = {};
    data.commentid = that.data.c_id;
    data.page = that.data.page;
    data.rows = that.data.rows;
    http.postReq('api/public/get_comment_reply_list.htm', data, function (res) {
      if (res.code == 0) {

        if (that.data.page == 1) {
          console.log(res.data)
          that.setData({
            pjInfo: res.data.comment,
            pjList: res.data.replys.list,
            totalPage: Math.ceil(res.data.replys.pagination.max_row_count / that.data.rows)
          });
          wx.setNavigationBarTitle({
            title: res.data.replys.pagination.max_row_count +'条回复'
          })
          
        } else {
          that.setData({
            pjList: that.data.pjList.concat(res.data.replys.list),
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
  // 评论获取
  textCom: function (e) {
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    })
  },
  // 回复评论
  replyCom(){
    let that = this;
    var data = {};
    data.commentid = that.data.c_id;
    data.content = that.data.content;
    if (!that.data.content){
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    http.postReq('api/business/reply_course_comment.htm', data, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          layer: false,
          page:1,
          content:''
        })
        // 重新回去数据
        that.getpjList();
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 赞
  liketap(e) {
    let that = this;
    let islike = e.currentTarget.dataset.like;
    console.log(islike)
    let com_id = e.currentTarget.dataset.comid;
    let pjInfo = that.data.pjInfo;
    if (!islike) {
      var data = {};
      data.commentid = com_id;
      http.postReq('api/business/comment_praise.htm', data, function (res) {
        if (res.code == 0) {
          pjInfo.praise_count++;
          pjInfo.is_member_praise = true;
          that.setData({
            pjInfo: pjInfo
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
          pjInfo.praise_count--;
          pjInfo.is_member_praise = false;
          that.setData({
            pjInfo: pjInfo
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
  // 赞
  liketap2(e) {
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
          console.log(index)
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
    this.getpjList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})