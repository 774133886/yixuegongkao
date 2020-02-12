// pages/follow/follow.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deployInfo: wx.getStorageSync("deployInfo") || { audit_mode: "1" }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 长按
  // previewImage: function (e) {
  //   var current = e.target.dataset.src;
  //   wx.previewImage({
  //     current: current,
  //     urls: [current]
  //   })
  // },
  copy: function (e) {
    var that = this;
    wx.setClipboardData({
      data: "逸学公考",
      success: function (res) {
        wx.showToast({
          icon: 'none',
          title: '复制成功',
        });
      }
    });
  },
  // 保存图片
  saveImage() {
    wx.showLoading({
      title: '保存中...',
      mask: true,
    });
    var deployInfo = this.deployInfo;
    wx.downloadFile({
      url: deployInfo.wx_qrcode_url,
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          let img = res.tempFilePath;
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'none',
                duration: 2000
              });
            },
            fail(res) {
              wx.showToast({
                title: '保存失败',
                icon: 'none',
                duration: 2000
              });
            }
          });
        }
      }
    });
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

    var deployInfo = wx.getStorageSync("deployInfo");
    if (deployInfo) {
      this.setData({
        deployInfo: deployInfo
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