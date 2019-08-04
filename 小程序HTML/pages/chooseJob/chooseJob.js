// pages/chooseJob/chooseJob.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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