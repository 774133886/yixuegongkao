var getUuid=require("./getUuid"),$=require("../../../api/jquery"),version="0.0.1";function getNet(){return"todo"}function getEnv(e){return e.env.toLowerCase()}module.exports=function(e,r){var t=getUuid(),n=new Date,u=n.getHours()+":"+n.getMinutes()+":"+n.getSeconds(),o={net:r.networkType,uuid:t,version:version,env:getEnv(r),current_time:u,customstr:r.customStr||"",user_number:r.userNumber,user_name:r.userName};delete r.networkType,delete r.userNumber,delete r.userName,$.extend(!0,r,o);var s="http://"+("test"==getEnv(r)?getEnv(r)+"-":"")+"click.baijiayun.com/gs.gif";console.log("report"),console.log(r);var i=s+"?"+function(e){var r="";for(var t in e)e.hasOwnProperty(t)&&(r+=""==r?t+"="+e[t]:"&"+t+"="+e[t]);return r}(r);e.setData({reportUrl:i})};