var live=require("../server/live"),userData=require("../data/user"),store=require("../store"),auth=require("../auth");module.exports=function(e){return auth.isWebRTC()?store.get("class.started")&&store.get("presenterId")?live.getDownlinkWebRTCMixedStreamName():" ":userData.isAudioSpeex(e)||!e.audioOn&&!e.videoOn?"":live.getDownlinkStreamName(e.id,e.publishIndex)};