// pages/index/index.js
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
    mask: false,
    floorstatus:false,
    nomore: false,
    bannerlist: [{ image: '../../files/indexBanner.png' }, { image: '../../files/indexBanner.png' }],
    noData1: false,
    noData2: false,
    tjList:[],
    acList: [],
    deployInfo: wx.getStorageSync("deployInfo") || { audit_mode: "1" }
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
  saveStor(e){
    var type = e.currentTarget.dataset.type
    wx.setStorageSync("c_type", type);
    wx.switchTab({
      url: '/pages/course/course'
    })
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

  //我的跳转
  goPersonal: function(){
    
    wx.navigateTo({
      url: '../personal/personal'
    })
  },
 
  //getlist
  getlist: function(){
    var that = this;
    let data = {};
    data.indexrmd = 1;
    // data.sort = 2;
    http.getReq('/api/public/get_course_list.htm',data,function(res){
      // res.data.rows[0].articles[1].time = '2019.06.09'
      if(res.code==0){
        console.log(res.data.list);
        that.setData({
          tjList: res.data.list,
        });
        if (res.data.list.length == 0) {
          that.setData({
            noData2: true
          });
        }
      }else{
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取活动列表
  getAclist: function () {
    var that = this;
    let data = {};
    
    // data.indexrmd = 1;
    // // data.sort = 2;
    http.getReq('api/public/get_index_promotion_list.htm', data, function (res) {
      // res.data.rows[0].articles[1].time = '2019.06.09'
      if (res.code == 0) {
        console.log(res.data);
        var aclist = res.data;
        aclist.forEach(function (v, i) {
          v.last_time = (new Date(v.end_time.replace(/-/g, '/')).getTime() - Date.parse(new Date()))/1000;
          console.log(v.last_time)
        })



        let  List = (function () {
          var theAry = [];

          aclist.forEach(function (item, index, ary) {

            if (!theAry[Math.floor(index / 3)]) {

              theAry[Math.floor(index / 3)] = [];

            }
            theAry[Math.floor(index / 3)].push(item);

          });

          return theAry

        })()
        console.log(List);

        List.forEach(function (v, i) {
          v.forEach(function(a,b){
            var time = a.last_time
             console.log(a.last_time);
            if (a.last_time) {
              var countTime = setInterval(function () {
                if (a.last_time == 1) {
                  a.last_time = 0;
                  clearInterval(countTime);
                  // 重新获取数据
                  that.getAclist();
                } else {
                  a.last_time--;
                }
                that.setData({
                  acList: List,
                })
              }, 1000);
              countTimeList.push(countTime);
            } else {
              return false;
            }
          })
          
        })

        that.setData({
          acList: List,
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
  getBanner: function () {
    var that = this;
    let data = {};
    data.tag = 'WX_APP_BANNER';
    http.getReq('/api/app/get_page_elements.htm', data, function (res) {
      // res.data.rows[0].articles[1].time = '2019.06.09'
      if (res.code == 0) {
        console.log(res.data);
        that.setData({
          bannerlist: res.data,
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
    
    
  },
 
  //首次进入提示
  firstCome: function(){
    wx.setStorageSync("first", true);
    this.setData({
      firstIn: false
    })
  },

  //储存配置信息
  savePz: function () {
    var that = this;
    let data = {};
    http.getReq('api/app/wxapp_config.htm', data, function (res) {
      // res.data.rows[0].articles[1].time = '2019.06.09'
      if (res.code == 0) {
        wx.setStorageSync("deployInfo", res.data);
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

  // 获取首页数据
    this.getlist();
    this.getBanner();
    
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
    if (!wx.getStorageSync("deployInfo")){
      this.savePz();
    }
    var deployInfo = wx.getStorageSync("deployInfo");
    if (deployInfo) {
      this.setData({
        deployInfo: deployInfo
      })
    }
    this.getAclist();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    if (countTimeList.length){
      countTimeList.forEach(function(item){
        clearInterval(item)
      })
    }
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
    // var that = this;
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   console.log(res.target)
    // }
    // var user = wx.getStorageSync('user');
    // return {
    //   title: '跟我一起重新认识一本书',
    //   path: '/pages/index/index?pid=' + user.id,
    //   imageUrl: '/files/share.jpg',
    //   success: (res) => {    // 成功后要做的事情
    //     //console.log(res.shareTickets[0])
    //     // console.log
    //     that.setData({
    //       signBoxShow: false
    //     })
    //   },
    //   fail: function (res) {
    //     // 分享失败
    //     console.log(res)
    //   }
    // }
  }
})