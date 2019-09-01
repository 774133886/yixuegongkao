// pages/myOrder/myOrder.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [[],[],[],[]],
    pages: [{},{},{},{}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      active: 0
    });
    
  },
  //取消订单
  cancelOrder(e){
    var id = e.currentTarget.dataset.id;
    http.postReq("/api/business/cancle_order.htm", { orderid: id },function(res){
      if(res.code==0){

      }else{
        wx.showToast({
          title: res.message,
          icon: "none"
        })
      }
    })
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
  swiperChange(e){
    this.setData({
      active: e.detail.current
    });
    if (this.data.list[this.data.active].length == 0) {
      this.getList()
    }
  },
  getList(obj){
    var that = this;
    var data = {};
    switch (this.data.active){
      case 0:
        data.status = "";
        break;
      case 1:
        data.status = 2;
        break;
      case 2:
        data.status = 1;
        break;
      case 3:
        data.status = 6;
        break;
    }
    Object.assign(data,obj?obj:{});
    http.postReq('/api/business/get_member_order_list.htm', data,function(res){
        if(res.code==0){
          var list = that.data.list;
          if (list[that.data.active].length == 0) {
            list[that.data.active] = res.data.list;
          } else {
            list[that.data.active] = list[that.data.active].concat(res.data.list);
          }
          var pages = that.data.pages;
          pages[that.data.acitve] = res.data.pagination;
          that.setData({
            list: list,
            pages: pages
          })
        }
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