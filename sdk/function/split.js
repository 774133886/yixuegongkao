var $=require("../jquery");module.exports=function(r,e){var t=[];return"number"===$.type(r)&&(r=""+r),r&&"string"===$.type(r)&&$.each(r.split(e),function(r,e){(e=$.trim(e))&&t.push(e)}),t};