function isObject(t){return"[object Object]"===Object.prototype.toString.call(t)}var util=require("./util");module.exports={store:{},set:function(t,e){var r=module.exports;if(isObject(t))for(var i in t)t.hasOwnProperty(i)&&r.setByStr(i,t[i]);else r.setByStr(t,e)},setByStr:function(t,e){for(var r,i=module.exports,o=t.split("."),u=i.store,n=0;r=o[n++];){if(n==o.length){u[r]=e;break}u[r]=u[r]||{},u=u[r]}},get:function(t,e){for(var r,i=module.exports,o=t.split("."),u=i.store,n=0;r=o[n++];)if(void 0===(u=u[r]))return void 0!==e?e:void 0;return u},increase:function(t,e,r){var i=util.toNumber(this.get(t),0)+(util.numeric(e)?e:1);return(!util.numeric(r)||i<=r)&&this.set(t,i),i},decrease:function(t,e,r){var i=util.toNumber(this.get(t),0)-(util.numeric(e)?e:1);return(!util.numeric(r)||r<=i)&&this.set(t,i),i},clear:function(){this.store={}}};