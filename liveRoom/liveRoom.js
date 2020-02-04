// pages/liveRoom/liveRoom.js
var bjy = require('../../sdk/bjy');
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    excludeUsers: [],

    hidePlayer1: false,
    hidePlayer2: false,
    fullScreen: true,

    styleInfo: {
      playerWidth: 200,
      playerHeight: 150,
      gap: 0,
      wrapWidth: 350,
      fontSize: 12
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInfo(options.id)
  },
  onTapHide: function () {
    var me = this;
    me.setData({
      hidePlayer: true
    });
  },
  onTapFullScreen: function () {
    var me = this;
    me.setData({
      fullScreen: true
    });
  },

  getInfo(id){
    var that  = this;
    http.postReq("/api/business/live/get_live_data_wxapp.htm",{roomid:id},function(res){
      if(res.code==0){
        if (res.data.parameters && res.data.parameters.user){
          debugger;
          if (res.data.parameters.user.type == 0 || res.data.parameters.user.type == 2){//学生、管理员
            that.setData({
              hidePlayer1: true,
              hidePlayer2: false
            });
          } else if (res.data.parameters.user.type == 1){//老师
            that.setData({
              hidePlayer1: false,
              hidePlayer2: true
            });
          }
          bjy.init(res.data.parameters)
        }
        
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none'
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
    bjy.exit();
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

  },

  onSetUserList: function (event) {
    console.log('onSetUserList');
    console.log(event.detail);
  },
  onUserPlayerTap: function (event) {
    console.log('onUserPlayerTap');
    console.log(event.detail);
  },
  onAVStatusChange: function (event) {
    console.log('onAVStatusChange');
    console.log(event.detail);
  },
  onIsSupportedChanged: function (event) {
    console.log('onIsSupportedChanged');
    console.log(event.detail);
  },

  onPlayerTap: function (event) {
    bjy.info.tip('老师视频点击');
    console.log('用户触摸player');
    console.log(event);
  },
  onTeacherPlayerSupportedChanged: function (event) {
    if (event.detail.support) {
      console.log('当前流可以播放');
    } else {
      console.log('当前流不可以播放');
    }
  },
  onTeacherPlayerAVStatusChange: function (event) {
    if (typeof event.detail.changeInfo.videoTo == 'boolean') {
      console.log('视频变化');
    }
    if (typeof event.detail.changeInfo.audioTo == 'boolean') {
      console.log('音频频变化');
    }
  }

})