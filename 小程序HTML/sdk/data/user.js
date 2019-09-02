var store=require("../store"),config=require("../config"),eventEmitter=require("../eventEmitter"),$=require("../jquery"),classData=require("./class"),idToUserMap={},numberToUserMap={};function isValidUserId(e){return e||0===e}function getValidUser(e){var t=idToUserMap[e];if(t&&t===numberToUserMap[t.number])return t}function updateUser(e){var t=e.type===config.ROLE_TYPE_TEACHER,r=e.id===store.get("user.id"),i={};t&&$.extend(i,store.get("teacher")),r&&$.extend(i,store.get("user")),$.extend(i,e),t&&store.set("teacher",i),r&&store.set("user",i);var n=store.get("presenterId");return n?e.id===n&&store.set("presenter",i):t&&(store.set("presenterId",i.id),store.set("presenter",i)),i}function diff(e,r){var i=[];return $.each(e,function(e,t){$.isArray(t)||$.isPlainObject(t)?(null==r[e]||0<diff(t,r[e]).length)&&i.push(e):t!==r[e]&&i.push(e)}),i}exports.add=function(e,t){$.isArray(e)||(e=[e]);var s=[];$.each(e,function(e,t){if(t){var r=t.id,i=t.number;if(isValidUserId(r)){if(getValidUser(r))return void exports.update(t);if(0!=i){var n=numberToUserMap[t.number];n&&isValidUserId(n.id)&&exports.remove(n.id)}t=updateUser(t),idToUserMap[r]=numberToUserMap[i]=t,s.push(t)}}});var r=exports.group(s),i=r.teacherList;1===i.length&&(store.set("teacher",i[0]),eventEmitter.trigger(eventEmitter.TEACHER_ADD,{userList:i}));var n=r.assistantList;0<n.length&&eventEmitter.trigger(eventEmitter.ASSISTANT_ADD,{userList:n});var a=r.studentList;0<a.length&&eventEmitter.trigger(eventEmitter.STUDENT_ADD,{userList:a}),0<s.length&&eventEmitter.trigger(eventEmitter.USER_ADD,{userList:s})},exports.remove=function(e){var t=getValidUser(e);if(t){var r;switch(t.videoOn=t.audioOn=null,t.type){case config.ROLE_TYPE_TEACHER:r=eventEmitter.TEACHER_REMOVE;break;case config.ROLE_TYPE_ASSISTANT:r=eventEmitter.ASSISTANT_REMOVE;break;case config.ROLE_TYPE_STUDENT:r=eventEmitter.STUDENT_REMOVE;break;case config.ROLE_TYPE_GUEST:r=eventEmitter.GUEST_REMOVE}return delete idToUserMap[e],delete numberToUserMap[t.number],eventEmitter.trigger(r,{user:t}),eventEmitter.trigger(eventEmitter.USER_REMOVE,{user:t}),!0}return!1},exports.update=function(r){var e=getValidUser(r.id);if(null!=e){var t=diff(r,e);if(0===t.length)return;var i={};$.each(t,function(e,t){i[t]=r[t]});var n,s=updateUser(r);switch(idToUserMap[r.id]=numberToUserMap[r.number]=s,r.type){case config.ROLE_TYPE_TEACHER:n=eventEmitter.TEACHER_UPDATE;break;case config.ROLE_TYPE_ASSISTANT:n=eventEmitter.ASSISTANT_UPDATE;break;case config.ROLE_TYPE_STUDENT:n=eventEmitter.STUDENT_UPDATE;break;case config.ROLE_TYPE_GUEST:n=eventEmitter.GUEST_UPDATE}var a={user:s,update:i};return eventEmitter.trigger(n,a),eventEmitter.trigger(eventEmitter.USER_UPDATE,a),s}numberToUserMap[r.number]||exports.add(r)},exports.find=function(e){return getValidUser(e)},exports.findByNumber=function(e){var t=numberToUserMap[e];return t&&getValidUser(t.id)},exports.active=function(){return exports.all().filter(function(e){return!(!e.videoOn&&!e.audioOn)})},exports.all=function(){var r=[];return $.each(idToUserMap,function(e){var t=getValidUser(e);t&&r.push(t)}),r},exports.isAudioSpeex=function(e){return e.endType==config.END_TYPE_PC_BROWSER||classData.isAudioSpeex()},exports.group=function(e){var r=[],i=[],n=[];return $.each(e||idToUserMap,function(e,t){switch(t.type){case config.ROLE_TYPE_TEACHER:r.push(t);break;case config.ROLE_TYPE_ASSISTANT:i.push(t);break;case config.ROLE_TYPE_STUDENT:n.push(t)}}),{teacherList:r,assistantList:i,studentList:n}},exports.hasAssistant=function(){var t=!1;return $.each(idToUserMap,function(e){if(getValidUser(e).type===config.ROLE_TYPE_ASSISTANT)return!(t=!0)}),t};