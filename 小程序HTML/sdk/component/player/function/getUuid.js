function s4(){return(65536*(1+Math.random())|0).toString(16).substring(1)}function guid(){return[s4()+s4(),s4(),s4(),s4(),s4()+s4()+s4()].join("-")}module.exports=function(){if(!wx.getStorageSync("uuid")){var u=guid();wx.setStorageSync("uuid","uuid-"+u)}return wx.getStorageSync("uuid")};