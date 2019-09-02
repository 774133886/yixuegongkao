// pages/chooseJob/chooseJob.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nomore: false,
    page: 1,
    totalPage: 1,
    rows: 10,
    c_id:'',
    keyword:'',
    jobList: [{ phone: '15928764528', add: "浙江省南湖监狱（湖州安吉）", type: '艺术', selected: false }, { phone: '15928764528', add: "浙江省南湖监狱（湖州安吉）", type: '艺术', selected: false }, { phone: '15928764528', add: "浙江省南湖监狱（湖州安吉）", type: '艺术', selected: false }, { phone: '15928764528', add: "浙江省南湖监狱（湖州安吉）", type: '艺术', selected: false }, { phone: '15928764528', add: "浙江省南湖监狱（湖州安吉）", type: '艺术', selected: false }]
  },
  // 单选
  selectThis(e){
    var idx = e.currentTarget.dataset.idx;
    var jobLists = this.data.jobList;
    jobLists.forEach((i,v)=>{
      i.selected = false;
    })
    jobLists[idx].selected = true;
    this.setData({
      jobList: jobLists
    })
  },
  nextStep(){
    wx.navigateTo({
      url: '/pages/writeInfo/writeInfo'
    })
  },
  getlist(){
    // 
    let that = this;
    var data = {};
    data.courseid = that.data.c_id;
    data.keyword = that.data.keyword;
    data.page = that.data.page;
    data.rows = that.data.rows;
    http.postReq('api/public/get_course_job_list.htm', data, function (res) {
      if (res.code == 0) {
        
        if (that.data.page == 1) {
          console.log(res.data)
          var newlist = res.data.list
          newlist.forEach(function(v,i){
            v.selected = false;
          })
          that.setData({
            pjInfo: res.data,
            jobList: newlist,
            totalPage: Math.ceil(res.data.pagination.max_row_count / that.data.rows)
          });
        } else {
          var newlist = res.data.list
          newlist.forEach(function(v,i){
            v.selected = false;
          })
          that.setData({
            jobList: that.data.jobList.concat(newlist),
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      c_id: options.c_id,

    });
    // 获取列表
    this.getList();
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