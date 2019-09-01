// pages/evaluation/evaluation.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [1,2,3,4,5],
    checkStar: 0,
    text: "",
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  },
  tapStar(e){
    this.setData({
      checkStar: e.currentTarget.dataset.star
    })
  },
  textInput(event){
    this.setData({
      text: event.detail.value
    })
  },
  submit(){
    var data = {};
    data.courseid = this.data.id;
    data.content = this.data.text;
    data.score = this.data.checkStar;
    http.postReq("/api/business/save_course_comment.htm",data,function(res){
      if(res.code==0){
        wx.redirectTo({
          url: "../evaluatSuccess/evaluatSuccess"
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: "none"
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

  }
})