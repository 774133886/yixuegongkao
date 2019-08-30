// pages/myOrder/myOrder.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acitve: 0,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active: 0
    });
    
  },
  choiceTab(e){
    this.setData({
      active: e.currentTarget.dataset.idx
    })
  },
  goEva(){
    wx.navigateTo({
      url: '../evaluation/evaluation',
    })
  },
  goDetail(e){
    wx.navigateTo({
      url: '../orderDetail/orderDetail?state='+e.currentTarget.dataset.type,
    })
  },
  getList(){
    var that = this;
    http.postReq('/api/business/get_member_order_list.htm', { page:1,rows: 20},function(res){
        if(res.code==0){
          that.setData({
            list: res.data.list
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
    this.getList()
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