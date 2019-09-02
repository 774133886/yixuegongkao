var $=require("../jquery"),toNumber=require("../function/toNumber"),parseDate=require("../function/parseDate"),stringifyDate=require("../function/stringifyDate"),store=require("../store"),storage=require("../storage"),config=require("../config"),LOCAL_PREV_ENTER_DATE="bjy_prev_enter_date";function getTodayData(){var e=LOCAL_PREV_ENTER_DATE,t=storage.get(e);if(t){var r=storage.get(t);if(r)try{r=JSON.parse(r)}catch(e){}else r={}}else r={};return r}function setTodayData(e){var t=LOCAL_PREV_ENTER_DATE,r=storage.get(t);storage.set(r,JSON.stringify(e))}function getClassData(e){var t=exports.getClassId(),r=e[t];return $.isPlainObject(r)||(r=e[t]={}),r}function cleanLocalData(){var e=LOCAL_PREV_ENTER_DATE,t=storage.get(e),r=parseDate(t,"-"),s=new Date;if(r){if(r.getFullYear()===s.getFullYear()&&r.getMonth()===s.getMonth()&&r.getDate()===s.getDate())return;storage.remove(t)}storage.set(e,stringifyDate(s,"-"))}function updateEnterCount(){var e=getTodayData(),t=getClassData(e),r=t.enterCount;"number"!==$.type(r)&&(r=0),t.enterCount=++r,setTodayData(e)}exports.init=function(){cleanLocalData(),updateEnterCount()},exports.getClassId=function(){return store.get("class.id")},exports.getClassNumber=function(){return store.get("class.number")},exports.getClassType=function(){return store.get("class.type")},exports.getSerialNumber=function(){return store.get("class.serialNumber")},exports.getClassName=function(){return store.get("class.name")},exports.getUserCount=function(){return toNumber(store.get("class.userCount"),0)},exports.getStartTime=function(){return toNumber(store.get("class.startTime"),0)},exports.getEndTime=function(){return toNumber(store.get("class.endTime"),0)},exports.isStarted=function(){return store.get("class.started")},exports.inClassTime=function(){return exports.isStartTimeReached()&&!exports.isEndTimeReached()},exports.isStartTimeReached=function(){return exports.timeBeforeStartTime()<=0},exports.isEndTimeReached=function(){return exports.timeBeforeEndTime()<=0},exports.timeBeforeStartTime=function(){var e=exports.getStartTime(),t=store.get("class.diffNTP")+$.now();return t<=e?e-t:-1},exports.timeAfterStartTime=function(){var e=exports.getStartTime(),t=store.get("class.diffNTP")+$.now();return e<=t?t-e:-1},exports.timeBeforeEndTime=function(){var e=exports.getEndTime(),t=store.get("class.diffNTP")+$.now();return t<=e?e-t:-1},exports.timeAfterEndTime=function(){var e=exports.getEndTime(),t=store.get("class.diffNTP")+$.now();return e<=t?t-e:-1},exports.setForbidAll=function(e){store.set("class.forbidAll",e)},exports.getForbidAll=function(){return toNumber(store.get("class.forbidAll"))?1:0},exports.setForbidSpeakApply=function(e){store.set("class.forbidSpeakApply",e)},exports.getForbidSpeakApply=function(){return toNumber(store.get("class.forbidSpeakApply"))?1:0},exports.set=function(e,t){var r=getTodayData(),s=getClassData(r);$.isPlainObject(e)?$.extend(s,e):s[e]=t,setTodayData(r)},exports.get=function(e){return getClassData(getTodayData())[e]||""},exports.remove=function(e){var t=getTodayData(),r=getClassData(t);e in r&&(delete r[e],setTodayData(t))},exports.isLongTerm=function(){return store.get("class.isLongTerm")},exports.isAudioSpeex=function(){return toNumber(store.get("class.liveAudioCodec"),config.AUDIO_CODEC_AAC)===config.AUDIO_CODEC_SPEEX},exports.getRoomId=function(){return store.get("class.roomId")},exports.getToken=function(){return store.get("token")};