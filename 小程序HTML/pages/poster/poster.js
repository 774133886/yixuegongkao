// pages/poster/poster.js
const util = require('../../utils/util.js')
const http = require('../../http.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_large: "",
    wxapp_qrcode: "",
    info:{}
   
  }, 
  /**
   * 生命周期函数--监听页面加载
   */

  // 获取课程详情
  getInfo() {
    let that = this;
    
  },
  onLoad: function (options) {
    var that = this;
    var data = {};
    data.courseid = options.c_id;
    http.postReq('api/public/get_course_detail.htm', data, function (res) {
      if (res.code == 0) {
        that.setData({
          info: res.data,
        })
      // 下载二维码图片
        wx.downloadFile({
          url: res.data.wxapp_qrcode,
          success: function (res) {
            console.log(res.tempFilePath);
            that.setData({
              wxapp_qrcode: res.tempFilePath,
            })
            setTimeout(() => {
              that.createNewImg();
            }, 500)
          }, fail: function (fres) {

          }
        })
        // 下载主图片
        wx.downloadFile({
          url: res.data.image_large,
          success: function (res) {
            console.log(res.tempFilePath);
            that.setData({
              image_large: res.tempFilePath,
            })
          }, fail: function (fres) {

          }
        })

      } else {
        wx.showToast({
          title: res.message,
          icon: 'none',
          duration: 2000
        })
      }
    })

  },
  drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
    let lineWidth = 0;
    let lastSubStrIndex = 0; //每次开始截取的字符串的索引
    for (let i = 0; i < str.length; i++) {
      lineWidth += ctx.measureText(str[i]).width;
      if (lineWidth > canvasWidth) {
        ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分
        initHeight += 22; //22为 文字大小20 + 2
        lineWidth = 0;
        lastSubStrIndex = i;
        titleHeight += 22;
      }
      if (i == str.length - 1) { //绘制剩余部分
        ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
      }
    }
    // 标题border-bottom 线距顶部距离
    titleHeight = titleHeight + 10;
    return titleHeight;
  },



  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("rgba(255,255,255,1)")
    context.fillRect(0, 0, 375, 590)
    // var path = that.data.path;
    var path = "../../files/poster.png";
    console.log(path);
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    //不知道是什么原因，手机环境能正常显示
    var path1 = that.data.image_large;
    //将模板图片绘制到canvas,在开发工具中drawImage()函数有问题，不显示图片
    var path2 = that.data.image_large;
    var path4 = that.data.wxapp_qrcode;
    console.log(path4)
    //不知道是什么原因，手机环境能正常显示

    var name = that.data.info.name || '';
    console.log(name);
    // context.arc(186, 528, 35, 0, Math.PI * 2, true);
    // context.closePath();
    // context.fillStyle = "white";
    // context.strokeStyle = "rgba(0,0,0,0)";
    // context.fill();
    // context.stroke();
    context.drawImage(path2, 0, 0, 375, 250);
    context.stroke();
    //绘制名字
    context.setFontSize(22);
    context.setFillStyle('#333');
    // context.setTextAlign('center');
    // context.fillText(name, 10, 280);
    that.drawText(context, name, 10, 280, 30, 315);

    var priceName, price;
    if (that.data.info.promotions[0]){
      console.log(that.data.info.promotions[0].promotion_type)
      if (that.data.info.promotions[0].promotion_type==2){
        priceName = '秒杀价'; 
        price = that.data.info.promotions[0].promotion_price;
      } 
      if (that.data.info.promotions[0].promotion_type == 4) {
        priceName = '拼团价';
        price = that.data.info.promotions[0].promotion_price;
      }
      // 绘制删除价格
      if (that.data.info.promotions[0].promotion_type == 2 || that.data.info.promotions[0].promotion_type == 4) {
        context.setFontSize(14);
        context.setFillStyle('#999');
        // context.setTextAlign('center');
        context.fillText(that.data.info.price, 135, 330);

        context.setLineWidth(1);//设置线条的宽度
        context.setStrokeStyle('#999');//设置线条的样式
        context.moveTo(132, 325);//设置线条的起始路径坐标
        context.lineTo(165, 325);//设置线条的终点路径坐标
        context.stroke();//对当前路径进行描边

      }

    }else{
      priceName = '价格';
      price = that.data.info.price;
    }
    
    
    context.setFontSize(16);
    context.setFillStyle('#999');
    // context.setTextAlign('center');
    context.fillText(priceName, 10, 330);
    // 绘制价格文字
    
    context.setFontSize(24);
    context.setFillStyle('#FF3636');
    // context.setTextAlign('center');
    context.fillText('¥' + price, 65, 330);
    // 绘制仅剩
    context.setFontSize(14);
    context.setFillStyle('#666');
    // context.setTextAlign('center');
    context.fillText('仅剩' + (that.data.info.enroll_count - that.data.info.apply_count) +'名',275, 330);
    // 结束时间
    context.setFontSize(14);
    context.setFillStyle('#FF1414');
    // context.setTextAlign('center');
    context.fillText('结束时间 ' + that.data.info.apply_end_time.slice(0,16), 10, 360);
    // 绘制线
    context.setLineWidth(1);//设置线条的宽度
    context.setStrokeStyle('#eee');//设置线条的样式
    context.moveTo(10, 380);//设置线条的起始路径坐标
    context.lineTo(360, 380);//设置线条的终点路径坐标
    context.stroke();//对当前路径进行描边
    //绘制扫码二维码 
    context.drawImage(path4, 108, 400, 162, 162);
    context.stroke();
    //绘制文字
    context.setFontSize(16);
    context.setFillStyle('#666');
    // context.setTextAlign('center');
    context.fillText('码上查看课程', 138, 585);
    
  
    
  

    context.draw();
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading',
      duration: 2000
    })
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(res)
          that.setData({
            imagePath: tempFilePath,
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 2000);
  },
  //点击保存到相册
  baocun: function () {
    var that = this;
    if (!wx.saveImageToPhotosAlbum) {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
      return;
    }
    
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.writePhotosAlbum" 这个 scope  
    wx.getSetting({
      success(res) {
        console.log("getSetting: success");
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 接口调用询问  
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.downloadImage();
            },
            fail() {
              // 用户拒绝了授权  
              wx.showModal({
                title: '保存图片',
                content: '保存图片需要您授权',
                showCancel: true,
                confirmText: '确定',

                success: function (res) {
                  if (res.confirm) {
                    // 打开设置页面  
                    wx.openSetting({
                      success: function (data) {
                        if (data.authSetting['scope.writePhotosAlbum']) {
                          that.downloadImage();
                        } else {
                          console.log("授权失败");
                        }
                      },
                      fail: function (data) {
                        console.log("openSetting: fail");
                      }
                    });
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }

                }
              })



            }
          })
        } else {
          that.downloadImage()
        }
      },
      fail(res) {
        console.log("getSetting: fail");
        console.log(res);
      }

    })

  },
  // 下载
  downloadImage(){
    wx.showLoading({
      title: '保存中...',
    })
    var that = this;
    console.log("baocun", that.data.imagePath)
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.hideLoading();
        wx.showModal({
          content: '图片已保存到相册，快去分享给好友吧！',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
          },
          fail: function (res) {
            console.log(11111)

          }
        })
      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg === "saveImageToPhotosAlbum:fail authorize no response") {
          console.log("打开设置窗口");
        }
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
    var that = this;

   
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
  onShareAppMessage: function (res) {
    return {
      title: "这个是我分享出来的东西",
      success: function (res) {
        console.log(res, "转发成功")
      },
      fail: function (res) {
        console.log(res, "转发失败")
      }
    }
  }
})