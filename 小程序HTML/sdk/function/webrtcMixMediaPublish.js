var store=require("../store"),eventEmitter=require("../eventEmitter"),TIMEOUT=2;module.exports=function(e){var t,r,s=store.get("presenterId"),o=store.get("class.started"),i=store.get("webrtcMixUser.videoOn"),n=store.get("webrtcMixUser.audioOn");console.log("presenterId",s),console.log("class.stared",o),(t=r=!(!s||!o))!==i&&r!==n&&(store.set("webrtcMixUser.audioOn",r),store.set("webrtcMixUser.videoOn",t),i||n||!t&&!r?eventEmitter.trigger(eventEmitter.WEBRTC_MIX_MEDIA_PUBLISH,{user:store.get("webrtcMixUser"),videoOn:t,audioOn:r}):setTimeout(function(){eventEmitter.trigger(eventEmitter.WEBRTC_MIX_MEDIA_PUBLISH,{user:store.get("webrtcMixUser"),videoOn:t,audioOn:r})},1e3*TIMEOUT))};