// pages/myOrder/myOrder.js
const util = require('../../utils/util.js');
const http = require('../../http.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: [],
    pages: [],
    tabs: [],
    // payShow: false,
    payInfo: {},
    accountShow: false,
    isShow: true,
    wxPay: false,
    isIos: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
  // 支付
  payShow(e) {
    console.log(e.detail);
    this.setData({ wxPay: e.detail, accountShow: e.detail });
  },
  // 获取tabs
  getTabs() {
    var deployInfo = wx.getStorageSync('deployInfo');
    if (deployInfo) {
      this.setData({
        tabs: deployInfo.order_tabs,
      });
      this.loadList();
    } else {
      var that = this;
      http.getReq('api/app/wxapp_config.htm', {}, function (res) {
        if (res.code == 0) {
          wx.setStorageSync('deployInfo', res.data);
          setTimeout(() => {
            var deployInfo = wx.getStorageSync('deployInfo');
            if (deployInfo) {
              this.setData({
                deployInfo: deployInfo,
              });
            }
          });
          that.setData({
            tabs: deployInfo.order_tabs,
          });
          that.loadList();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000,
          });
        }
      });
    }
  },
  //格式化数组
  loadList() {
    var list = [];
    var pages = [];
    this.data.tabs.forEach(function (item, index) {
      list.push([]);
      pages.push({});
    });
    this.setData({
      list: list,
      pages: pages,
    });
    this.getList();
  },
  //取消订单
  cancelOrder(id) {
    // var id = e.currentTarget.dataset.id;
    var that = this;

    http.postReq('/api/business/cancle_order.htm', { orderid: id }, function (
      res,
    ) {
      if (res.code == 0) {
        wx.showToast({
          title: '取消订单成功',
          icon: 'none',
        });
        that.setData({
          isShow: true,
        });
        that.getList();
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
        });
      }
    });
  },
  choiceTab(e) {
    this.setData({
      active: e.currentTarget.dataset.idx,
    });
  },
  goEva() {
    wx.navigateTo({
      url: '../evaluation/evaluation',
    });
  },
  goDetail(id) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + id,
    });
  },
  goDetail2(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id,
    });
  },
  swiperChange(e) {
    this.setData({
      active: e.detail.current,
    });
    console.log(this.data.pages[this.data.active]);
    if (this.data.list[this.data.active].length == 0) {
      this.getList();
    }
  },
  getList(obj, flag) {
    var that = this;
    var data = {};
    data.status = this.data.tabs[this.data.active].status;
    Object.assign(data, obj ? obj : { page: 1 });
    http.postReq('/api/business/get_member_order_list.htm', data, function (
      res,
    ) {
      if (res.code == 0) {
        var list = that.data.list;
        if (list[that.data.active].length == 0 || that.data.isShow) {
          list[that.data.active] = res.data.list;
        } else {
          list[that.data.active] = list[that.data.active].concat(res.data.list);
        }
        var pages = that.data.pages;
        pages[that.data.active] = res.data.pagination;
        that.setData({
          list: list,
          pages: pages,
          isShow: false,
          refreshing: false,
        });
      }
    });
  },
  bindscrolltolower() {
    var page = this.data.pages[this.data.active].page_index;
    var max_page = this.data.pages[this.data.active].max_page_index;
    if (page == max_page) {
      return;
    }
    this.getList({ page: page + 1 });
  },
  //下拉刷新监听函数
  _onPullDownRefresh: function () {
    this.setData({
      isShow: true,
    });
    this.getList();
  },
  // 点击按钮
  orderButtonClick(e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var item = e.currentTarget.dataset.item;
    var type = e.currentTarget.dataset.type;
    var text = e.currentTarget.dataset.text;
    switch (text) {
      case '立即支付':
        var that = this;

        if (that.data.isIos) {
          wx.showModal({
            title: '温馨提示',
            content: '小程序暂不支持购买此权益',
            confirmText: '好的',
            showCancel: false,
          });
          return false;
          break;
        }
        var payInfo = {};
        payInfo.order_id = item.order_id;
        payInfo.price = item.pay_price;
        that.setData({
          wxPay: true,
          payInfo: payInfo,
        });
        break;
      case '继续报名':
        var payInfo = {};
        payInfo.order_id = item.order_id;
        payInfo.price = item.pay_price;
        that.setData({
          wxPay: true,
          payInfo: payInfo,
        });
        break;
      case '查看订单':
        that.goDetail(id);
        break;
      case '取消订单':
        wx.showModal({
          title: '提示',
          content: '确认要取消该订单吗？',
          success(res) {
            if (res.confirm) {
              that.cancelOrder(id);
            }
          },
        });
        break;
      case '开始学习':
        wx.navigateTo({
          url: '../LiveStudio/LiveStudio?id=' + item.course_id,
        });
        break;
      case '联系客服':
        var info = wx.getStorageSync('deployInfo');
        if (info && info.info.service_phone) {
          wx.makePhoneCall({
            phoneNumber: info.service_phone,
          });
        }
        break;
      case '评价课程':
        wx.navigateTo({
          url: '../evaluation/evaluation?id=' + item.course_id,
        });
        break;
      default:
        break;
    }
  },
  // 支付成功后
  afterSuc(e) {
    this.setData({
      wxPay: false,
    });
    this.getList();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        });
        console.log(res);
        // 判断ios
        if (res.platform == 'ios') {
          that.setData({
            isIos: true,
          });
          console.log(that.data.isIos);
        }
      },
    });
    this.setData({
      isShow: true,
    });
    this.getTabs();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
