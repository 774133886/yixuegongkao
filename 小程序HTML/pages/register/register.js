// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btntext: "获取验证码",
    isCheck: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  checkText:function(){
    this.setData({
      isCheck: !this.data.isCheck
    })
  },
  getCode: function () {
    //这里是要调api接口的，我这里就假装已经调成功了，返回200了
    if (this.data.btntext != "获取验证码") {
      return false;
    }
    var _this = this
    var coden = 60    // 定义60秒的倒计时
    var codeV = setInterval(function () {
      _this.setData({    // _this这里的作用域不同了
        btntext: (--coden) + 's'
      })
      if (coden == -1) {  // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
        clearInterval(codeV)
        _this.setData({
          btntext: '获取验证码'
        })
      }
    }, 1000)  //  1000是1秒
  },
  goLogin(){
    wx.navigateBack()
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