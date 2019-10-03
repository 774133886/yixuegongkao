// pages/courseDetail/courseDetail.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
var WxParse = require('../../wxParse/wxParse.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{},
    shareShow:false,
    contactShow:false,
    sServiceTel:'15928773528',
    state:0,
    pjshow:true,
    type:0,
    c_id:'',
    p_id:'',
    pjInfo:{},
    pjList:[],
    pjscore:0,
    promotions:[], //活动
    ptInfo:{},//拼团详情
    group_list:[],
    ptTime:'',
    msTime:'',
    deployInfo:{},
    payInfo:{},
    wxPay:false
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
  // 开始学习
  goLive(e) {
    wx.navigateTo({
      url: '../LiveStudio/LiveStudio?id=' + e.currentTarget.dataset.id
    })
  },
  // 支付成功后
  afterSuc(e) {
    console.log(e.detail)
    // 返回

    this.setData({
      wxPay: false,
    })
    if (this.data.state == 1) {
      this.getPtInfo();
    } else {
      // 获取详情
      this.getInfo();
    }
   

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    this.setData({
      state: options.state,
      deployInfo: wx.getStorageSync('deployInfo')
    })
    if (options.c_id){
      this.setData({
        c_id: options.c_id
      })
    }
    if (options.state) {
      this.setData({
        state: options.state
      })
    }
    if (options.state==1){
      this.getPtInfo();
      this.setData({
        p_id: options.c_id
      })
    }else{
      // 获取详情
      this.getInfo();
      // this.getpjList();
    }
    
  },
  //分享遮罩
  shareTab: function (e) {
    this.setData({ shareShow: !this.data.shareShow })
  },
  contactTab: function (e) {
    this.setData({ contactShow: !this.data.contactShow })
  },
  // 赞
  liketap(e){
    let that = this;
    let islike = e.currentTarget.dataset.like;
    let index = e.currentTarget.dataset.idx;
    console.log(islike)
    let com_id = e.currentTarget.dataset.comid;
    let pjList = that.data.pjList;
    if(!islike){
      var data = {};
      data.commentid = com_id;
      http.postReq('api/business/comment_praise.htm', data, function (res) {
        if (res.code == 0) {
          pjList[index].praise_count++;
          pjList[index].is_member_praise = true;
          that.setData({
            pjList: pjList
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }else{
      var data = {};
      data.commentid = com_id;
      http.postReq('api/business/comment_praise_cancel.htm', data, function (res) {
        if (res.code == 0) {
          pjList[index].praise_count--;
          pjList[index].is_member_praise = false;
          that.setData({
            pjList: pjList
          })
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  // 回到首页
  backIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //电话
  phonecallevent: function (e) {
    var phoneNum = e.currentTarget.dataset.pnum
    wx.makePhoneCall({
      phoneNumber: phoneNum.toString()
    })
  },
  // 单个拼团
  // joinPt(e){
  //   var g_id = e.currentTarget.dataset.g_id;
  //   if (this.data.info.enroll_fields.length) {
  //     wx.setStorageSync('enroll_fields', this.data.info.enroll_fields);
  //     // 跳转普通
  //   }
  //   wx.navigateTo({
  //     url: '/pages/assembling/assembling?g_id=' + g_id + '&p_id=' + this.data.p_id
  //   })
  // },
  writeInfo: function (e) {
    let that = this;
    let ispn = e.currentTarget.dataset.ispn;
    if (this.data.info.enroll_fields.length){
      wx.setStorageSync('enroll_fields', this.data.info.enroll_fields);
      // 拼团普通购买      
      if (ispn && this.data.state == 1) {
        wx.navigateTo({
          url: '/pages/writeInfo/writeInfo?c_id=' + this.data.c_id
        })
        return false;
      }
      // 跳转普通
      if (this.data.state == 0){
        wx.navigateTo({
          url: '/pages/writeInfo/writeInfo?c_id=' + this.data.c_id
        })
      }else{
        // 拼团开团
        wx.navigateTo({
          url: '/pages/assembling/assembling?p_id=' + this.data.p_id 
        })
      }
    }else{
      // if () {
      //   wx.navigateTo({
      //     url: '/pages/writeInfo/writeInfo?c_id=' + this.data.c_id
      //   })
      //   return false;
      // }
      
      // 普通直接支付
      if (this.data.state == 0 || (ispn && this.data.state == 1)){
        console.log('支付')
        this.payNow();
      }else{
        // 拼团开团
        wx.navigateTo({
          url: '/pages/assembling/assembling?p_id=' + that.data.p_id
        })
      }
    }
    
  },
  payNow(){
    var that = this;
    let data = {}
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
        if (res.data.price==0){
          // 免费
          if (that.data.state == 1) {
            that.getPtInfo();
          } else {
            // 获取详情
            that.getInfo();
          }
        }else{
          if (res.data.status = 2) {
            that.setData({
              wxPay: !that.data.wxPay,
              payInfo: res.data
            })
          } else if (res.data.status == 1 || res.data.status == 6) {
            setTimeout(() => {
              wx.navigateBack();
            }, 1500)
          }
        }
        
      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 3000
        })
        if (res.code == 8) {
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/myOrder/myOrder',
            })
          }, 1500)
        }
      }
    });
  },
  writeInfo2: function (e) {
    if (this.data.info.enroll_fields.length) {
      wx.setStorageSync('enroll_fields', this.data.info.enroll_fields);
      wx.navigateTo({
        url: '/pages/chooseJob/chooseJob?c_id=' + this.data.c_id
      })
    }
    
  },
  // 评价折叠
  changepj(){
    this.setData({ pjshow: !this.data.pjshow })
  },

  // 获取课程详情
  getInfo(){
    let that = this;
    var data = {};
    data.courseid = this.data.c_id;
    http.postReq('api/public/get_course_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({ 
          info: res.data,
          promotions: res.data.promotions[0],
          pjList: res.data.comments,
          pjscore: Math.floor(res.data.score),
        })
        if (res.data.enroll_fields.length) {
          wx.setStorageSync('enroll_fields', res.data.enroll_fields);
        }else{
          wx.setStorageSync('enroll_fields', []);
        }
        // 秒杀倒计时
        if (res.data.promotions.length){
          if (res.data.promotions[0].promotion_type == 2) {

            var msTime = (new Date(res.data.promotions[0].promotion_end_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
            if (msTime > 0) {
              var countTime = setInterval(function () {
                if (msTime == 1) {
                  msTime = 0;
                  clearInterval(countTime);
                  // 重新获取数据
                  that.getInfo();
                } else {
                  msTime--;
                }
                that.setData({
                  msTime: msTime,
                })
              }, 1000)
            } else {
              return false;
            }
          }
        }
        
        var content = res.data.intro;
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
  // 获取拼团课程详情
  getPtInfo() {
    let that = this;
    var data = {};
    data.id = this.data.c_id;
    http.postReq('api/pintuan/public/get_product_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data.course_detail,
          promotions: res.data.course_detail.promotions[0],
          pjList: res.data.course_detail.comments,
          pjscore: Math.floor(res.data.course_detail.score),
          ptInfo: res.data,
          group_list: res.data.current_group_list,
          c_id: res.data.course_detail.course_id,//重置c_id
        })
        if (res.data.course_detail.enroll_fields.length) {
          wx.setStorageSync('enroll_fields', res.data.course_detail.enroll_fields);
        } else {
          wx.setStorageSync('enroll_fields', []);
        }
        // 拼团倒计时
        var ptTime = (new Date(res.data.end_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
        if (ptTime>0) {
          var countTime = setInterval(function () {
            if (ptTime == 1) {
              ptTime = 0;
              clearInterval(countTime);
              // 重新获取数据
              that.getPtInfo();
            } else {
              ptTime--;
            }
            that.setData({
              ptTime: ptTime,
            })
          }, 1000)
        } else {
          return false;
        }

        var list = that.data.group_list;
        // expire_time
        // setTimeout(()=>{
        //   console.log(res.data.pjList)
        // },200)

        list.forEach(function (a, b) {
          a.last_time = (new Date(a.expire_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
          console.log(a.last_time)

          var time = a.last_time
          console.log(a.last_time);
          if (a.last_time) {
            var countTime = setInterval(function () {
              if (a.last_time == 1) {
                a.last_time = 0;
                clearInterval(countTime);
                // 重新获取数据
                that.getPtInfo();
              } else {
                a.last_time--;
              }
              that.setData({
                group_list: list,
              })
            }, 1000)
          } else {
            return false;
          }

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
  // 获取评价详情
  getpjList() {
    let that = this;
    var data = {};
    data.courseid = this.data.c_id;
    
    http.postReq('api/public/get_course_comment_list.htm', data, function (res) {
      if (res.code == 0) {
        console.log(res.data)
        that.setData({
           pjInfo: res.data,
            pjList: res.data.list.slice(0,2),
           
            });
      } else {
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
    // this.getInfo();
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
    var that = this;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var info = that.data.Info;
    return {
      title: '跟我一起学习这门课程',
      path: '/pages/courseDetail/courseDetail?c_id=' + that.data.c_id,
      imageUrl: info.image_large,
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