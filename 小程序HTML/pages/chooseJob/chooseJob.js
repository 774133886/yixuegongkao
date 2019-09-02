// pages/chooseJob/chooseJob.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shText:'',
    nomore: false,
    page: 1,
    totalPage: 1,
    rows: 10,
    c_id:'',
    keyword:'',
    jobList: [],
    c_price:'',
    idx:0,
    id:''
  },
  // 单选
  selectThis(e){
    var idx = e.currentTarget.dataset.idx;
    var c_price = e.currentTarget.dataset.price;
    var id = e.currentTarget.dataset.id;
    var jobLists = this.data.jobList;
    console.log(c_price)
    jobLists.forEach((i,v)=>{
      i.selected = false;
    })
    jobLists[idx].selected = true;
    this.setData({
      jobList: jobLists,
      c_price: c_price,
      id:id,
    })
  },
  nextStep(){
    if (this.data.id){
      wx.navigateTo({
        url: '/pages/writeInfo/writeInfo?c_id='+this.data.id
      })
    }else{
      wx.showToast({
        title: '请先选择职位',
        icon: 'none',
        duration: 2000
      })
    }
    
  },
  getlist(){
    // 
    let that = this;
    var data = {};
    data.courseid = that.data.c_id;
    data.keyword = that.data.shText;
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
      // var s_history = this.data.s_history;
      // console.log(typeof s_history)
      // s_history.unshift(this.data.shText);
      // wx.setStorageSync('s_history', s_history);
      this.setData({
        page: 1,
      })
      this.getlist();
    }
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
    this.getlist();
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
    this.getlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})