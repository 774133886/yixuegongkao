var base64=require("./base64").list,util=require("../util");function encode(e){e=Math.floor(4095*e);var r=Math.floor(e/64),t=e%64;return base64[r]+base64[t]}module.exports=function(e){var r=e.points;if(util.is.array(r)&&10<r.length&&"Doodle"===e.name&&!e.autoClosePath){var t=[];return util.array.each(r,function(e){0<=e.x&&e.x<=1&&0<=e.y&&e.y<=1&&(e=encode(e.x)+encode(e.y))!==t[t.length-1]&&t.push(e)}),e.encodeType=2,t.join("")}return util.is.array(r)?(e.encodeType=0,JSON.stringify(r)):r};