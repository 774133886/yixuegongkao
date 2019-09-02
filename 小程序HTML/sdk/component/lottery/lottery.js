/**
 * @file 抽奖组件
 * @author  dujianhao
 */

var eventEmitter = require('../../eventEmitter');
var appLanguage = require('../../language/main')();
var pageLanguage = require('./language/main')();
var store = require('../../store');
var auth = require('../../auth');

Object.assign(pageLanguage, appLanguage);

const namespace = '.lottery'
let messageCommand = ''

Component({
  /**
   * Component properties
   */
  properties: {
    forceHideBox: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * Component initial data
   */
  data: {
    zoomAnimation: {},
    minifyAnimation: {},
    hasBoxClicked: false,
    showBox: false,
    showList: false,
    duration: '',
    lotteryList: [],
    lotteryName: '',
    language: pageLanguage,
  },

  /**
   * Component methods
   */
  methods: {
    onLotteryBoxTap: function(e) {
      this.setData({
        hasBoxClicked: true
      })
      
      // 将口令发送到messageSender
      eventEmitter.trigger(eventEmitter.LOTTERY_BOX_CLICKED, {
        command: messageCommand
      });
    },

    /**
     * 关闭列表
     */
    onLotteryCloseTap: function(e) {

      this.animation.opacity(0).step({
        duration: 400
      })

      this.setData({
        minifyAnimation: this.animation.export()
      })
      setTimeout(() => {
        this.setData({
          showList: false,
          minifyAnimation: {}
        })
      }, 400)
    },

    /**
     * box动画
     */
    startBoxAnimation: function(data) {

      messageCommand = data.command;
      this.setData({
        showBox: true,
        showList: false,
        hasBoxClicked: false,
      })

      let flag = true
      const scale1 = 0.4
      const scale2 = 1
      const interval = setInterval(() => {

        if (this.data.hasBoxClicked) {
          clearInterval(interval)
          flag = false
        }
        // 试了很多种动画，就这个靠谱点不会变的奇怪
        this.animation.opacity(flag ? scale1 : scale2).step()
        flag = !flag

        this.setData({
          zoomAnimation: this.animation.export()
        })
      }, 600)
    },

    showLotteryList: function(data) {
      if (this.data.lotteryList) {
        // 防止多次弹列表时出错，保证每次弹之前是关闭状态
        this.setData({
          lotteryList: [],
          showList: false
        })
      }
      wx.nextTick(() => {
        this.setData({
          lotteryList: data.hitList,
          lotteryName: data.lotteryName,
          showList: true,
          showBox: false,
        })
      })
    },
  },

  ready: function() {
    this.animation = wx.createAnimation({
      duration: 600,
      transformOrigin: '50% 50% 0'
    })

    eventEmitter
      .on(
        eventEmitter.COMMAND_LOTTERY_ABORT + namespace,
        (event, data) => {
          this.showLotteryList(data);
        },
      )
      .on(
        eventEmitter.STANDARD_LOTTERY_END + namespace,
        (event, data) => {
          this.showLotteryList(data);
        },
      )
      .on(
        eventEmitter.COMMAND_LOTTERY_BEIGIN + namespace,
        (event, data) => {
          this.startBoxAnimation(data);
        }
      )
      .on(
        eventEmitter.COMMAND_LOTTERY_STATUS_RES + namespace,
        (event, data) => {
          if (data.duration == -1 || !auth.isStudent()) {
            return;
          }
          this.startBoxAnimation(data);
        }
      ).on(
        eventEmitter.MESSAGE_RECEIVE + namespace,
        function(event, data) {
          // 发送的消息服务器收到并返回后才能判断口令是否成功
          if (messageCommand === data.content &&
            store.get('user.number') == data.from.number &&
            auth.isStudent()
          ) {
            eventEmitter.trigger(
              eventEmitter.COMMAND_LOTTERY_HIT_REQ
            );
          }
        }
      )
      .on(
        eventEmitter.COMMAND_LOTTERY_HIT_RES + namespace,
        function(event, data) {
          wx.showToast({
            title: pageLanguage.LOTTERY_COMMAND_CORRECT,
          })
        }
      );


    setTimeout(function() {
      // 初次进入查询口令抽奖状态
      eventEmitter.trigger(
        eventEmitter.COMMAND_LOTTERY_STATUS_REQ
      );
    }, 2000);
  },
})