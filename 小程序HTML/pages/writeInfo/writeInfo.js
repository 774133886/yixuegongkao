// pages/writeInfo/writeInfo.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btntext: "获取验证码",
    enroll_fields:[],
    payShow: false,
    accountShow: false,
    region: ['北京市', '北京市','朝阳区'],
    payInfo:{},
    phone:'',
    fromPt:{},
    info:{},
    isIos: false
  },
  payShow(e) {
    console.log(e.detail)
    this.setData({ wxPay: e.detail, accountShow: e.detail })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  // input
  changeInput: function (e) {
    var key = e.currentTarget.dataset.keyName;
    var value = e.detail.value;
    this.setData({
      [key]: value
    });
  },

  getCode: function () {
    //这里是要调api接口的，我这里就假装已经调成功了，返回200了
    if (this.data.btntext != "获取验证码") {
      return false;
    }
   
    var myreg = /^[1][0-9][0-9]{9}$/;
    if (!myreg.test(this.data.mobile)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    
    var data = {};
    data.mobile = this.data.mobile;
    data.id = this.data.c_id;
    data.type = "M";
    var _this = this
    var coden = 60    // 定义60秒的倒计时
    // return false;
    http.postReq('/api/business/send_enroll_code.htm', data, function (res) {
      if (res.code == 0) {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
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

      } else {

        return false;
      }
    })

    
    
  },
  formSubmit(e){
    var that = this; 

    if (that.data.isIos) {
      wx.showModal({
        title: '温馨提示',
        content: '小程序暂不支持购买此权益',
        confirmText: '好的',
        showCancel: false
      })
      return false
    }

    let jsonObj = e.detail.value
    console.log(jsonObj)
    for (var key in jsonObj) {
      var html = ''
      html += (key + ' : ' + jsonObj[key]);
      console.log(html)
      if (jsonObj[key]==''){
          wx.showToast({
            title: '基础信息输入不能为空',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      } 
    if (e.detail.value.mobile){
        var myreg = /^[1][0-9][0-9]{9}$/;
        if (!myreg.test(e.detail.value.mobile)) {
          wx.showToast({
            title: '手机号格式错误',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }
    var data = e.detail.value;

      // 判断是否有其他信息
    if (that.data.extra){
      if (!that.data.grade || !that.data.rank || !that.data.number || !that.data.grade_aat || !that.data.grade_essay || !that.data.grade_other) {
        wx.showToast({
          title: '成绩信息输入不能为空',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      data.extra =  JSON.stringify({
        'grade': that.data.grade,
        'rank': that.data.rank,
        'number': that.data.number,
        'grade_aat': that.data.grade_aat,
        'grade_essay': that.data.grade_essay,
        'grade_other': that.data.grade_other,
      })
    }
    // 判断是否有地址
    if (that.data.address) {
      if (!that.data.doorNum) {
        wx.showToast({
          title: '小区及门牌号输入不能为空',
          icon: 'none',
          duration: 2000
        })
        return false
      }
      data.address = that.data.region[0] + that.data.region[1] + that.data.region[2]+that.data.doorNum
    }
    // 获取支付信息
    if(that.data.fromPt.ispt){
      // 判断来自拼团
      if(that.data.fromPt.g_id){
        console.log("拼团支付");
   
        data.productId = that.data.fromPt.p_id;
        data.groupId = that.data.fromPt.g_id;
        data.client = 5;
        
        http.postReq('/api/business/pintuan/join_group.htm', data, function (res) {
          if (res.code == 0) {

            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3000,
            })
            // 支付
            if (res.data.status = 2) {
              var list = res.data;
              list.isjoinpt = true;
              that.setData({
                payShow: !that.data.payShow,
                // wxPay: !that.data.wxPay,
                payInfo: list
              })
              // that.setData({
              //   accountShow: !that.data.accountShow,
              // })
            } else if (res.data.status == 1 || res.data.status == 6) {
              setTimeout(() => {
                wx.navigateBack(2);
              }, 1500)
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }else{
        console.log("开团支付");

        data.productId = that.data.fromPt.p_id;
        data.client = 5;

        http.postReq('/api/business/pintuan/create_group.htm', data, function (res) {
          if (res.code == 0) {
            
            wx.showToast({
              title: res.data.message,
              icon: 'none',
              duration: 3000,
            })
            // 支付
            if (res.data.status = 2) {
              that.setData({
                payShow: !that.data.payShow ,
                // wxPay: !that.data.wxPay,
                payInfo: res.data,
                pintuan: res.data.pintuan,
              })
              // that.setData({
              //   accountShow: !that.data.accountShow,
              // })
              wx.setStorageSync('pintuan', res.data.pintuan);
            } else if (res.data.status == 1 || res.data.status == 6) {
              setTimeout(() => {
                wx.navigateBack(2);
              }, 1500)
            }
          } else {
            wx.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    }else{
      // 判断来自普通商品
      data.courseid = that.data.c_id; 
      data.client = 5;
      // data.token = token;
      http.postReq('/api/business/course_enroll.htm', data, function (res) {
        if (res.code == 0) {
          console.log(res.data);
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 3000,
          })
          // 支付
          if (res.data.status = 2){
            that.setData({
              payShow: !that.data.payShow ,
              payInfo:res.data
            })
            // that.setData({
            //   accountShow: !that.data.accountShow,
            // })
          } else if (res.data.status == 1 || res.data.status == 6){
            setTimeout(()=>{
              wx.navigateBack();
            },1500)
          } 
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 3000
          })
          if(res.code==8){
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/myOrder/myOrder',
              })
            }, 1500)
          }
        }
      });
    }
    
  },
  // 点击支付
  payTap(){
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
        if(that.data.fromPt.ispt){
          if(that.data.fromPt.g_id){
            // 开团返回
            wx.setStorageSync('back', 0);
            setTimeout(()=>{
              wx.removeStorageSync('fromPt');
              wx.navigateBack();
            },500)
          }else{
            // 拼团返回
            wx.setStorageSync('back', 1);
            setTimeout(()=>{
              wx.removeStorageSync('fromPt');
              wx.navigateBack();
            },500)
          }
        }else{
          wx.navigateTo({
            url: '/pages/paySuccess/paySuccess？id='+that.data.payInfo.order_id
          })
        }
        
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
      }
    })
  },
  payTab: function (e) {
    var that = this;
    wx.showModal({
      // title: '提示',
      content: '确定取消支付吗？',
      success(res) {
        if (res.confirm) {
          that.setData({ payShow: !that.data.payShow })
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
    
  },
  // 获取个人信息
  getInfo(){ 
    var that = this;
    http.getReq('api/member/member_detail.htm',{}, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data,
        })
      }
      // 预存数据
      if(that.data.enroll_fields.includes('qq')){
        that.setData({
          qq: res.data.qq,
        })
      }
      if(that.data.enroll_fields.includes('realname')){
        that.setData({
          realname: res.data.real_name,
        })
      }
      if(that.data.enroll_fields.includes('mobile')){
        that.setData({
          mobile: res.data.mobile,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      enroll_fields: wx.getStorageSync('enroll_fields'),
      enroll_code_tips: wx.getStorageSync('enroll_code_tips'),
      c_id: options.c_id,
      fromPt: wx.getStorageSync('fromPt')
      
    }) 
    that.data.enroll_fields.forEach(function(v,i){
      console.log(v)
      that.setData({
        [v]: 1
      });
    })
    console.log(that.data.address);
    // 获取基本信息
    this.getInfo();
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
    //2020.7.30
    // 判断IOS
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        console.log(res)
        // 判断ios
        if (res.platform == "ios") {
          that.setData({
            isIos: true
          })
          console.log(that.data.isIos)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.removeStorageSync('fromPt');
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