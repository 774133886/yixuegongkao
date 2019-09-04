const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持 
  },
  /** 
   * 组件的属性列表 
   * 用于组件自定义设置 
  */
  properties: {
  
    payInfo: {
      type: Object,
      value: {}
    },
    isPt: {
      type: Boolean,
      value: false
    },
    // 弹窗内容 
    content: { type: String, value: '弹窗内容' },
    // 弹窗取消按钮文字 
    cancelText: { type: String, value: '取消' },
    // 弹窗确认按钮文字 
    confirmText: { type: String, value: '确定' }
  },
  /** 
   * 私有数据,组件的初始数据 
   * 可用于模版渲染 
   */
  data: { // 弹窗显示控制 
    
    payShow: true
  },
  /**
   * 组件的方法列表 
   * 更新属性和数据的方法与更新页面数据的方法类似 
  */
  methods: {
    /** 
    * 公有方法 
    */
    
    // 点击支付
    payTap() {
      let that = this;
      var data = {};
      data.orderid = that.data.payInfo.order_id;
      data.client = 5;
      // data.orderid = '00221167';

      http.postReq('api/business/wx_pre_pay_order.htm', data, function (res) {
        var data = res.data;
        that.wxPay(data, function () {
          wx.hideLoading();
          // wx.setStorageSync('subject', that.data.subject);
          // if (that.data.isPt){
          //   // 隐藏支付弹窗
          //   that.triggerEvent('payShow', false);
          //   // 更改拼团state
          //   that.triggerEvent('changeState', 1);
          // }else{
          // 成功返回函数
            that.triggerEvent('afterSuc', 1);
            // wx.navigateTo({
            //   url: '/pages/paySuccess/paySuccess'
            // })
          // }
          
        });
      })
    },
    //付款
    wxPay: function (data, func) {
      var that = this;
      wx.requestPayment({
        appId: data.appid,
        timeStamp: String(data.timestamp),
        nonceStr: data.nonce_str,
        package: data.package,
        signType: data.sign_type,
        paySign: data.sign,
        success(res) {
          wx.showToast({
            title: '支付成功',
            icon: 'none'
          });
          
          that.setData({ payShow: false });
          // that.getlist();
          typeof func == 'function' && func();
        },
        fail(res) {
          console.log(res)
          wx.showToast({
            title: '支付失败',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/myOrder/myOrder',
            })
          }, 1500)
        }
      })
    },
    payTab: function (e) {
      var that = this;
      wx.showModal({
        // title: '提示',
        content: '确定取消支付吗？',
        success (res) {
          if (res.confirm) {
            that.triggerEvent('payShow',false);
            // that.setData({ payShow: !this.data.payShow })
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/myOrder/myOrder',
              })
            }, 1000)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      // wx.to
      
    },
    /** 
     * 内部私有方法建议以下划线开头 
     * triggerEvent 用于触发事件 
    */
    _cancelEvent() { //触发取消回调 
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent() { //触发成功回调 
      this.triggerEvent("confirmEvent");
    }
  }
})