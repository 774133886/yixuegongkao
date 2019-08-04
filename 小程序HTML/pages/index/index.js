// pages/index/index.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mask: false,
    floorstatus:false,
    nomore: false,
    bannerlist: [{ image: '../../files/indexBanner.png' }, { image: '../../files/indexBanner.png' }]
  },
  //swiper
  swiperChange: function(e){
    this.setData({
      activeIdx: e.detail.current
    });
    //每本书页面的访问量
    var book = this.data.list[e.detail.current];
    app.mtj.trackEvent('books', {
      book: book.name
    });
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },

  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  // 回到首页
  gocourse: function (e) {
    wx.switchTab({
      url: '/pages/course/course'
    })
  },

  //开启中断遮罩
  closeMark: function (e) {
    this.setData({ nomore: !this.data.nomore})
  },
 
  //我的跳转
  goPersonal: function(){
    
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
 
  //getlist
  getlist: function(){
    var token = wx.getStorageSync('token');
    if(!token) return;
    var that = this;
    http.getReq('/api/Index/getBooks',function(res){
      // res.data.rows[0].articles[1].time = '2019.06.09'
      that.setData({
        list: res.data.rows,
        // 获取显示隐藏
        p_show: res.data.flag
      });
      if (res.data.rows.length == 0){
        that.setData({
          noData: true
        });
      }
      that.listLocation();
      console.log(res.data.rows);
      var book = that.data.list[0];
      if (book){
        app.mtj.trackEvent('books', {
          book: book.name
        });
      }
    })
  },
  //点击去付款
  goPay: function(){
    var that = this;
    var bookId = this.data.payBook.id;
    var time = this.data.lookTime;
    var lookTime = app.getTime(time);
    this.setData({
      lookTime: 0
    });
    //浏览时间
    app.mtj.trackEvent('lookmask', {
      time: lookTime,
    });
    wx.showLoading({
      title: '',
    })
    http.postReq('/api/Book/buy', {book_id: bookId},function(res){
      var data = res.data;
      that.wxPay(data,function(){
        //分享成功购买统计
        if (that.data.pid) {
          app.mtj.trackEvent('sharebuy', {
            user: pid,
          });
        }
        wx.hideLoading();
        wx.navigateTo({
          url: '../paySuccess/paySuccess?money=' + that.data.payBook.price
        });
      });
    })
  },
  //中断阅读支付
  goPay2: function(){
    var that = this;
    var bookId = this.data.articleId;
    var cType = this.data.cType;
    console.log(that.data.payBook)
    if (cType == 'wechat'){
      wx.showLoading({
        title: '',
      })
      http.postReq('/api/Article/buy', { aid: bookId }, function (res) {
        var data = res.data;
        that.wxPay(data,function(){
          wx.hideLoading();
          that.setData({
            mask2: false
          });
          wx.navigateTo({
            url: '../paySuccess/paySuccess?money=' + that.data.payBook.price
          });
        });
      })
    }else{
      http.postReq('/api/Article/coupon', { aid: bookId }, function (res) {
        if(res.code == 120){
          that.setData({
            shareMask: true,
            mask2: false
          });
        }
        else{
          that.setData({
            mask2: false
          });
          that.getlist();
        }
      })
    }
  },
  //付款
  wxPay: function(data,func){
    var that = this;
    wx.requestPayment({
      appId: data.appid,
      timeStamp: String(data.timeStamp),
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success(res) {
        wx.showToast({
          title: '支付成功',
          icon: 'none'
        });
        that.setData({
          mask: false,
          mask2: false
        });
        that.getlist();
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
  //滚动位置
  listLocation: function () {
    var that = this;
    var list = this.data.list;
    var tid = this.data.tid;
    if(!tid){
      return;
    }
    for(var i = 0;i < list.length;i++){
      if(list[i].id == tid){
        that.setData({
          swiperIdx: i
        })
      }
    }
    // var active = wx.createSelectorQuery().select('#indexCtt').fields({
    //   dataset: true,
    //   size: true,
    //   scrollOffset: true,
    //   rect: true
    // }, function (res) {
    //   var cttTop = res.top;
    //   var active2 = wx.createSelectorQuery().select('#' + selectId).fields({
    //     dataset: true,
    //     size: true,
    //     scrollOffset: true,
    //     rect: true
    //   }, function (res) {
    //     var itemTop = res.top - cttTop;
    //     that.setData({
    //       scrollTop: itemTop
    //     })
    //   }).exec()
    // }).exec()
    
  },
  //获取手机号
  getPhoneNumber: function (e) {
    // console.log(e.detail.iv);
    // console.log(e.detail.encryptedData);

    var that = this;

    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        wx.request({
          url: 'https://shuyu.educhinstyle.cn/api/Login/decode',
          data: {
            'encryptedData': e.detail.encryptedData,
            'iv': encodeURIComponent(e.detail.iv),
            'sessionKey': wx.getStorageSync('sskey')
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {
          //   'content-type': 'application/json'
          // }, // 设置请求的 header
          success: function (res) {
            if (res.data.phoneNumber) {//我后台设置的返回值为1是正确

              http.postReq('/api/User/bindMobile', { 'mobile': res.data.phoneNumber }, function (res1) {
                if (res1.code == 101) {
                  that.setData({
                    isPhone: false,
                  });

                  //存入缓存即可
                  wx.setStorageSync('phone', res.data.phoneNumber);
                  // 判断IOS
                  if (this.data.isIos) {
                    wx.showModal({
                      title: '温馨提示',
                      content: '小程序暂不支持开启阅读',
                      confirmText: '好的',
                      showCancel: false
                    })
                    return false;
                  }
                  that.setData({
                    mask: true
                  });
                } else {
                  wx.showToast({
                    title: res1.msg,
                    icon: 'none'
                  })
                }
              })

            } else {
              // 还是关闭弹窗
              wx.showToast({
                title: '获取手机号失败',
                icon: 'none'
              });
              that.setData({
                isPhone: false,
              })
            }
            // 判断是否第一次进入
            if (wx.getStorageSync('first') == '') {
              that.setData({
                firstIn: true,
              });
            }
          },
          fail: function (err) {
            wx.showToast({
              title: err,
              icon: 'none'
            });
            console.log(err);
          }
        })
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.showToast({
          title: '登录失效，重新登录',
          icon: 'none'
        });
        that.userLogin(); //重新登录
      }
    })
    
      
  },
  //首次进入提示
  firstCome: function(){
    wx.setStorageSync("first", true);
    this.setData({
      firstIn: false
    })
  },
  //按钮点击统计
  clickBtn: function(name){
    app.mtj.trackEvent('btns', {
      btn: name,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    
    //获取要求人id
    if (options.pid || options.scene) {
      wx.setStorageSync('pid', options.pid || options.scene)
      that.setData({
        pid: options.pid || options.scene
      });
      that.userLogin();
    }else{
      wx.removeStorageSync('pid');
    }
    if (options.id) {
      that.setData({
        tid: options.id
      })
    }
    
    //判断首次进入提示滑动
    // console.log(wx.getStorageSync("token"))
    // if (wx.getStorageSync("first") == null || wx.getStorageSync("first") == ""){
    //   this.setData({
    //     firstIn: true
    //   })
    // }else{
    //   this.setData({
    //     firstIn: false
    //   })
    // }


    // 判断IOS
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
        })
        console.log(res)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },
  
  goRead:function(){
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // var that = this;
    // // this.loadUser();
    // // this.getlist();
    // http.postReq('/api/User/info', {}, function (res) {
    //   setTimeout(function () {
    //     that.getlist();
    //   }, 0);
    // })
    // var that = this;
    
    // //iphone 底部横线适配
    // var iphones = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone XS Max', 'iPhone11,8', 'iPhone11,2', 'iPhone11,4', 'iPhone11,6', 'unknown<iPhone11,2>', 'unknown<iPhone11,8>', 'unknown<iPhone11,4>', 'unknown<iPhone11,6>']
    // wx.getSystemInfo({
    //   success: function (res) {
    //     //console.log(res.model)
    //     //console.log(res.language)//zh_CN(en)
    //     //console.log(res.model=="iPhone X")
    //     // console.log(iphones.indexOf(res.model) > -1)
    //     if (iphones.indexOf(res.model) > -1) {
    //       that.setData({
    //         isIphone: true
    //       })
    //     }
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.setData({
      pages: 1,
      totalPage: 1
    });
    this.load();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var user = wx.getStorageSync('user');
    return {
      title: '跟我一起重新认识一本书',
      path: '/pages/index/index?pid=' + user.id,
      imageUrl: '/files/share.jpg',
      success: (res) => {    // 成功后要做的事情
        //console.log(res.shareTickets[0])
        // console.log
        that.setData({
          signBoxShow: false
        })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  }
})