// pages/course/course.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp();
let pt_set1 = null;
let pt_set2 = null;
let pt_set3 = null;
let pt_set4 = null;
let pt_set5 = null;
let pt_set6 = null;
let pt_set7 = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    list: ["6","1","2","3","4","8","9"],
    hd_list: [
      "hd_list1", "hd_list2", "hd_list3", "hd_list4", "hd_list5", "hd_list6", "hd_list7"
    ],
    hd_list1: [],
    hd_list2: [],
    hd_list3: [],
    hd_list4: [],
    hd_list5: [],
    hd_list6: [],
    hd_list7: [],
    courseList: [
      [],[],[],[],[],[],[]
    ],
    pageList: [
      {},{},{},{},{},{},{}
    ],
    scrollList: [0,0,0,0,0,0,0],
    scrollTop: [0, 0, 0, 0, 0, 0, 0],
    floorstatus: false,
    isShow: true,
    deployInfo: wx.getStorageSync("deployInfo") || { audit_mode: "1" }
  },
  choiceTab(e) {
    this.setData({
      active: e.currentTarget.dataset.id
    })
  },
  swiperChange(e){
    this.setData({
      active: e.detail.current
    });

    var flag = false;
    if (this.data.scrollList[this.data.active] > 100) {
      flag = true
    } else {
      flag = false
    }
    this.setData({
      floorstatus: flag
    });
    if(this.data.courseList[this.data.active].length == 0){
      this.getInfo()
    }
  },
  getInfo(obj){
    var that = this;
    var active = this.data.active;
    var data = {};
    if(active==0){
      data["type"] && delete data["type"];
      data.promotionType = 'all'
    } else if (active == 1) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 6
    } else if (active == 2) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 1
    } else if (active == 3) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 2
    } else if (active == 4) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 3
    } else if (active == 5) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 4
    }  else if (active == 6) {
      data["promotionType"] && delete data["promotionType"];
      data.type = 0
    }else {
      data["promotionType"] && delete data["promotionType"];
      data.type = active
    }
    var params = Object.assign(data, obj ? obj : {})
    http.postReq('/api/public/get_course_list.htm', params,function(res){
      if (res.code == 0) {
        // if (data.promotionType = 'all') {
          res.data.list.forEach(function (v, i) {
            if (v.promotions && v.promotions[0]&&v.promotions[0].promotion_start_time&&v.promotions[0].promotion_end_time){
              var start_time = v.promotions[0].promotion_start_time;
              var end_time = v.promotions[0].promotion_end_time;
              if (Date.parse(new Date()) - new Date(start_time.replace(/-/g, '/')).getTime()<0){
                // 活动未开始
                v.last_time = (new Date(start_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
                v.is_start = false;
              }else{
                // 活动已开始
                v.last_time = (new Date(end_time.replace(/-/g, '/')).getTime() - Date.parse(new Date())) / 1000;
                v.is_start = true;
              }
            }
          });
        // }
        var list = that.data.courseList;
        var pages = that.data.pageList;
        pages[that.data.active] = res.data.pagination;
        if (list[that.data.active].length == 0 || that.data.isShow){
          list[that.data.active] = res.data.list;
        }else{
          list[that.data.active] = list[that.data.active].concat(res.data.list);
        }
        var scrollList = that.data.scrollList;
        var hd_list = that.data["hd_list"+Number(active+1)];
        hd_list = [];
        list[that.data.active].forEach(function (item, index) {
          if (item.last_time>0){
            hd_list.push({ last_time: item.last_time,is_start: item.is_start})
          }else{
            hd_list.push({})
          }
        })
        that.setData({
          courseList: list,
          pageList: pages,
          isShow: false,
          refreshing: false,
          scrollTop: scrollList,
          ["hd_list" + Number(active + 1)]: hd_list
        })
        that.startTime(active+1)
      }
    })
  },
  bindscrolltolower(){
    var page = this.data.pageList[this.data.active].page_index;
    var max_page = this.data.pageList[this.data.active].max_page_index;
    if (page == max_page){
      return;
    }
    this.getInfo({ page: page+1})
  },
  // 获取滚动条当前位置
  scrollChange: function (e) {
    var list = this.data.scrollList;
    var active = this.data.active;
    list[active] = e.detail.scrollTop;
    if (e.detail.scrollTop > 100) {
      this.setData({
        floorstatus: true,
        scrollList: list
      });
    } else {
      this.setData({
        floorstatus: false,
        scrollList: list
      });
    }
  },
  startTime(idx) {
    var that = this;
    // var aclist = [];
    if(idx == 1){
      clearInterval([pt_set1]);
      pt_set1 = setInterval(time1, 1000);
    } else if (idx == 2){
      clearInterval([pt_set2]);
      pt_set2 = setInterval(time1, 1000);
    } else if (idx == 3) {
      clearInterval([pt_set3]);
      pt_set3 = setInterval(time1, 1000);
    } else if (idx == 4) {
      clearInterval([pt_set4]);
      pt_set4 = setInterval(time1, 1000);
    } else if (idx == 5) {
      clearInterval([pt_set5]);
      pt_set5 = setInterval(time1, 1000);
    } else if (idx == 6) {
      clearInterval([pt_set6]);
      pt_set6 = setInterval(time1, 1000);
    } else if (idx == 7) {
      clearInterval([pt_set7]);
      pt_set7 = setInterval(time1, 1000);
    }
    
    function time1() {
      var hd_list = that.data["hd_list" + idx];
        hd_list.forEach(function (a, i) {
          var time = a.last_time
          if (a.last_time) {
            if (a.last_time == 1) {
              a.last_time = 0;
              clearInterval(time1);
              // 重新获取数据
              that.getList();
            } else {
              a.last_time--;
            }
            that.setData({
              ["hd_list" + idx]: hd_list
            })
          } else {
            return false;
          }
        })

      
    }
  },
  //回到顶部
  goTop: function (e) {  // 一键回到顶部
    var list = this.data.scrollList;
    var active = this.data.active;
    list[active] = 0;
    setTimeout(()=>{
      this.setData({
        scrollList: list,
        scrollTop: list
      })
    })
  },
  //下拉刷新监听函数
  _onPullDownRefresh: function () {
    this.setData({
      isShow: true
    });
    this.getInfo();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.type){
      this.setData({
        active: options.type
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
    var type = wx.getStorageSync("c_type");
    if (type){
      this.setData({
        active: type
      })
    }
    this.setData({
      isShow: true
    })
    this.getInfo();
    wx.removeStorageSync("c_type");

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
    if (pt_set1){
      clearInterval(pt_set1);
    }
    if (pt_set2) {
      clearInterval(pt_set2);
    }
    if (pt_set3) {
      clearInterval(pt_set3);
    }
    if (pt_set4) {
      clearInterval(pt_set4);
    }
    if (pt_set5) {
      clearInterval(pt_set5);
    }
    if (pt_set6) {
      clearInterval(pt_set6);
    }
    if (pt_set7) {
      clearInterval(pt_set7);
    }
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