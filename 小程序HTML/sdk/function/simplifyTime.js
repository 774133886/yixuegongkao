var $=require("../jquery");module.exports=function(e){if(e)return"number"===$.type(e)&&(e=new Date(e)),{hour:e.getHours(),minute:e.getMinutes(),second:e.getSeconds()}};