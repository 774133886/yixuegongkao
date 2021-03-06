// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sText:'',
    s_history:[],
    isfocus:true,
  },
  setp: function (e) {
    console.log(e.detail.value);
    this.setData({
      sText: e.detail.value
    })
  },
  goSearch(){
    if (!this.data.sText){
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      })
    }else{
      var s_history = this.data.s_history;
      console.log(typeof s_history)
      s_history.unshift(this.data.sText);
      wx.setStorageSync('s_history', s_history);
      wx.navigateTo({
        url: '/pages/searchList/searchList?kw=' + this.data.sText,
      })
      this.setData({
        sText: '',
      })
    }
  },
  clearHis(){
    var that = this
    wx.showModal({
      // title: '提示',
      content: '是否清除搜索记录？',
      success (res) {
        if (res.confirm) {
          wx.removeStorageSync('s_history');
          that.setData({
            s_history:[],
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    
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
    if (wx.getStorageSync('s_history')){
      this.setData({
        // 数组去重
        s_history: Array.from(new Set(wx.getStorageSync('s_history'))).slice(0,9)
      })
    }else{
      this.setData({
        s_history:[]
      })
    }
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