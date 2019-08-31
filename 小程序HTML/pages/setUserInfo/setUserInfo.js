// pages/setUserInfo/setUserInfo.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    province: "",
    city: "",
    provinceList: [],
    cityList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProvince();
  },
  setName(e){
    this.setData({
      name: e.detail.value
    })
  },
  bindPickerChange(e){
    this.setData({
      province: e.detail.value
    });
    this.getCity(this.data.provinceList[e.detail.value].id);
  },
  bindPickerChange2(e){
    this.setData({
      city: e.detail.value
    });
  },
  getProvince(){
    var that = this;
    http.postReq("/api/app/get_province_list.htm",{},function(res){
      if(res.code == 0){
        that.setData({
          provinceList: res.data
        })
      }
    })
  },
  getCity(id) {
    var that = this;
    http.postReq("/api/app/get_city_list.htm", { province: id }, function (res) {
      if (res.code == 0) {
        that.setData({
          cityList: res.data
        })
      }
    })
  },
  formSubmit(){
    if(!this.data.name){
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.province) {
      wx.showToast({
        title: '请选择省份',
        icon: 'none'
      });
      return false;
    }
    if (!this.data.city) {
      wx.showToast({
        title: '请选择城市',
        icon: 'none'
      });
      return false;
    }
    var data = {};
    data.name = this.data.name;
    data.province = this.data.provinceList[this.data.province].id;
    data.city = this.data.cityList[this.data.city].id;
    http.postReq("/api/member/member_update.htm", data,function(res){
      if(res.code == 0){
        wx.switchTab({
          url: '../index/index',
        })
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
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