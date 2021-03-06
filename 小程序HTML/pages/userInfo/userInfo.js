// pages/userInfo/userInfo.js
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    sexSelect: ["保密","男","女"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  goLogin(){
    wx.navigateTo({
      url: '../forget/forget?type=1',
    })
  },
  formSubmit(e){
    var data = e.detail.value;
    // data.name = this.data.info.name;
    data.year = this.data.info.birth_year;
    data.month = this.data.info.birth_month;
    data.day = this.data.info.birth_day;
    console.log(data);
    http.postReq("/api/member/member_detail_update.htm",data,function(res){
      if(res.code == 0){
        wx.showToast({
          title: "修改成功",
          icon: "none"
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
  },
  goOut(){
    wx.removeStorageSync("token");
    wx.switchTab({url: "../index/index"})
  },
  getInfo() {
    var that = this;
    http.getReq('api/member/member_detail.htm', {}, function (res) {
      if (res.code == 0) {
        res.data.mobile2 = res.data.mobile.substring(0, 3) + "****" + res.data.mobile.substring(7, 11)
        that.setData({
          info: res.data
        })
      }
    })
  },
  sexChange(e) {
    var info = this.data.info;
    info.sex = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      info: info
    })
  },
  setEmail(e){
    var info = this.data.info;
    info.email = e.detail.value;
    this.setData({
      info: info
    })
  },
  dateChange(e){
    var info = this.data.info;
    var date = e.detail.value.split("-");
    info.birth_year = date[0];
    info.birth_month = date[1];
    info.birth_day = date[2];
    this.setData({
      info: info
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
    this.getInfo()
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