var toNumber=require("../function/toNumber"),toBoolean=require("../function/toBoolean"),docData=require("../data/doc"),userData=require("../data/user"),classData=require("../data/class"),serverData=require("../data/server"),shapeData=require("../data/shape"),store=require("../store"),auth=require("../auth"),config=require("../config"),eventEmitter=require("../eventEmitter"),camelCaseObject=require("../function/camelCaseObject"),inflatePoints=require("../function/inflatePoints"),WebSocket=require("./WebSocket"),$=require("../jquery"),util=require("../util"),getWebSocketUrl=require("../function/getWebSocketUrl"),info=require("../info"),tasks=[],AUDIO_MIXED_ON=1,AUDIO_MIXED_OFF=0;function executeByBuffer(e,t){if(e===store.get("user.id"))return t();var r=toNumber(store.get("class.playBuffer"),0);if(!(0<r))return t();function i(){t(),util.array.remove(tasks,n)}var n={action:i,buffer:r*=1e3,timestamp:$.now(),timer:setTimeout(i,r)};tasks.push(n)}function windowAlert(e){info.alert(e)}function updateProperty(e,t,r,i){t in e&&(r[i]=e[t])}var messageTypes={login_res:function(e){0===e.code?(store.set({"class.started":e.started,"class.totalUserCount":e.accumulative_user_count,"class.userCount":e.user_count,"class.speakState":e.speak_state,"class.loginTime":1e3*e.timestamp,"class.diffNTP":1e3*e.timestamp-$.now(),"class.isFree":e.speak_state===config.SPEAK_STATE_FREE,"class.teacherSwitchable":1==e.teacher_switchable,"class.classSwitch":1==e.class_switch}),roomServer.startHeartbeat(),eventEmitter.trigger(eventEmitter.ROOM_SERVER_LOGIN_SUCCESS)):1===e.code?eventEmitter.trigger(eventEmitter.ROOM_SERVER_LOGIN_FAIL):2===e.code?(eventEmitter.trigger(eventEmitter.ROOM_SERVER_LOGIN_OVERFLOW),eventEmitter.has(eventEmitter.ROOM_SERVER_LOGIN_OVERFLOW)||windowAlert("教室人数已达上限，无法进入")):3===e.code&&(eventEmitter.trigger(eventEmitter.ROOM_SERVER_LOGIN_KICKED_OUT),eventEmitter.has(eventEmitter.ROOM_SERVER_LOGIN_KICKED_OUT)||windowAlert("你已被踢出教室，无法再次进入"))},login_conflict:function(e){eventEmitter.trigger(eventEmitter.LOGIN_CONFLICT,{endType:e.end_type})},class_start:function(e){eventEmitter.trigger(eventEmitter.CLASS_START)},class_end:function(e){executeByBuffer(e.user_id,function(){eventEmitter.trigger(eventEmitter.CLASS_END)})},user_active_res:function(e){console.log("user_active_res"),console.log(e);var t=$.map(e.user_list||[],function(e){return(e=camelCaseObject(e)).mediaExt&&(e.mediaExt=$.map(e.mediaExt,function(e){return camelCaseObject(e)})),e}),r=e.presenter_id;store.set("presenterId",r),eventEmitter.trigger(eventEmitter.USER_ACTIVE_RES,{userList:t}),r&&store.set("presenter",userData.find(r))},user_in:function(e){var t=e.user;if(!auth.isSelf(t.id)){t=camelCaseObject(t);function r(){eventEmitter.trigger(eventEmitter.USER_IN,{user:t})}var i;if(auth.isTeacher(t.type)){var n=store.get("teacher.id");n&&(i=userData.find(n))}else i=userData.findByNumber(t.number);i&&((i.videoOn||i.audioOn)&&(i.canPlay=!userData.isAudioSpeex(i),eventEmitter.trigger(eventEmitter.MEDIA_PUBLISH,{videoOn:!1,audioOn:!1,user:i,linkType:i.linkType})),eventEmitter.trigger(eventEmitter.USER_OUT,{user:i})),r()}},user_out:function(e){var t=e.user_id,r=userData.find(t);r&&eventEmitter.trigger(eventEmitter.USER_OUT,{user:r})},user_more_res:function(e){var t=$.map(e.user_list||[],function(e){return camelCaseObject(e)});eventEmitter.trigger(eventEmitter.USER_MORE_RES,{hasMore:e.has_more,userList:t})},user_count_change:function(e){eventEmitter.trigger(eventEmitter.USER_COUNT_CHANGE,e),store.set({"class.totalUserCount":e.accumulative_user_count,"class.userCount":e.user_count})},notice_change:function(e){eventEmitter.trigger(eventEmitter.NOTICE_CHANGE,{content:e.content,link:e.link})},notice_res:function(e){eventEmitter.trigger(e.is_sticky?eventEmitter.STICKY_NOTICE_RES:eventEmitter.NOTICE_RES,{content:e.content,link:e.link,isSticky:e.is_sticky,group:e.group,sGroup:e.s_group})},gift_receive:function(e){eventEmitter.trigger(eventEmitter.GIFT_RECEIVE,{from:camelCaseObject(e.from),to:camelCaseObject(e.to),gift:e.gift})},my_gift_res:function(e){var t=$.map(e.history,function(e){return{from:camelCaseObject(e.from),gift:e.gift}});eventEmitter.trigger(eventEmitter.MY_GIFT_RES,{history:t})},message_send_forbid:function(e){var t=camelCaseObject(e.from),r=camelCaseObject(e.to);eventEmitter.trigger(eventEmitter.MESSAGE_SEND_FORBID,{from:t,to:r,forbidSelf:auth.isSelf(r.id),duration:e.duration})},doc_all_res:function(e){var t=$.map(e.doc_list||[],function(e){return camelCaseObject(e)});$.each(t,function(e,t){var r=[],i=0,n=(t.id,t.pageInfo),s=n.width,a=n.height,o=n.urlPrefix,u=+n.totalPages,_=n.isDoc,m=n.url;if(_)for(;i<u;)r[i]={width:s,height:a,url:o+"_"+ ++i+".png"};else r[i]={width:s,height:a,url:m};t.pageList=r}),eventEmitter.trigger(eventEmitter.DOC_ALL_RES,{docList:t});var r={docId:e.doc_id,page:e.page};util.is.number(e.step)&&(r.step=e.step),eventEmitter.trigger(eventEmitter.SERVER_PAGE_CHANGE,r)},doc_add:function(e){var t=e.doc.page_info,r=t.total_pages,i=t.is_doc,n=0;if(e.doc.page_list=[],i)for(;n<r;)e.doc.page_list[n]={width:t.width,height:t.height,url:t.url_prefix+"_"+ ++n+".png"};else e.doc.page_list[n]={width:t.width,height:t.height,url:t.url};executeByBuffer(e.user_id,function(){eventEmitter.trigger(eventEmitter.DOC_ADD,{fromId:e.user_id,doc:camelCaseObject(e.doc)})})},doc_update:function(e){eventEmitter.trigger(eventEmitter.DOC_UPDATE,{fromId:e.user_id,docId:e.doc_id,extra:camelCaseObject(e.extra)})},user_update:function(e){e=camelCaseObject(e);var t=$.extend({},userData.findByNumber(e.userNumber),e.user);t.canPlay=!userData.isAudioSpeex(t)||auth.isWebRTC(),eventEmitter.trigger(eventEmitter.USER_UPDATE_RES,{user:t})},doc_del:function(t){executeByBuffer(t.user_id,function(){var e=docData.remove(t.doc_id);eventEmitter.trigger(eventEmitter.DOC_REMOVE,{fromId:t.user_id,docId:e.id,docNumber:e.number})})},doc_attach_res:function(e){eventEmitter.trigger(eventEmitter.DOC_ATTACH_RES,{code:e.code})},doc_detach_res:function(e){eventEmitter.trigger(eventEmitter.DOC_DETACH_RES,{code:e.code})},doc_library_list_res:function(e){eventEmitter.trigger(eventEmitter.DOC_LIBRARY_LIST_RES,{docList:e.doc_list})},page_change:function(t){executeByBuffer(t.user_id,function(){var e={docId:t.doc_id,page:t.page};util.is.number(t.step)&&(e.step=t.step),eventEmitter.trigger(eventEmitter.SERVER_PAGE_CHANGE,e)})},record_shape_clean_res:function(){eventEmitter.trigger(eventEmitter.RECORD_SHAPE_CLEAN)},shape_all_res:function(e){var t=e.shape_list||[];$.each(t,function(e,t){t.points=inflatePoints(t)}),eventEmitter.trigger(eventEmitter.SHAPE_ALL_RES,{docId:e.doc_id,page:e.page,shapeList:t})},shape_add:function(t){executeByBuffer(t.user_id,function(){var e=t.shape;e.points=inflatePoints(e),eventEmitter.trigger(eventEmitter.SHAPE_ADD,{fromId:t.user_id,docId:t.doc_id,page:t.page,shape:e})})},shape_del:function(e){e.record_clean?eventEmitter.trigger(eventEmitter.RECORD_SHAPE_CLEAN):executeByBuffer(e.user_id,function(){eventEmitter.trigger(eventEmitter.SHAPE_REMOVE,{fromId:e.user_id,docId:e.doc_id,page:e.page,shapeId:e.shape_id||""})})},shape_update:function(t){executeByBuffer(t.user_id,function(){var e=t.shape_list;$.each(e,function(e,t){t.points=inflatePoints(t)}),eventEmitter.trigger(eventEmitter.SHAPE_UPDATE,{fromId:t.user_id,docId:t.doc_id,page:t.page,shapeList:e})})},shape_laser:function(e){executeByBuffer(e.user_id,function(){eventEmitter.trigger(eventEmitter.SHAPE_LASER,{fromId:e.user_id,docId:e.doc_id,page:e.page,shape:e.shape})})},media_publish:function(r){return executeByBuffer(r.user_id,function(){var e=camelCaseObject(r.user);if(!userData.find(e.id))return!1;var t={};return"boolean"===$.type(r.video_on)&&(t.videoOn=e.videoOn=r.video_on),"boolean"===$.type(r.audio_on)&&(t.audioOn=e.audioOn=r.audio_on),"number"===$.type(r.audio_mixed)&&(t.audioMixed=e.audioMixed=r.audio_mixed),"number"===$.type(r.skip_release)&&(t.skipRelease=1==r.skip_release),"number"===$.type(r.support_mute_stream)&&(t.supportMuteStream=e.supportMuteStream=1==r.support_mute_stream),"number"===$.type(r.is_screen_sharing)&&(t.isScreenSharing=e.isScreenSharing=1==r.is_screen_sharing),"number"===$.type(r.support_black_stream)&&(t.supportBlackStream=e.supportBlackStream=1==r.support_black_stream),"number"===$.type(r.action_type)&&(t.actionType=r.action_type),"number"==$.type(r.offset_timestamp)&&(t.offsetTimestamp=r.offset_timestamp),updateProperty(r,"publish_index",e,"publishIndex"),updateProperty(r,"publish_server",e,"publishServer"),updateProperty(r,"link_type",e,"linkType"),t.user=userData.update(e)||e,t.linkType=e.linkType,t.user.canPlay=!userData.isAudioSpeex(t.user)||auth.isWebRTC(),eventEmitter.trigger(eventEmitter.MEDIA_PUBLISH,t),!0})},media_publish_ext:function(e){var t=camelCaseObject(e.user),r={};"boolean"===$.type(e.video_on)&&(r.videoOn=t.assistVideoOn=e.video_on),"boolean"===$.type(e.audio_on)&&(r.audioOn=t.assistAudioOn=e.audio_on),updateProperty(e,"publish_index",t,"publishIndex"),updateProperty(e,"publish_server",t,"publishServer"),updateProperty(e,"link_type",t,"linkType"),r.user=$.extend(!0,{},userData.update(t)||t),r.user.videoOn=r.videoOn,r.user.audioOn=!1,r.linkType=t.linkType,r.mediaId=e.media_id,eventEmitter.trigger(eventEmitter.ASSIST_MEDIA_PUBLISH,r)},media_republish:function(i){executeByBuffer(i.user_id,function(){var e=camelCaseObject(i.user),t={};!0===i.video_on&&(t.videoOn=e.videoOn=!0),!0===i.audio_on&&(t.audioOn=e.audioOn=!0),"number"===$.type(i.audio_mixed)&&(t.audioMixed=e.audioMixed=i.audio_mixed);var r=userData.find(e.id);r&&e.publishIndex>r.publishIndex&&(t.switchServer=!0),"number"===$.type(i.support_mute_stream)&&(t.supportMuteStream=e.supportMuteStream=1==i.support_mute_stream),"number"===$.type(i.is_screen_sharing)&&(t.isScreenSharing=e.isScreenSharing=1==i.is_screen_sharing),"number"===$.type(i.support_black_stream)&&(t.supportBlackStream=e.supportBlackStream=1==i.support_black_stream),"number"===$.type(i.action_type)&&(t.actionType=i.action_type),updateProperty(i,"publish_index",e,"publishIndex"),updateProperty(i,"publish_server",e,"publishServer"),updateProperty(i,"link_type",e,"linkType"),t.user=userData.update(e)||e,t.user.canPlay=!userData.isAudioSpeex(t.user)||auth.isWebRTC(),t.linkType=e.linkType,t.mediaId=i.media_id,eventEmitter.trigger(eventEmitter.MEDIA_REPUBLISH,t)})},media_republish_ext:function(e){var t=camelCaseObject(e.user),r={};!0===e.video_on&&(r.videoOn=t.assitVideoOn=!0),!0===e.audio_on&&(r.audioOn=t.assitAudioOn=!0);var i=userData.find(t.id);i&&t.publishIndex>i.publishIndex&&(r.switchServer=!0),updateProperty(e,"publish_index",t,"publishIndex"),updateProperty(e,"publish_server",t,"publishServer"),updateProperty(e,"link_type",t,"linkType"),r.user=userData.update(t)||t,r.linkType=t.linkType,r.mediaId=e.media_id,eventEmitter.trigger(eventEmitter.ASSIST_MEDIA_REPUBLISH,r)},media_remote_control:function(e){var t,r=e.user_id,i=store.get("user");if(auth.canPushStream()){t=r==i.id?store.get("user"):store.get("teacher");var n,s,a,o,u=toBoolean(e.video_on),_=toBoolean(e.audio_on);r&&(n=r,s={name:"media_remote_control_res",params:{user_id:store.get("user.id"),video_on:u,audio_on:_}},a=s.name,o=s.params,s={command_type:a},util.extend(s,o),roomServer.sendCommand(n,s)),eventEmitter.trigger(eventEmitter.UPDATE_SPEAK_STATE,{videoOn:u,audioOn:_,operator:t})}},speak_apply_req:function(e){eventEmitter.trigger(eventEmitter.SPEAK_APPLY_REQ,{user:camelCaseObject(e.from)})},speak_apply_res:function(e){eventEmitter.trigger(eventEmitter.SPEAK_APPLY_RES,{speakState:e.speak_state,user:camelCaseObject(e.user),fromId:e.user_id})},user_state_res:function(e){eventEmitter.trigger(eventEmitter.USER_STATE_RES,{userNumber:e.user_number,userState:camelCaseObject(e.user_state)})},group_size_res:function(e){eventEmitter.trigger(eventEmitter.GROUP_SIZE_RES,e.group_size)},broadcast_cache_res:function(e){eventEmitter.trigger(eventEmitter.BROADCAST_CACHE_RES,{key:e.key,value:e.value,fromId:e.user_id})},user_search_res:function(e){var t=$.map(e.result||[],function(e){return camelCaseObject(e)});eventEmitter.trigger(eventEmitter.USER_SEARCH_RES,{result:t})},command_receive:function(e){eventEmitter.trigger(eventEmitter.COMMAND_RECEIVE,{fromId:e.from,command:e.data})},broadcast_receive:function(e){eventEmitter.trigger(eventEmitter.BROADCAST_RECEIVE,{fromId:e.user_id,key:e.key,value:e.value})},survey_prev_res:function(e){var t=e.survey_list,r=e.gold_medal_count,i=e.silver_medal_count;t.length&&(t=camelCaseObject(t)),eventEmitter.trigger(eventEmitter.SURVEY_PREV_RES,{surveyList:t,goldMedalCount:r,silverMedalCount:i})},survey_receive:function(e){var t=e.survey_list;t=t&&camelCaseObject(t),eventEmitter.trigger(eventEmitter.SURVEY_QUESTION_RECEIVE,{surveyList:t})},survey_answer_count:function(e){var t=e.survey_list;t=t&&camelCaseObject(t),eventEmitter.trigger(eventEmitter.SURVEY_ANSWER_COUNT,{surveyList:t})},survey_answer_user:function(e){var t=e.survey_list;t=t&&camelCaseObject(t),eventEmitter.trigger(eventEmitter.SURVEY_ANSWER_USER,{surveyList:t})},student_list_res:function(e){var t=e.students;eventEmitter.trigger(eventEmitter.STUDENT_LIST_RES,{studentList:camelCaseObject(t)})},cloud_record_stop:function(e){eventEmitter.trigger(eventEmitter.CLOUD_RECORD_END_TRIGGER)},lottery_complete_res:function(e){eventEmitter.trigger(eventEmitter.LOTTERY_COMPLETE_RES,{complete:e.complete,lotteryCode:e.lottery_code,lotteryNumber:e.lottery_number,lotteryName:e.lottery_name})},lottery_receive:function(e){eventEmitter.trigger(eventEmitter.LOTTERY_RECEIVE,{lotteryName:e.lottery_name,lotteryNumber:e.lottery_number})},lottery_draw_res:function(e){eventEmitter.trigger(eventEmitter.LOTTERY_DRAW_RES,{isWin:e.win,lotteryCode:e.lottery_code})},lottery_result_res:function(e){var t=e.winner_list;t.length&&(t=camelCaseObject(t)),eventEmitter.trigger(eventEmitter.LOTTERY_RESULT_RES,{winnerList:t,lotteryName:e.lottery_name,lotteryNumber:e.lottery_number})},roll_call:function(e){eventEmitter.trigger(eventEmitter.ROLL_CALL,{duration:e.duration})},roll_call_result:function(e){eventEmitter.trigger(eventEmitter.ROLL_CALL_RESULT,{sessionId:e.session_id,ackList:e.ack_list,nackList:e.nack_list})},speak_invite_req:function(e){eventEmitter.trigger(eventEmitter.SPEAK_INVITE_REQ,{to:e.to,invite:e.invite})},speak_invite_res:function(e){eventEmitter.trigger(eventEmitter.SPEAK_INVITE_RES,{confirm:e.confirm,fromId:e.user_id})},speak_invite_pending_list:function(e){var t=e.user_list;t&&eventEmitter.trigger(eventEmitter.SPEAK_INVITE_PENDING_LIST,{userIdList:t})},cloud_record_command_accept:function(e){eventEmitter.trigger(eventEmitter.CLOUD_RECORD_COMMAND_ACCEPT,e.command)},presenter_change:function(e){var t=e.presenter_id;store.set({presenterId:t,presenter:userData.find(t)}),eventEmitter.trigger(eventEmitter.PRESENTER_CHANGE,{presenterId:t})},video_resolution_change:function(e){var t=e.user_id,r=userData.find(t);r&&(r.videoResolution={width:e.width,height:e.height},eventEmitter.trigger(eventEmitter.VIDEO_RESOLUTION_CHANGE,{width:e.width,height:e.height,userId:t}))},foreign_line_switch:function(e){var t=e.uplink_server_list,r=e.downlink_server_list;(t||r)&&(t&&serverData.setUdpUplinkServerList(t),r&&serverData.setUdpDownlinkServerList(r),t&&store.get("class.uplinkType")===config.LINK_TYPE_UDP&&eventEmitter.trigger(eventEmitter.UPLINK_SERVER_NODE_CHANGE_TRIGGER,t[0]),r&&store.get("class.downlinkType")===config.LINK_TYPE_UDP&&eventEmitter.trigger(eventEmitter.DOWNLINK_SERVER_NODE_CHANGE_TRIGGER,t[0]))},media_publish_deny:function(e){eventEmitter.has(eventEmitter.MEDIA_PUBLISH_DENY)?eventEmitter.trigger(eventEmitter.MEDIA_PUBLISH_DENY,e):windowAlert("服务器拒绝发布音视频，音视频并发已达上限")},media_republish_deny:function(e){eventEmitter.has(eventEmitter.MEDIA_REPUBLISH_DENY)?eventEmitter.trigger(eventEmitter.MEDIA_REPUBLISH_DENY,e):windowAlert("服务器拒绝重新发布音视频，音视频并发已达上限")},media_publish_ext_deny:function(e){eventEmitter.has(eventEmitter.MEDIA_PUBLISH_EXT_DENY)?eventEmitter.trigger(eventEmitter.MEDIA_PUBLISH_EXT_DENY,e):windowAlert("服务器拒绝发布辅摄像头音视频，音视频并发已达上限")},media_republish_ext_deny:function(e){eventEmitter.has(eventEmitter.MEDIA_REPUBLISH_EXT_DENY)?eventEmitter.trigger(eventEmitter.MEDIA_REPUBLISH_EXT_DENY,e):windowAlert("服务器拒绝重新发布辅摄像头音视频，音视频并发已达上限")},class_switch:function(e){console.log("recieve class_switch"),eventEmitter.trigger(eventEmitter.CLASS_SWITCH,{targetClassId:e.target_class_id,groupId:e.group_id})},speak_apply_deny:function(e){eventEmitter.has(eventEmitter.SPEAK_APPLY_DENY)?eventEmitter.trigger(eventEmitter.SPEAK_APPLY_DENY,e):windowAlert("服务器拒绝申请发言，音视频并发已达上限")},log:function(e){if("production"!==store.get("env"))switch(e.type){case"info":BJY.logger.info("rs log",e.msg);break;case"warn":BJY.logger.warn("rs log",e.msg);break;case"danger":windowAlert("rs log: "+e.msg)}},standard_lottery_ready_res:function(e){eventEmitter.trigger(eventEmitter.STANDARD_LOTTERY_READY_RES,{userList:e.user_list,userCount:e.stu_count})},standard_lottery_end:function(e){eventEmitter.trigger(eventEmitter.STANDARD_LOTTERY_END,{hitList:e.hit_list,lotteryName:e.lottery_name})},lottery_history_res:function(e){eventEmitter.trigger(eventEmitter.LOTTERY_HISTORY_RES,{history:e.history})},command_lottery_begin:function(e){eventEmitter.trigger(eventEmitter.COMMAND_LOTTERY_BEIGIN,{command:e.command,duration:e.duration,beginTime:e.begin_time})},command_lottery_status_res:function(e){eventEmitter.trigger(eventEmitter.COMMAND_LOTTERY_STATUS_RES,{duration:e.duration,beginTime:e.begin_time,command:e.command})},command_lottery_abort:function(e){eventEmitter.trigger(eventEmitter.COMMAND_LOTTERY_ABORT,{hitList:e.hit_list,lotteryName:e.lottery_name})},command_lottery_hit_res:function(e){e.user_id===store.get("user.id")&&eventEmitter.trigger(eventEmitter.COMMAND_LOTTERY_HIT_RES)},quiz_start:function(e){eventEmitter.trigger(eventEmitter.QUIZ_START,{messageType:"quiz_start",quizId:e.quiz_id,forceJoin:e.force_join})},quiz_end:function(e){eventEmitter.trigger(eventEmitter.QUIZ_END,{messageType:"quiz_end",quizId:e.quiz_id})},quiz_solution:function(e){eventEmitter.trigger(eventEmitter.QUIZ_SOLUTION,{messageType:"quiz_solution",quizId:e.quiz_id,solution:e.solution})},quiz_res:function(e){eventEmitter.trigger(eventEmitter.QUIZ_RES,{messageType:"quiz_res",quizId:e.quiz_id,solution:e.solution,endFlag:e.end_flag,forceJoin:e.force_join})}};function getMediaPublishParams(e){var t=store.get("user"),r=t.publishServer,i={id:t.id,number:t.number,type:t.type,name:t.name,avatar:t.avatar,status:t.status,end_type:t.endType},n={publish_index:t.publishIndex,publish_server:{ip:r.ip,port:r.port},user:i,link_type:config.LINK_TYPE_TCP},s="boolean"===$.type(e.videoOn),a="boolean"===$.type(e.audioOn);return s&&(n.video_on=e.videoOn),a&&(n.audio_on=e.audioOn),"boolean"===$.type(e.skipRelease)?n.skip_release=e.skipRelease?1:0:n.skip_release=0,"number"===$.type(e.actionType)&&(n.action_type=e.actionType),util.is.boolean(e.isScreenSharing)&&(n.is_screen_sharing=e.isScreenSharing?1:0),n.support_mute_stream=0,n.support_black_stream=0,n.audio_mixed=AUDIO_MIXED_OFF,n}function getRepublishMediaParams(e){var t=store.get("user"),r=t.publishServer,i={id:t.id,number:t.number,type:t.type,name:t.name,avatar:t.avatar,status:t.status,end_type:t.endType},n={message_type:"media_republish_trigger",publish_index:e.isAssist?t.mediaExt[0].publishIndex:t.publishIndex,publish_server:{ip:r.ip,port:r.port},user:i,link_type:e.linkType},s=!0===e.videoOn,a=!0===e.audioOn;return s&&(n.video_on=!0),a&&(n.audio_on=!0),"number"===$.type(e.actionType)&&(n.action_type=e.actionType),util.is.boolean(e.isScreenSharing)&&(n.is_screen_sharing=e.isScreenSharing?1:0),n.audio_mixed=auth.canPublishMixedAudioStream()?AUDIO_MIXED_ON:AUDIO_MIXED_OFF,n.support_mute_stream=auth.canPublishMuteStream()?1:0,n.support_black_stream=auth.canPublishBlackStream()?1:0,n}var roomServer={messageTypes:messageTypes,init:function(){roomServer.socket=new WebSocket({interval:config.SECOND,retryCount:config.WEBSOCKET_TRY_CONNECT_COUNT,timeout:config.ROOM_SERVER_CONNECT_TIMEOUT,onSend:function(e){eventEmitter.trigger(eventEmitter.WEBSOCKET_SEND,e)},onReceive:function(e){var t=messageTypes[e.message_type];t&&t(e),eventEmitter.trigger(eventEmitter.WEBSOCKET_RECEIVE,e)},onOpen:function(e){var t=e.server;$.extend(roomServer,t),serverData.setActiveRoomServer(t),eventEmitter.trigger(eventEmitter.ROOM_SERVER_CONNECT_SUCCESS,e),roomServer.login()},onClose:function(){roomServer.endHeartbeat(),eventEmitter.trigger(eventEmitter.WEBSOCKET_CLOSE,this),eventEmitter.trigger(eventEmitter.ROOM_SERVER_OFFLINE)},onError:function(){eventEmitter.trigger(eventEmitter.ROOM_SERVER_CONNECT_FAIL)}});var e=serverData.getRoomServerList()[0];e.url=getWebSocketUrl(e),roomServer.connect(e,serverData.getRoomProxyServerList())},connect:function(e,t){var r=roomServer.socket;r&&r.connect(e,t)},startHeartbeat:function(){roomServer.endHeartbeat(),roomServer.heartbeatTimer=setInterval(function(){roomServer.heartbeat(),eventEmitter.trigger(eventEmitter.SEND_HEARTBEAT)},config.HEARTBEAT_INTERVAL)},endHeartbeat:function(){var e=roomServer.heartbeatTimer;e&&(clearInterval(e),roomServer.heartbeatTimer=null)},heartbeat:function(){roomServer.send({message_type:"heart_beat"})},logout:function(){roomServer.send({message_type:"logout_req"})},login:function(){var e=store.get("user"),t=store.get("class.speakState");null==t&&(t=config.SPEAK_STATE_LIMIT);var r=store.get("partner.liveLinkTypeConsistency",0),i={message_type:"login_req",speak_state:t,auth_url:store.get("authUrl"),token:store.get("token"),user:{number:e.number,group:store.get("user.group",0),type:e.type,name:e.name,actual_name:e.actualName,avatar:e.avatar,status:e.status,end_type:e.endType},course_number:store.get("class.number"),start_time:classData.getStartTime(),end_time:classData.getEndTime(),support:{points_decoder:2,link_type_consistency:r,teacher_preferred_link_type:store.get("partner.liveTeacherPreferredLinkType",0)}};r&&1!=r&&(r=0,store.set("partner.liveLinkTypeConsistency",r)),auth.isTeacher(e.type)&&(i.class_name=classData.getClassName(),i.class_number=classData.getClassNumber()),roomServer.send(i)},changeSpeakState:function(e){roomServer.send({message_type:"speak_state_change_trigger",speak_state:e})},publishMedia:function(e){var t=getMediaPublishParams(e);t.message_type="media_publish_trigger";var r="boolean"===$.type(e.videoOn),i="boolean"===$.type(e.audioOn);(r||i)&&roomServer.send(t)},publishMixAudio:function(e){var t=getMediaPublishParams(e);if(t.message_type="mixaudio_mute_publish_req",!t.audio_on&&t.audio_mixed&&auth.canCloudRecordWhenMuteMic()){var r=userData.active();(r=userData.group(r).studentList).length&&(r=r.filter(function(e){return console.log(e.audioOn),e.audioOn})),t.audio_on=!!r.length,roomServer.send(t)}},republishMedia:function(e){var t=getRepublishMediaParams(e);t.message_type="media_republish_trigger";var r=!0===e.videoOn,i=!0===e.audioOn;(r||i)&&roomServer.send(t)},sendCommand:function(e,t){var r=store.get("user");roomServer.send({message_type:"command_send",from:r.id,to:e,data:t})},sendBroadcast:function(e){var t=e.options||{};roomServer.send({message_type:"broadcast_send",options:{cache:!!$.type(t.cache)&&t.cache,all:!$.type(t.all)||t.all},key:e.key,value:e.value})},getCachedBroadcast:function(e){roomServer.send({message_type:"broadcast_cache_req",key:e.key})},recordShapeClean:function(e){roomServer.send({message_type:"record_shape_clean_req",class_id:e.classId,user_id:e.userId})},startCloudRecord:function(){roomServer.send({message_type:"cloud_record_command_send",command:"start_processing"})},changeResolution:function(e){roomServer.send({message_type:"cloud_record_command_send",command:"change_resolution",value:{width:e.width,height:e.height}})},trace:function(e){var t=store.get("user");roomServer.send({message_type:"trace",data:{class:store.get("class"),user:{id:t.id,number:t.number,type:t.type,name:t.name,avatar:t.avatar,status:t.status,end_type:t.endType},data:JSON.stringify(e)}})},getQuiz:function(){roomServer.send({message_type:"quiz_req",user_number:store.get("user.number")})},submitQuiz:function(e){roomServer.send({message_type:"quiz_submit",user_number:store.get("user.number"),user_name:store.get("user.name"),quiz_id:e.quiz_id,solution:e.solution})},send:function(e){e.class_id=store.get("class").id,e.user_id=store.get("user").id;var t=roomServer.socket;t&&t.send(e)},close:function(){console.log("room server close by program");var e=roomServer.socket,t=$.Deferred();return e?e.close().then(function(){t.resolve(),roomServer.socket=null}):t.resolve(),t}};module.exports=roomServer;