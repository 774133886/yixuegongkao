var eventEmitter=require("../../eventEmitter"),userData=require("../../data/user"),store=require("../../store"),info=require("../../info"),$=require("../../jquery"),auth=require("../../auth"),webrtcMixMediaPublish=require("../../function/webrtcMixMediaPublish"),language=require("../../language/main")(),hasTiped=!1;$.extend(language,require("./language/main")()),Component({properties:{showName:{type:Boolean,value:!0},styleInfo:{type:Object,value:{fontSize:12}},stopPlay:{type:Boolean,value:!1},fullScreen:{type:Boolean,value:!1},coverImage:{type:String,value:"/sdk/component/player/image/closeCamera.png"}},data:{userInfo:{}},ready:function(){var n=this;hasTiped=!1,auth.isWebRTC()?(eventEmitter.on(eventEmitter.WEBRTC_MIX_MEDIA_PUBLISH,function(e,t){n.setUser(t.user)}).on(eventEmitter.CLASS_START,function(){webrtcMixMediaPublish()}).on(eventEmitter.CLASS_END,function(){webrtcMixMediaPublish()}).on(eventEmitter.PRESENTER_CHANGE,function(){webrtcMixMediaPublish()}).on(eventEmitter.VIEW_RENDER_TRIGGER,function(){webrtcMixMediaPublish()}),store.set("webrtcMixUser.name",language.USER_ROLE_TEACHER)):eventEmitter.on(eventEmitter.MEDIA_PUBLISH,function(e,t){var a=t.user;auth.isTeacher(a.type)&&n.setUser(a)}).on(eventEmitter.USER_UPDATE_RES,function(e,t){var a=t.user;auth.isTeacher(a.type)&&n.setUser(a)}).on(eventEmitter.MEDIA_REPUBLISH,function(e,t){var a=t.user;auth.isTeacher(a.type)&&n.setUser(a)}).on(eventEmitter.USER_OUT,function(e,t){var a=t.user;auth.isTeacher(a.type)&&(a.audioOn=!1,a.videoOn=!1,a.name="",a.canPlay=!userData.isAudioSpeex(a)||auth.isWebRTC(),n.setUser(a))})},methods:{onPlayerTap:function(e){console.log("on teacher player tap");this.triggerEvent("teacherPlayerTap",e.detail)},onPlayerAVStatusChange:function(e){var t=e.detail.changeInfo,a="";console.log("onPlayerAVStatusChange",t),!0===t.audioTo&&hasTiped&&(a=language.TEACHER_OPEN_AUDIO),!1===t.audioTo&&(a=language.TEACHER_CLOSE_AUDIO),!1===t.videoTo&&hasTiped&&(a=language.TEACHER_CLOSE_VIDEO),!0===t.videoTo&&(a=language.TEACHER_OPEN_VIDEO),a&&info.tip(a),hasTiped=hasTiped||!0,this.triggerEvent("AVStatusChange",e.detail)},onSupportedChanged:function(e){this.triggerEvent("isSupportedChanged",e.detail)},onNetStatus:function(e){this.triggerEvent("netStatus",e.detail)},setUser:function(e){this.setData({userInfo:e}),this.triggerEvent("setUserInfo",{user:e})}}});