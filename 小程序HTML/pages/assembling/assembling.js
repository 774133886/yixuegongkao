// pages/assembling/assembling.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
var countTimeList = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    info_con:{},
    shareShow: false,
    payShow:false,
    accountShow: false,
    nomore: false,
    sServiceTel: '15928773528',
    p_id:'',
    c_id:'',
    ptTime: '',
    g_id:'',
    openState:1,//是否已经开团
    payInfo:{},
    wxPay:false,
    pintuan:{},
    ptInfo:{},
    memberList:[],
    description: ['1.支付开团并邀请好友参团，人数不足或超时自动退款','2.团长发起拼团后，可在订单页面查看；'],
    isIos: false
  },
  // 跳转订单页面
  goOrder(){
    wx.navigateTo({
      url: '../../pages/myOrder/myOrder'
    })
  },
  // 支付
  payShow(e) {
    console.log(e.detail)
    this.setData({ wxPay: e.detail, accountShow: e.detail })
  },
  changeState(e){
    console.log(e.detail)
    this.setData({ openState: 1 })
  },
  // 支付成功后
  afterSuc(e){
    console.log(e.detail)
    // 拼团返回
    if(e.detail==1){
      this.setData({
        openState: 2,
        wxPay: false,
      })
      wx.showToast({
        title: "拼团成功",
        icon: 'none',
        duration: 2000
      })
      this.getInfo();
    }else{
      // 开团返回
      console.log(this.data.pintuan)

      this.setData({
        openState: 1,
        wxPay: false,
        g_id: this.data.pintuan.group_id
      })
      wx.showToast({
        title: "开团成功",
        icon: 'none',
        duration: 2000
      })
      this.getInfo();
    }
    
  },
  // 填写信息支付成功返回到本页面后
  afterWhite(){
    console.log(detail)
    let detail = wx.getStorageSync('back')
    // 拼团返回
    if(detail==0){
      this.setData({
        openState: 2,
        // wxPay: false,
      })
      this.getInfo();
      wx.removeStorageSync('back')
    }else{
      // 开团返回
      this.setData({
        openState: 1,
        // wxPay: false,
        g_id: wx.getStorageSync('pintuan').group_id
      })
      this.getInfo();
      wx.removeStorageSync('back');
      wx.removeStorageSync('pintuan')
    }
    
  },

  // 拼团
  payTab(){
    let that = this;

    if (that.data.isIos) {
      wx.showModal({
        title: '温馨提示',
        content: '小程序暂不支持购买此权益',
        confirmText: '好的',
        showCancel: false
      })
      return false
    }

    let enroll_fields = wx.getStorageSync('enroll_fields')
    console.log(enroll_fields)
    wx.setStorageSync('fromPt', {ispt:true,p_id:this.data.p_id,g_id:this.data.g_id});
    if (enroll_fields.length) {
      console.log(that.data.c_id)
      wx.navigateTo({
        url: '/pages/writeInfo/writeInfo?c_id=' + that.data.c_id
      })
    } else {
      console.log("支付");
      var data = {};
      data.productId = this.data.p_id;
      data.groupId = this.data.g_id;
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
              // payShow: !that.data.payShow,
              wxPay: !that.data.wxPay,
              payInfo: list
            })
            // that.setData({
            //   accountShow: !that.data.accountShow,
            // })
          } else if (res.data.status == 1 || res.data.status == 6) {
            setTimeout(() => {
              wx.navigateBack();
            }, 1500)
          }
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
          if (res.code == 8) {
            setTimeout(() => {
              wx.navigateTo({
                url: '/pages/myOrder/myOrder',
              })
            }, 1500)
          }
        }
      })
    }
  },

  //分享遮罩
  shareTab: function (e) {
    this.setData({ shareShow: !this.data.shareShow })
  },
  //拼团失败遮罩
  closeMark: function (e) {
    this.setData({ nomore: !this.data.nomore })
  },
  //电话
  phonecallevent: function (e) {
    var phoneNum = e.currentTarget.dataset.pnum
    wx.makePhoneCall({
      phoneNumber: phoneNum.toString()
    })
  },
  // 获取拼团详情
  getInfo() {
    let that = this;
    var data = {};
    data.groupId = this.data.g_id;
    http.postReq('api/pintuan/public/get_group_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data.product,
          info_con: res.data,
          c_id: res.data.product.course.id,
          memberList: res.data.members.slice(1, res.data.members.length),
          description: res.data.product.description
        })
        // 修改状态标题
        if (res.data.group_size == res.data.current_users){
          wx.setNavigationBarTitle({
            title: '拼团已完成'
          })
        }else{
          if (res.data.members || res.data.members[0].is_promoter){
            wx.setNavigationBarTitle({
              title: '开团成功'
            })
          } else if (res.data.is_join){
            wx.setNavigationBarTitle({
              title: '参团成功'
            })
          }
        }
        

        var content = res.data.product.course.intro;
        WxParse.wxParse('article', 'html', content, that, 5);
        // 倒计时
        // var ptTime = (new Date(res.data.product.end_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
        var ptTime = (new Date(res.data.expire_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
        if (ptTime > 0) {
          var countTime = setInterval(function () {
            if (ptTime == 1) {
              ptTime = 0;
              clearInterval(countTime);
              // 重新获取数据
              that.setData({
                page: 1,
              })
              that.getList();
            } else {
              ptTime--;
            }
            that.setData({
              ptTime: ptTime,
            })
          }, 1000)
          countTimeList.push(countTime);
        } else {
          return false;
        }
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取开团详情
  getktInfo() {
    let that = this;
    var data = {};

    data.id = this.data.p_id;
    http.postReq('api/pintuan/public/get_product_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data,
          promotions: res.data.course_detail.promotions[0],
          // pjList: res.data.course_detail.comments,
          // pjscore: Math.floor(res.data.course_detail.score),
          ptInfo: res.data.course_detail,
          // c_id: res.data.course_detail.course_id,//重置c_id
          description: res.data.description
        })
        var content = res.data.course_detail.intro;
        WxParse.wxParse('article', 'html', content, that, 5);
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  // 开团
  openTab(){
    let that = this;

    if (that.data.isIos) {
      wx.showModal({
        title: '温馨提示',
        content: '小程序暂不支持购买此权益',
        confirmText: '好的',
        showCancel: false
      })
      return false
    }

    if (this.data.ptInfo.enroll_fields.length){
      // wx.setStorageSync('enroll_fields', this.data.ptInfo.enroll_fields.length);
      // wx.setStorageSync('fromPt', true);
      wx.setStorageSync('fromPt', {ispt:true,p_id:this.data.p_id,g_id:''});
      wx.navigateTo({
        url: '/pages/writeInfo/writeInfo?c_id=' + this.data.ptInfo.course_id
      })
    } else {
      console.log("支付");
      wx.showModal({
        title: '',
        content: '确认要报名此课程？',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            
            var data = {};
            data.productId = that.data.p_id;
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
                  //如果免费
                  if (that.data.info.promoter_price==0){
                    this.setData({
                      openState: 1,
                      wxPay: false,
                    })
                    this.getInfo();
                  }else{
                    var list = res.data;
                    list.isjoinpt = false;
                    that.setData({
                      // payShow: !that.data.payShow,
                      wxPay: !that.data.wxPay,
                      payInfo: list,
                      pintuan: res.data.pintuan,
                    })
                    // that.setData({
                    //   accountShow: !that.data.accountShow,
                    // })
                    console.log(that.data.payInfo)
                  }
                  
                } else if (res.data.status == 1 || res.data.status == 6) {
                  setTimeout(() => {
                    wx.navigateBack();
                  }, 1500)
                }
              } else {
                wx.showToast({
                  title: res.message,
                  icon: 'none',
                  duration: 2000
                })
                if (res.code == 8) {
                  setTimeout(() => {
                    wx.navigateTo({
                      url: '/pages/myOrder/myOrder',
                    })
                  }, 1500)
                }
              }
            })
            
          } else if (res.cancel) {
           
          }
        }
      })
      
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    this.setData({
      g_id: options.g_id,
      // ptTime: options.time,
      p_id: options.p_id,
    })
    console.log(that.data.g_id, that.data.p_id)
    if (that.data.g_id){
      // 拼团
      that.getInfo();
      this.setData({
        openState: 2,
      })
    }else{
      //开团
      that.getktInfo();
      this.setData({
        openState: 0,
      })
    }
    
    
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
    if (wx.getStorageSync('back')&&(wx.getStorageSync('back')==0||wx.getStorageSync('back')==1)){
      console.log(wx.getStorageSync('back'))
      this.afterWhite();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (countTimeList.length) {
      countTimeList.forEach(function (item) {
        clearInterval(item)
      })
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (countTimeList.length) {
      countTimeList.forEach(function (item) {
        clearInterval(item)
      })
    }
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
  onShareAppMessage: function (res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var info = that.data.Info;
    return {
      title: '跟我一起学习这门课程',
      path: '/pages/assembling/assembling?g_id=' + that.data.g_id + '&p_id=' + that.data.p_id,
      // imageUrl: that.data.info.image_large,
      imageUrl: '',
      success: (res) => {    // 成功后要做的事情
        //console.log(res.shareTickets[0])
        // console.log
        that.setData({
          shareShow: false
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})