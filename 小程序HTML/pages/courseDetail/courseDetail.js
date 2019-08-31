// pages/courseDetail/courseDetail.js
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
    shareShow:false,
    contactShow:false,
    sServiceTel:'15928773528',
    state:0,
    pjshow:true,
    type:0,
    c_id:'',
    pjInfo:{},
    pjList:[],
    pjscore:0,
    promotions:[], //活动
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    this.setData({
      state: options.state
    })
    if (options.c_id){
      this.setData({
        c_id: options.c_id
      })
    }
    // 获取详情
    this.getInfo();
    this.getpjList();
  },
  //分享遮罩
  shareTab: function (e) {
    this.setData({ shareShow: !this.data.shareShow })
  },
  contactTab: function (e) {
    this.setData({ contactShow: !this.data.contactShow })
  },
  // 赞
  liketap(e){
    let that = this;
    let islike = e.currentTarget.dataset.like;
    let index = e.currentTarget.dataset.idx;
    console.log(islike)
    let com_id = e.currentTarget.dataset.comid;
    let pjList = that.data.pjList;
    if(!islike){
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
    }else{
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
  // 回到首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //电话
  phonecallevent: function (e) {
    var phoneNum = e.currentTarget.dataset.pnum
    wx.makePhoneCall({
      phoneNumber: phoneNum.toString()
    })
  },
  writeInfo: function (e) {
    wx.navigateTo({
      url: '/pages/addAdress/addAdress'
    })
  },
  writeInfo2: function (e) {
    wx.navigateTo({
      url: '/pages/chooseJob/chooseJob'
    })
  },
  // 评价折叠
  changepj(){
    this.setData({ pjshow: !this.data.pjshow })
  },

  // 获取课程详情
  getInfo(){
    let that = this;
    var data = {};
    data.courseid = this.data.c_id;
    http.postReq('api/public/get_course_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({ 
          info: res.data,
          promotions: res.data.promotions[0],
          pjscore: Math.floor(res.data.score) 
        })
        var content = res.data.intro;
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
  // 获取评价详情
  getpjList() {
    let that = this;
    var data = {};
    data.courseid = this.data.c_id;
    
    http.postReq('api/public/get_course_comment_list.htm', data, function (res) {
      if (res.code == 0) {
        console.log(res.data)
        that.setData({
           pjInfo: res.data,
            pjList: res.data.list.slice(0,2),
           
            });
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
      path: '/pages/courseDetail/courseDetail?c_id=' + that.data.c_id,
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