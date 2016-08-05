var currentver = "0.046";
//console.log=function(){;};
//////////////////////////////////////// Array.findIndex
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        if (i in list) {
          value = list[i];
          if (predicate.call(thisArg, value, i, list)) {
            return i;
          }
        }
      }
      return -1;
    }
  });
}

function SortObjectsByTS(a, b) {
  if (a.ts > b.ts) {
    return 1;
  }
  if (a.ts < b.ts) {
    return -1;
  }
  // a must be equal to b
  return 0;
}
function SortObjectsByLTS(a, b) {
  if (a.lts < b.lts) {
    return 1;
  }
  if (a.lts > b.lts) {
    return -1;
  }
  // a must be equal to b
  return 0;
}
function SortObjectsBySentTS(a, b) {
  if (a.sent < b.sent) {
    return 1;
  }
  if (a.sent > b.sent) {
    return -1;
  }
  // a must be equal to b
  return 0;
}

//function d2h(d) {return d.toString(16);}
//function h2d(h) {return parseInt(h,16);}
var pki = forge.pki;
var rsa = forge.pki.rsa;
var publicKey,privateKey;

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

function defined(obj){
	return (typeof(obj)!='undefined');
};

function log(x) {
        var txt = document.getElementById('txt');
        if (txt)
            txt.innerHTML += "<BR/>" + x;
}

function isFrontAlive(args, cb){
    //console.log(JSON.stringify(args));
    var res = true;
    return cb(res);
    /*jxcore('syncCmd').call(JSON.stringify({cmd:cmd,data:data}), function(ret, err){
        if(err)console.log(err);
        ret=null;
    });*/
};

var maxHistory2Send=10;


var platform = "android";
var isIos = false;
var inBG = false;
var dontForceForeground = false;
var myService;
mobile = true;


function jxcore_ready() {
   	// calling a method from JXcore (app.js)
    jxcore('isFrontAlive').register(isFrontAlive);
    jxcore('dataFromBackend').register(dataFromBackend);

    jxcore('asyncPing').call('', function(ret, err){
		if(err){
            console.log(JSON.stringify(err));
            return;
        }
        else{
            //platform=ret;
    		isIos = false;// /^ios/.test(platform);


            var d = JSON.parse(ret);
            if(d.peers.length>0){
                Main.peers = d.peers;
            }
            if(d.groups.length>0){
                Main.groups = d.groups;
            }
            if(d.peers.length>0){
                Main.chs = d.channels;
            }
            if(d.profile && d.profile.nick && d.profile.nick.length>0 &&
                d.config && d.config.hashname && d.config.hashname.length>0
            ){
                Main.profile.nick = d.profile.nick;
                Main.profile.destination = d.config.hashname;
            }


    		Main.profile.os=platform;
    		Main.profile.ver=parseFloat(device.version);
            console.log("Main.profile.ver="+Main.profile.ver);
    		Main.$set("android_ver",Main.profile.ver);
            console.log("Main.android_ver="+Main.android_ver);

    		if(!isIos){
    			//#android
    			msg_notify=new Audio();
    			msg_notify.setAttribute("src","file:///android_asset/www/audio/newmsg.mp3");
    			req2add_notify=new Audio();
    			req2add_notify.setAttribute("src","file:///android_asset/www/audio/req2add.mp3");
    			conf2add_notify=new Audio();
    			conf2add_notify.setAttribute("src","file:///android_asset/www/audio/conf2add.mp3");
    			delivery_notify=new Audio();
    			delivery_notify.setAttribute("src","file:///android_asset/www/audio/delivered.mp3");
    		}
    		else
    		{
    			//#ios
    			msg_notify=new Media("audio/newmsg.caf");
    			req2add_notify=new Media("audio/req2add.caf");
    			conf2add_notify=new Media("audio/conf2add.caf");
    		};
    		Ready();

    		if(!isIos){
    			window.plugins.webintent.onNewIntent(function(url) {
    				try{
    					var mycelyid = url.substr(url.lastIndexOf(".virt/") + 6, url.length);
    				    	//alert("INTENT onNewIntent: " + url+ " "+mycelyid);
    					var hn=mycelyid.trim();
    					if(hn.length<64){
    						alert(localize.get('less64_alert'));
    					}
    					else
    					{
    						if(!CheckNickIsSet()){return;};
    						sendaddreq[hn]=true;
    						Send2Backend("addpeer", {hn:hn, q:{nick:Main.profile.nick, hn:Main.profile.destination, os: Main.profile.os, ver:Main.profile.ver}});
    						alert(localize.get('req_add_sent'));
    					}
    				}
    				catch(err){
    					console.log("wrong intent "+JSON.stringify(url));
    				};
    			});
    		};
        }
	});
	getQueue=jxcore("getQueue");
	setInterval(function(){getQueueF();},200);
    //BrowserPolicy.content.allowOriginForAll('blob:');
};
var getQueue;
function getQueueF(){
	getQueue.call('',function(ret, err){
		try{
			var d=JSON.parse(ret);
			if(d.cmd)	onDataFromBackend(d);
			d=null;
		}catch(err){err=null;};
		ret=null;
		err=null;
	});
};

function dataFromBackend(data){
    try{
        var d=JSON.parse(data);
        if(d.cmd)	onDataFromBackend(d);
    }catch(err){console.log(JSON.stringify(err));};
}

var open;

var delivery_notify;
var newmsg_notify;
var req2add_notify;
var conf2add_notify;
var isJxReady = false;

var channels = [];
var online = false;
var lastonline = -1;
var onlinetid = null;
var thonline = false;
var registeredForPush = false;
var exitByBackButCnt = 0;
var sendaddreq = [];

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		document.addEventListener("backbutton", this.onBackKeyDown, false);
		document.addEventListener('offline', this.onOffline, false);
		document.addEventListener('online', this.onOnline, false);
		document.addEventListener("pause", this.onPause, false);
		document.addEventListener("resume", function() {
			inBG=false;

            myService.enableTimer(180000, function(r){}, function(e){handleError(e)});

			if(Main.chat.dest){
				for(var i in Main.peers)
				{
					if(Main.peers[i].destination==Main.chat.dest){
						Main.peers[i].newmsgcnt=0;
						$(".newmsgcnttop.c"+Main.peers[i].destination).css("display","none");
					};
				};
			};
			if(Main.group.groupid){
				for(var i in Main.groups)
				{
					if(Main.groups[i].groupid==Main.group.groupid){
						Main.groups[i].newmsgcnt=0;
						$(".newgmsgcnttop.g"+Main.groups[i].groupid).css("display","none");
					};
				};
			};
			Update_groupscnt_P();
			Update_chatscnt_P();
            Send2Backend('Resume', {});

		}, false);

    },
    onDeviceReady: function() {
		inBG=false;
		myService = cordova.plugins.MyService;
		//console.log(JSON.stringify(cordova.plugins.MyService));
        MyServiceGo();
		//jxcore.isReady(function(){
			open = cordova.plugins.disusered.open;
			jxcore('app.js').loadMainFile(function (ret, err) {
				if(err) {
				    	alert(err);
				} else {
				    	console.log('Loaded');
					jxcore_ready();
					isJxReady=true;

				}
			});
			localize.start(global_locale);
		//});
		moderator = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
		participants = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
    },
    onOffline: function() {
        console.log('###Received Event: <offline>');
		$("#menubut").attr("src","img/menu_1.png");
		lastonline=online;
		online=false;
		Send2Backend('Offline', {});
    },
    onOnline: function() {
        console.log('###Received Event: <online>');
		$("#menubut").attr("src","img/menu_2.png");
		online=true;
		if(onlinetid)clearTimeout(onlinetid);
		if(isJxReady)Send2BackendOnline();
		else {
			onlinetid=setTimeout(function(){Send2BackendOnline();},5000);
		};
    },
    onPause: function() {
        console.log('###Received Event: <pause>');
		inBG=true;
		dontForceForeground=true;
		setTimeout(function(){dontForceForeground=false;},5000);

        myService.enableTimer(180000, function(r){}, function(e){handleError(e)});
        Send2Backend('Pause', {});
		//updateTotalNewMsgsCnt(false);
    },
    onBackKeyDown: function() {
        console.log('###Received Event: <backkey>');
		navigator.home.home(function(){
		    console.info("Successfully launched home intent");
            myService.enableTimer(180000, function(r){}, function(e){handleError(e)});
		}, function(){
		    console.error("Error launching home intent");
		});
		/*if((totalnewgroups+totalnewchats)>0){
			cordova.plugins.notification.badge.set(totalnewgroups+totalnewchats);
		} else cordova.plugins.notification.badge.clear();
        */

    }
};




function MyServiceGo() {
    console.log("MyServiceGo");
	myService.getStatus(function(r){startService(r)}, function(e){handleError(e)});
};

var triedStartService = false;
function handleError(err){
	console.log("########## "+JSON.stringify(err));
    if(err.ErrorCode == -4 && !triedStartService){
        triedStartService = true;
        startService(err);
    }
}

function startService(data) {
    console.log("startService");
	if (data.ServiceRunning) {
        enableTimer(data);
	} else {
		myService.startService(function(r){enableTimer(r)}, function(e){handleError(e)});
	}
}

function enableTimer(data) {
    myService.enableTimer(3000, function(r){registerForUpdates(r)}, function(e){handleError(e)});
}

function registerForUpdates(data) {
    myService.registerForBootStart(function(r){console.log("registered for bootstart");}, function(e){handleError(e)});
    myService.registerForUpdates(function(r){updateHandler(r)}, function(e){handleError(e)});
}


function updateHandler(data){
	if( data.Configuration.pushid &&
        data.Configuration.pushid.length >10 &&
        thonline &&
        !registeredForPush
    ){
        registerForPush(data.Configuration.pushid);
    }
}

function registerForPush(pushid){
    if(Main.profile.destination){
        console.log("registerForPush");
        registeredForPush = true;
        myService.enableTimer(180000, function(r){registerForUpdates(r)}, function(e){handleError(e)});
        Send2Backend("registerForPush", {pushid: pushid});
    }
};









function Send2BackendOnline(){
	console.log("Send2BackendOnline");
	clearTimeout(onlinetid);
	Send2Backend('Online', {});
};
function Ready(){
	console.log("Ready");
    $('#addContact_P').click(AddNewContact);
    $('#addContactOTC_P').click(AddNewContactOTC);
	if(isIos)$("#check4update").css("display","none");
	platform="android";
    $("#startOverlay").css("display","none");
};


function Send2Backend(cmd, data)
{
	console.log(cmd);
	if(mobile){
		var tmpf=jxcore('asyncCmd').call(JSON.stringify({cmd:cmd,data:data}), function(ret, err){
			if(err)console.log(err);
			ret=null;
	    });
		tmpf=null;
	}
	else
	{
		sendCmd_P(cmd, data);
	};
};

function sendCmd_P(cmd, data){    socket_P.emit("cmd", {cmd:cmd,data:data});};

function NewHashname(){
	Send2Backend("newhashname", {});
	$("#menubut").attr("src","img/menu_2.png");
}

function AddNewContact(){
    var hn=$('#newcontact_hn').val().trim();
    if(hn.length<64){
        alert(localize.get('less64_alert'));
    }
    else
    {
    	if(!CheckNickIsSet()){return;};
    	sendaddreq[hn]=true;
        Send2Backend("addpeer", {hn:hn, q:{nick:Main.profile.nick, hn:Main.profile.destination, os: Main.profile.os, ver:Main.profile.ver}});
        $('#addPeer').modal('hide');
    	alert(localize.get('req_add_sent'));
    }
};

function AddNewContactOTC(){
    var otc=$('#newcontact_otc').val().trim();
    if(otc.length==0 || otc.length>4){
        alert("Wrong OTC");
    }
    else
    {
    	if(!CheckNickIsSet()){return;};
    	Send2Backend("addpeerOTC", {otc: otc, q:{nick:Main.profile.nick, hn:Main.profile.destination, os: "android", ver: Main.profile.ver}});
        $('#addPeerByOTC').modal('hide');

    }
};


function updateProfile()
{
	var p={};
    if (!checkLatinOnly( $('#nick_P').val() )) return;
    p.nick=$('#nick_P').val();
    p.destination=Main.profile.destination;
    p.os="android";//(mobile) ? platform:"pc";
    p.ver=parseFloat(device.version);
    add2dbp(p,"my_profile");
    Main.$set("profile",p);
    for(i in Main.peers){
    	th_SendData2Dest(Main.peers[i].destination,{cmd:"updateMyProfile",data:p});
    };
};

function updateTotalNewMsgsCnt(force){
	return;
	/*var totalnewmsgs=0;
	for(var i in Main.peers) { if(Main.peers[i].newmsgcnt) totalnewmsgs+=Main.peers[i].newmsgcnt; };
	for(var i in Main.groups) { if(Main.groups[i].newmsgcnt) totalnewmsgs+=Main.groups[i].newmsgcnt; };
	if(force)totalnewmsgs=localize.get('you_have');
	if(!isIos){
		cordova.plugins.backgroundMode.configure({
			ticker: totalnewmsgs+localize.get('num_new_msgs'),
			text: totalnewmsgs+localize.get('num_new_msgs')
		});
	};*/
}

function clearTotalNewMsgsCnt(force){
	return;
	/*
	if(!isIos){
		cordova.plugins.backgroundMode.configure({
			title:  "Mycely",
			ticker: "Mycely",
			text:   localize.get('no_new_msgs')
		});
	};*/
}




///////////////////////////////////////////////////////////////////
function CreateNewGroup(){
    if (!checkLatinOnly($("#newcgroupname").val())) return;
    var newgroupname=$("#newcgroupname").val();
    $("#close_newGroup").click();
    var tstr=forge.util.bytesToHex(forge.random.getBytesSync(32));
    var group={
    	_id: tstr,
    	groupid:tstr,
    	name: newgroupname,
    	admin:Main.profile.destination
    };
    Main.groups.push(group);
    AddUserToGroup(tstr,{destination:Main.profile.destination,nick:Main.profile.nick},false);
    SelectGroupForChat(group.groupid);
    AddPeers2Group();
    //add2dbg or th_config?

};

function getGroupById(groupid){
	for(var n in Main.groups){
		if(Main.groups[n].groupid==groupid)	return Main.groups[n];
	};
};

function isAdmin(groupid,hashname){
	var group=getGroupById(groupid);
	if(group && group.admin==hashname)return true;
	return false;
}

function AddPeers2Group(){
	var groupid=Main.group.groupid;
	var group=getGroupById(groupid);
	$('#my-select').multiSelect('destroy');
	$('#my-select').multiSelect({
		selectableHeader: "<div class='custom-header' style='background:#eeeeee;'>"+localize.get('selectable')+"</div>",
		selectionHeader: "<div class='custom-header' style='background:#eeeeee;'>"+localize.get('selected')+"</div>",
		afterSelect: function(values){
			$('#my-select').multiSelect('refresh');
			$(".ui-li-count").css("display","none");
			for(var i in Main.peers){
				var dest=Main.peers[i].destination;
				if(values==dest){
					var exist=false;
					var peers=[];
					for(var m in group.peers){
						var val=group.peers[m].destination;
						if(val==values){
							exist=true;
							break;
						}
					}
					if(!exist){
						var nick=Main.peers[i].nick;
						AddUserToGroup(groupid,{ destination:dest, nick: nick});
						for(var m in group.peers){
							var val=group.peers[m].destination;
							var peer={
								destination: val,
								nick: group.peers[m].nick
							};
							peers.push(peer);
						};
						//we need to wait for concrete ack
						//Broadcast2Group(groupid,"joingroup",{groupid:groupid,name:group.name,admin:group.admin,peers:peers});// need to think)))
						th_SendData2Dest(dest,{	cmd:"joingroup", data:{groupid:groupid,name:group.name,admin:group.admin,peers:peers}});
						//$('#my-select').multiSelect('deselect', values);
						//alert("Invate sent. User will appear in the list if accept.");
					};
				};
			};
		},
		afterDeselect: function(values){
			$('#my-select').multiSelect('refresh');
			$(".ui-li-count").css("display","none");
			if(!isAdmin(groupid,values) && isAdmin(groupid,Main.profile.destination))
			{
				Broadcast2Group(groupid,"leavegroup",{groupid:groupid,peer:values});
				for(var m in group.peers){
					var val=group.peers[m].destination;
					if(val==values)
						group.peers.$remove(group.peers[m]);
				}

			}
		}
	});
	for(var l in Main.peers){
		var val=Main.peers[l].destination;
		var txt=Main.peers[l].nick;
		$('#my-select').multiSelect('addOption', { value: val, text: txt, index: m});
	}
	for(var m in group.peers){
		var val=group.peers[m].destination;
		var txt=group.peers[m].nick;
		$('#my-select').multiSelect('addOption', { value: val, text: txt, index: m});
		$('#my-select').multiSelect('select', [val]);
	}
	$("#open_window_admin_users").click();
}

function AddUserToGroup(groupid,user,inter){
	if(inter || isAdmin(groupid,Main.profile.destination)){
		var group=getGroupById(groupid);
		if(!group.peers)group.peers=[];
		group.peers.push(user);
	}
	else
	{
		alert("You are not Admin of this Group");
	};
};


function Broadcast2Group(groupid,cmd,data){
	var group=getGroupById(groupid);
	for(var m in group.peers){
		var dest=group.peers[m].destination;
		if(dest!=Main.profile.destination)th_SendData2Dest(dest,{	cmd:cmd, data:data});
	}
}
function Broadcast2All(cmd,data){
	for(var m in Main.peers){
		var dest=Main.peers[m].destination;
		if(dest!=Main.profile.destination)th_SendData2Dest(dest,{	cmd:cmd, data:data});
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function th_SendData2Dest(dest,q){
	Send2Backend("THOUT",{destination:dest,q:q});
};

function add2dbp(data, id)
{
	Send2Backend("add2dbp",{data:data,id:id});
};
function add2dbu(data, id)
{
	Send2Backend("add2dbu",{data:data,id:id});
};
function add2dbg(data, id)
{
	Send2Backend("add2dbg",{data:data,id:id});
};
function add2dbch(data, id)
{
	Send2Backend("add2dbch",{data:data,id:id});
};


function checkLatinOnly(str){
    if (/[A-Za-z0-9]/.test(str)) {
        return true;
    }
    else{
        alert(localize.get("only_lat_please"));
        return false;
    }
}

$("#chatmsginput_P").keypress(function (e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13 && !(e.Shift || e.shiftKey) && $("#chatmsginput_P").val().length>0) {
		var curdest=Main.chat.dest;
        if(!online){
            alert(localize.get('no_inet_warn'));
            return false;
        };
		for(var i in Main.peers)
		{
			if(Main.peers[i].destination==curdest){
				Main.peers[i].lts=Date.now();
				if(!Main.peers[i].msgs)Main.peers[i].msgs=[];
				Main.peers[i].msgs.push({nick:Main.profile.nick,destination:Main.profile.destination,txt:$("#chatmsginput_P").val(),sent: Date.now(),ts: Date.now(),dlvrd:false});
				th_SendData2Dest(curdest,{	cmd:"newchatmsg",data: {txt: $("#chatmsginput_P").val(), sent: Date.now() } });
				setTimeout(function(){
					SelectPeerForChat(curdest);
					$("#chatmsginput_P").val('');
				},100);
				break;
			};
		};
		return false;
	}
});
$("#GroupsTabchatmsginput_P").keypress(function (e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13 && !(e.Shift || e.shiftKey) && $("#GroupsTabchatmsginput_P").val().length>0) {
		var curgroupid=Main.group.groupid;
		for(var i in Main.groups)
		{
			if(Main.groups[i].groupid==curgroupid){
				Main.groups[i].lts=Date.now();
				if(!Main.groups[i].msgs)Main.groups[i].msgs=[];
				Main.groups[i].msgs.push({nick:Main.profile.nick,destination:Main.profile.destination,txt:$("#GroupsTabchatmsginput_P").val(),ts: Date.now(),acks:0});
				Main.$set("groups", Main.groups);
				Broadcast2Group(curgroupid,"chatmsg2group",{groupid:curgroupid,txt:$("#GroupsTabchatmsginput_P").val(),nick:Main.profile.nick});
				setTimeout(function(){
					SelectGroupForChat(curgroupid);
					$("#GroupsTabchatmsginput_P").val('');
				},100);
				break;
			}
		};
		return false;
	}
});
$("#ChannelsTabchatmsginput_P").keypress(function (e) {
	var code = (e.keyCode ? e.keyCode : e.which);
	if (code == 13 && !(e.Shift || e.shiftKey) && $("#ChannelsTabchatmsginput_P").val().length>0) {
		var curchid=Main.channel.id;
		for(var i in Main.chs)
		{
			if(Main.chs[i].id==curchid){
				if(!Main.chs[i].msgs)Main.chs[i].msgs=[];

				var mid=Base64.encode($("#ChannelsTabchatmsginput_P").val()+Date.now());
				Main.chs[i].msgs.push({nick:"Me", answerable:0, txt:$("#ChannelsTabchatmsginput_P").val(),ts: Date.now(), mid:mid, my:1,pubkey:Main.profile.publicKey});
				Main.$set("chs", Main.chs);
				Broadcast2All("channelmsg",{id:curchid, name:Main.channel.name, txt:$("#ChannelsTabchatmsginput_P").val(),mid:mid,key:Main.profile.publicKey});
				setTimeout(function(){
					SelectChannel(curchid);
					$("#ChannelsTabchatmsginput_P").val('');
				},100);
				break;
			}
		};
		return false;
	}
});







////////////////////////////////////////////////////////////////////////////////////
function dummy(){};
function AboutPeer(){
	$('#infoModal_P .txt').html($(".curChatNick_P").data("destination"));
    //$('#infoModal_P').foundation('reveal', 'open');
    alert(   $(".curChatNick_P").data("destination")  );

}
function BlockPeer(){
	//ProcessCmdFromUI("ban",{id:$(".curChatNick_P").data("dest")});
	if(confirm(localize.get('sure_ban1')+$(".curChatNick_P").html()+localize.get('sure_ban2'))){
		for(var i in Main.peers){
			if(Main.peers[i].destination==$(".curChatNick_P").data("destination")){
				//ProcessCmdFromUI("delpeer",{id:ChatPeers_P.models[i].attributes._id, destination:ChatPeers_P.models[i].attributes.destination});
				//Send2Backend("ban",{uuid: ChatPeers_P.models[i].attributes.uuid, id: ChatPeers_P.models[i].attributes._id});
				//ChatPeers_P.remove(ChatPeers_P.models[i]);
				break;
			};
		}
	}
}
function DelPeer(){
	if(confirm(localize.get('sure_del_peer1')+Main.chat.nick+localize.get('sure_del_peer2'))){
		for(var i in Main.peers){
			if(Main.peers[i].destination==Main.chat.dest){
				//ProcessCmdFromUI("delpeer",{id:Main.chat.dest, destination:Main.chat.dest});
				Send2Backend("delpeer",{ destination: Main.peers[i].destination});
				Main.peers.$remove(Main.peers[i]);
				$('#homeH').click();
				break;
			};
		}
	}
}

function AboutGroup(){
	alert(Main.group.groupid);
}
function BlockGroup(){
	//ProcessCmdFromUI("ban",{id:$(".curGroupName_P").data("dest")});
    alert($(".curGroupName_P").data("destination"));

	for(var i in Main.groups){
		if(Main.groups[i].groupid==$(".curGroupName_P").data("groupid")){
			//ProcessCmdFromUI("delpeer",{id:ChatPeers_P.models[i].attributes._id, destination:ChatPeers_P.models[i].attributes.destination});
			//Send2Backend("ban",{uuid: ChatPeers_P.models[i].attributes.uuid, id: ChatPeers_P.models[i].attributes._id});
			//ChatPeers_P.remove(ChatPeers_P.models[i]);
			break;
		};
	}
}
function DelGroup(){
    //alert($(".curGroupName_P").data("groupid"));
	if(confirm(localize.get('sure_del_group1')+Main.group.name+localize.get('sure_del_group2'))){
		for(var i in Main.groups){
			if(Main.groups[i].groupid==Main.group.groupid){
				//ProcessCmdFromUI("delpeer",{id:ChatPeers_P.models[i].attributes._id, destination:ChatPeers_P.models[i].attributes.destination});
				Send2Backend("delgroup",{groupid:Main.groups[i].groupid});
				Main.groups.$remove(Main.groups[i]);
				$('#homeH').click();
				break;
			};
		}
	}
}



function AboutChannel(){
	alert(Main.channel.id);
}
function DelChannel(){

	if(confirm(localize.get('sure_del_chan1')+Main.channel.name+localize.get('sure_del_chan2'))){
		for(var i in Main.chs){
			if(Main.chs[i].id==Main.channel.id){
				Send2Backend("delchannel",{id:Main.chs[i].id});
				Main.chs.$remove(Main.chs[i]);
				$('#homeH').click();
				break;
			};
		}
	}
}





function SearchHashtagPeer_P(arg)
{
	console.log("SearchHashtagPeer_P(arg)");
	if(arg.length>0){
		$("#ChatPeers_P-list li > button").fadeOut("fast","linear");
		//console.log(arg);
		if(arg)
		{
			for(var i in Main.peers)
			{
				console.log(arg, Main.peers[i].nick.indexOf(arg), Main.peers[i].nick);
				if(	Main.peers[i].nick.indexOf(arg)>=0 )
				{
					$("#ChatPeers_P-list li > button[data-destination="+Main.peers[i].destination+"]").fadeIn("slow");
				};
			};
		};
	}
	else
	{
		$("#ChatPeers_P-list li > button").fadeIn("fast","linear");
	}
};










////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////


function onDataFromBackend(d){
				var cmd=d.cmd;
				var data=d.data;
                console.log(cmd);
				//if(cmd!="alarmGo2Foreground")console.log("onDataFromBackend: "+cmd+" "+ JSON.stringify(data));
				switch(cmd){
					case 'Incoming':		console.log("Incoming "+data.hashname+" "+data.uuid);
											ProcessCmdFromTH(data.hashname,data,null);
											break;
					case 'log':
											if(defined(data.alert))alert(data.msg);
											else console.log(data);
											break;
                    case 'alarmGo2Foreground':
                        					if(!dontForceForeground)cordova.backgroundapp.show();
                        					break;
                    case 'noInternet':
                                            alert(localize.get('no_inet_warn'));
                                            break;
                    case 'updateProfile':
											//console.log("updateProfile"+JSON.stringify(data.profile));
											Main.$set("profile",data.profile);
											if(!data.profile.os){
												var p={};
												p.nick=data.profile.nick;
												p.destination=data.profile.destination;
												p.os="android";//(mobile) ? platform : "pc";
												p.ver=parseFloat(device.version);
												add2dbp(p,"my_profile");
												Main.$set("profile",p);
                                                console.log("Main.profile.ver="+Main.profile.ver);
                                                console.log("Main.android_ver="+Main.android_ver);
												for(i in Main.peers){
													th_SendData2Dest(Main.peers[i].destination,{cmd:"updateMyProfile",data:p});
												};
											};
											privateKey=pki.privateKeyFromPem(Main.profile.privateKey);
											localizeWto();
											break;
					case 'updateConfig':
											Main.profile.destination=data.config.hashname;
											localize.start(global_locale);
											break;

					case 'peer':
											if(!defined(data.peer.msgs))data.peer.msgs=[];
											var exists=false;
											for(j in Main.peers){
												if(Main.peers[j].destination==data.peer.destination)
												{
													exists=j;
													if(Main.peers[j].msgs.length>0)
														data.peer.msgs=Main.peers[j].msgs;
												};
											};
											if(!exists)	Main.peers.push(data.peer);
											else Main.peers[j]=data.peer;
											Main.peers.sort(SortObjectsByLTS);
											break;
					case 'peers':
                                            console.log("peers "+JSON.stringify(data.data));

											for(i in data.data){
												if(!defined(data.data[i].msgs))data.data[i].msgs=[];
												for(j in Main.peers){
													if(Main.peers[j].destination==data.data[i].destination &&
													Main.peers[j].msgs.length>0
													)
													data.data[i].msgs=Main.peers[j].msgs;
												};
											}
											data.data.sort(SortObjectsByLTS);
											Main.$set("peers",data.data);
                                            console.log("Main.peers "+JSON.stringify(Main.peers));

											setTimeout(function(){$(".newmsgcnttop").css("display","none");},100);
											break;
					case 'groups':

											for(i in data.data){
												if(!defined(data.data[i].msgs))data.data[i].msgs=[];
												for(j in Main.groups){
													if(Main.groups[j].groupid==data.data[i].groupid &&
													Main.groups[j].msgs.length>0
													)
													data.data[i].msgs=Main.groups[j].msgs;
												};
											}
											data.data.sort(SortObjectsByLTS);
											Main.$set("groups",data.data);
											setTimeout(function(){$(".newgmsgcnttop").css("display","none");},100);
											//console.log("JSON.stringify(Main.groups)");
											//console.log(JSON.stringify(Main.groups));
											break;
					case 'channels':

											for(i in data.data){
												if(!defined(data.data[i].msgs))data.data[i].msgs=[];
												for(j in Main.chs){
													if(Main.chs[j].id==data.data[i].id &&
													Main.chs[j].msgs.length>0
													)
													data.data[i].msgs=Main.chs[j].msgs;
												};
											}
											data.data.sort(SortObjectsByLTS);
											Main.$set("chs",data.data);
											break;
					case 'thonline':
											$("#menubut").attr("src","img/menu_3.png");
                                            thonline = true;
                                            online = true;
                                            break;

					case 'keysReady':
											$("#Mycely_btn").css("display","block");
											break;
					case 'installUpdate':
											dontForceForeground=true;
											open('file://'+data.path, opensuccess, openerror);
											break;
					case 'updateAvail':
											if(data.avail){
												if(confirm(localize.get('upd_avail1')+data.changes+localize.get('upd_avail2'))){
													dontForceForeground=true;
													Send2Backend("dwnldUpdate", {});
												};
											}
											else {
                                                if(userChecksUpdate){
                                                    alert(localize.get('no_upd'));
                                                };
                                            };
                                            userChecksUpdate = false;
											break;
					case 'setPass':
											$("#startOverlay").css("display","none");
											$("#newPassLink").click();
											break;
					case 'needPass':
											$("#startOverlay").css("display","none");
											$("#needPassLink").click();
											//Send2Backend("needPass", {data:"skdjfhgg"});
											break;
                    case 'wrongPassword':
                                            alert("Wrong Password! Restart Mycely and try again.");
                                            break;
					case 'needLang':
											$("#startOverlay").css("display","none");
											$("#open_select_lang").click();
											break;
					case 'setLang':
											$("#startOverlay").css("display","none");
											global_locale=data.lang;
											localize.start(global_locale);
											break;

					default: console.log("unknown cmd");console.log(d);
											break;

				};
};

var userChecksUpdate = false;

function CreateNewPass(){
	Send2Backend("newPass", {data:$("#newpass").val()});
	$("#newpass").val("");
	$("#close_newPass").click();
};
function sendPass(){
	Send2Backend("needPass", {data:$("#needpass").val()});
	$("#needpass").val("");
	$("#close_needPass").click();
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// БЛОК ОБРАБОТКИ ВХОДЯЩИХ КОММАНД ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ProcessCmdFromTH(destination,packet,cb)
{
	try{
		packet=packet.js;
		console.log("cmd "+packet.cmd+" from "+destination);

		switch(packet.cmd)
		{
                case "addyou":
						console.log("addyou");
						console.log(packet.data);
						var data = {};
						data.nick=Main.profile.nick;
						data.hn=Main.profile.destination;
						req2add_notify.play();
						//if(mobile && !dontForceForeground)cordova.backgroundapp.show();
						if(confirm(packet.data.nick+localize.get('allow_adding'))){
							//console.log(JSON.stringify(Main.profile));
							//console.log(data.nick)
							//console.log(data.hn)
                            if (!checkLatinOnly( packet.data.nick )) return;
							console.log(packet.data.nick);
							if(defined(packet.data.nick)){
								var peer1={
									id:destination,
									nick: packet.data.nick,
									os:packet.data.os,
									ver:packet.data.ver,
									banned: 0,
									lts:Date.now(),
									type:"peer"
								};
								peer1.destination=destination;
								add2dbu(peer1,destination);
								//Main.peers.push(peer1);
		                        th_SendData2Dest(destination,{cmd:"addingyouanswer",data:data});
							};
						};
						break;
				case "addingyouanswer":
                        if (!checkLatinOnly( packet.data.nick )) return;
						if(defined(sendaddreq[destination]) && sendaddreq[destination] && defined(packet.data.nick)){
       							var peer1={
								id:destination,
								nick: packet.data.nick,
								os:packet.data.os,
								ver:packet.data.ver,
								banned: 0,
								lts:Date.now(),
								type:"peer"
							};
							sendaddreq[destination]=false;
							peer1.destination=packet.data.hn;
							add2dbu(peer1,destination);
							//Main.peers.push(peer1);
							conf2add_notify.play();
						};
						break;
                case 'genOTC':
                            console.log("ProcessCmdFromTH genOTC");
                            console.log(JSON.stringify(packet));
                            alert(localize.get('your_otc')+packet.data.otc);
                            break;
                case 'getIdByOTC':
                        if(!packet.data.error){
                            sendaddreq[packet.data.hn]=true;
                            console.log("ProcessCmdFromTH getIdByOTC");
                            console.log(JSON.stringify(packet));
                            Send2Backend("addpeer", {hn:packet.data.hn, q:{nick:Main.profile.nick, hn:Main.profile.destination, os: "android", ver:Main.profile.ver}});

                            alert(localize.get('req_add_sent'));
                        }
                        else{
                            alert(localize.get("err_try_again"));
                        }
                        break;
                case 'updateMyProfile':
						for(var i in Main.peers)
						{
                            if (!checkLatinOnly( packet.data.nick )) return;
							if(Main.peers[i].destination==destination){
								var peer1={
									id: destination,
									destination: destination,
									nick: packet.data.nick,
									os: packet.data.os,
									ver: packet.data.ver,
									banned: 0,
									lts:Date.now(),
									type:"peer"
								};
								add2dbu(peer1,destination);
								break;
							};
						};
						break;
				case 'newchatmsgack':
						if(mobile){
							if(!isIos){
								//#android
								delivery_notify=new Audio();
								delivery_notify.setAttribute("src","file:///android_asset/www/audio/delivered.mp3");
							}
							else
							{
								//#ios
								delivery_notify=new Media("audio/delivered.caf");
							};
						};
						for(var i in Main.peers)
						{
							if(Main.peers[i].destination==destination){
								Main.peers[i].lts=Date.now();
								for(var j in Main.peers[i].msgs){
									if(Main.peers[i].msgs[j].txt == packet.data.txt &&
                                        Main.peers[i].msgs[j].dlvrd != true
                                    ){
										Main.peers[i].msgs[j].dlvrd = true;
                                        delivery_notify.play();
        								Main.peers.sort(SortObjectsByLTS);
										break;
									};
								};

								break;
							};
						};

						break;
				case 'newchatmsg':
						if(mobile){
							if(!isIos){
								//#android
								msg_notify=new Audio();//new Media("file:///android_asset/www/audio/delivered.mp3");
								msg_notify.setAttribute("src","file:///android_asset/www/audio/newmsg.mp3");
							}
							else
							{
								//#ios
								//msg_notify=new Media("audio/newmsg.caf");
							};

						};
						var current_chat_dest=Main.chat.dest;
						for(var i in Main.peers)
						{
							if(Main.peers[i].destination == destination)
							{
								//if(!dontForceForeground)cordova.backgroundapp.show();
								Main.peers[i].lts=Date.now();
                                if(!Main.peers[i].msgs){
                                    Main.peers[i].msgs = [];
                                }
                                if(Main.peers[i].msgs.length==0)AskPeerForHistory(destination);

                                var withSent = false;
                                if(typeof(packet.data)=='object')withSent = true;

                                var exist = false;
                                for(j=0; j < Main.peers[i].msgs.length; j++ ){
                                    if(withSent){
                                        if( Main.peers[i].msgs[j].txt == packet.data.txt &&
                                            Main.peers[i].msgs[j].sent == packet.data.sent
                                        ){
                                            exist = true;
                                        }
                                    }
                                    else{
                                        if(Main.peers[i].msgs[j].txt == packet.data){
                                            exist = true;
                                        }
                                    }
                                };

                                if(!exist){
                                    if(withSent){
                                        Main.peers[i].msgs.push({nick:Main.peers[i].nick, txt:packet.data.txt, sent: packet.data.sent, ts:Date.now(),destination:destination});
                                    }
                                    else{
                                        Main.peers[i].msgs.push({nick:Main.peers[i].nick, txt:packet.data.txt, sent: Date.now(), ts:Date.now(),destination:destination});
                                    }
                                    //Main.peers[i].msgs.sort(SortObjectsBySentTS);

    								if(!current_chat_dest || current_chat_dest!=destination){
    									if(!Main.peers[i].newmsgcnt)Main.peers[i].newmsgcnt=1;
    									else Main.peers[i].newmsgcnt++;

    									$(".newmsgcnttop").css("display","none");
    									$(".newmsgcnt.c"+Main.peers[i].destination).html(Main.peers[i].newmsgcnt);
    									$(".newmsgcnt.c"+Main.peers[i].destination).css("display","inline-block");
    									$(".newmsgcnttop.c"+Main.peers[i].destination).css("display","block");
    									Update_chatscnt_P();
    								}
    								else
    								{
    									console.log("inBG="+inBG)
    									if(inBG){
    										if(!Main.peers[i].newmsgcnt)Main.peers[i].newmsgcnt=1;
    										else Main.peers[i].newmsgcnt++;
    									}

    									setTimeout(function(){
    										Update_chatscnt_P();
    										updateLayout();
    										var h=0;
    										$.each($("#ChatMsgs_P-list  div"),function(i,v){h+=$(v).height()});
    										$("#ChatMsgs_P-list").scrollTop(h+2000);
    									},300);
    								};
    								Main.peers.sort(SortObjectsByLTS);
    								th_SendData2Dest(destination,{cmd:"newchatmsgack",data:packet.data});
    								msg_notify.play();
                                };

								break;
							};
						};
						//if(mobile && cordova.plugins.backgroundMode.isActive())updateTotalNewMsgsCnt(true);
						break;
				case 'joingroup':
						if(packet.data.admin==destination){
							//if(mobile && !dontForceForeground)cordova.backgroundapp.show();
							if(confirm(localize.get('allow_adding_to_group1')+packet.data.name+localize.get('allow_adding_to_group2'))){
								var peers=packet.data.peers;
									var group=packet.data;
									group.type="group";
									delete(group.peers);

										for(n in peers){
											delete(peers[n]._id);
											delete(peers[n].id);
											delete(peers[n].lastts);
											delete(peers[n].newmsgcnt);
											delete(peers[n].active);
											delete(peers[n].title);
											delete(peers[n].banned);
											delete(peers[n].state);
											delete(peers[n].os);
											delete(peers[n].ver);
										}
										group.peers=peers;
									console.log("add2dbg",group);
									add2dbg(group,group.groupid);

								delete(packet.data.peers);
								/*Main.groups.push(packet.data);
								for(var i in peers){
									AddUserToGroup(packet.data.groupid,{destination:peers[i].destination,nick:peers[i].nick},true);
								}*/
								packet.data.peers=peers;
								th_SendData2Dest(destination,{cmd:"joingroupack",data:packet.data});
								SelectGroupForChat(group.groupid);
							};
						}else console.log("not admin");
						console.log(JSON.stringify(packet));
						break;
				case 'joingroupack': //we need to wait for concrete ack
						if(isAdmin(packet.data.groupid,Main.profile.destination)){
							for(var i in Main.groups)
							{

								if(Main.groups[i].groupid==packet.data.groupid){
									for(var j in Main.peers)
									{
										if(Main.peers[j].destination==destination){
											//AddUserToGroup(packet.data.groupid,{destination:destination,nick:Main.peers[j].nick},false);
											var peers=packet.data.peers;
											var group=packet.data;
											console.log("group",group);
											group.type="group";
											group.peers=[];
											console.log("group",group);
											for(n in peers){
												delete(peers[n]._id);
												delete(peers[n].id);
												delete(peers[n].lastts);
												delete(peers[n].newmsgcnt);
												delete(peers[n].active);
												delete(peers[n].title);
												delete(peers[n].banned);
												delete(peers[n].state);
												delete(peers[n].os);
												delete(peers[n].ver);
											}
											console.log("group",group);
											group.peers=peers;
											console.log("add2dbg",group);
											add2dbg(group,group.groupid);
											Broadcast2Group(group.groupid,"updategroup",group);
										};

									};
									break;
								}
							};
						}else console.log("not admin");
						console.log(JSON.stringify(packet));
						break;
				case 'updategroup':
						if(isAdmin(packet.data.groupid,destination)){
							for(var i in Main.groups)
							{
								if(Main.groups[i].groupid==packet.data.groupid){
									packet.data.type="group";
									var peers=packet.data.peers;
									var group=packet.data;
									delete(group.peers);

										for(n in peers){
											delete(peers[n]._id);
											delete(peers[n].id);
											delete(peers[n].lastts);
											delete(peers[n].newmsgcnt);
											delete(peers[n].active);
											delete(peers[n].title);
											delete(peers[n].banned);
											delete(peers[n].state);
											delete(peers[n].os);
											delete(peers[n].ver);
										}
										group.peers=peers;
									console.log("add2dbg",group);
									add2dbg(group,group.groupid);
									break;
								}
							};
						}else console.log("not admin");
						console.log(JSON.stringify(packet));
						break;
				case 'leavegroup':
						if(isAdmin(packet.data.groupid,destination)){
							for(var i in Main.groups)
							{
								if(Main.groups[i].groupid==packet.data.groupid)
								{
									//if(mobile && !dontForceForeground)cordova.backgroundapp.show();
									Send2Backend("delgroup",{groupid: packet.data.groupid});
									Main.groups.$remove(Main.groups[i]);
									alert(localize.get('removed_from_group')+packet.data.name);
									break;
								}
							};
						};
						console.log(packet);
						break;
				case 'chatmsg2group':
						var current_groupid=Main.group.groupid;
						for(var i in Main.groups)
						{
							if(Main.groups[i].groupid==packet.data.groupid)
							{
								//if(!dontForceForeground)cordova.backgroundapp.show();
								if(!Main.groups[i].msgs)Main.groups[i].msgs=[];
								if(Main.groups[i].msgs.length==0)AskGroupForHistory(Main.groups[i].groupid);
								Main.groups[i].msgs.push({nick:packet.data.nick,txt:packet.data.txt, ts:Date.now(),destination:destination});
								Main.$set("groups", Main.groups);
								if(!current_groupid || current_groupid!=packet.data.groupid){
									if(!Main.groups[i].newmsgcnt)	Main.groups[i].newmsgcnt=1;
									else Main.groups[i].newmsgcnt++;

									$(".newgmsgcnttop").css("display","none");
									$(".newgmsgcnt.g"+Main.groups[i].groupid).html(Main.groups[i].newmsgcnt);
									$(".newgmsgcnt.g"+Main.groups[i].groupid).css("display","inline-block");
									$(".newgmsgcnttop.g"+Main.groups[i].groupid).css("display","block");
									console.log("Main.groups[i].newmsgcnt++="+Main.groups[i].newmsgcnt);
									Update_groupscnt_P();
								}
								else
								{
									if(inBG){
										if(!Main.groups[i].newmsgcnt)	Main.groups[i].newmsgcnt=1;
										else Main.groups[i].newmsgcnt++;
									}
									setTimeout(function(){
										Update_groupscnt_P();
										updateLayout();
										var h=0;
										$.each($("#GroupMsgs_P-list  div"),function(i,v){h+=$(v).height()});
										$("#GroupMsgs_P-list").scrollTop(h+2000);
									},300);
								};
								msg_notify.play();
								th_SendData2Dest(destination,{cmd:"chatmsg2groupack",data:packet.data});
								//if(mobile && cordova.plugins.backgroundMode.isActive())updateTotalNewMsgsCnt(true);
								break;
							};
						};
						break;
				case 'chatmsg2groupack':
						for(var i in Main.groups)
						{
							if(Main.groups[i].groupid==packet.data.groupid){
								Main.groups[i].lts=Date.now();
								for(var j in Main.groups[i].msgs){
									if(Main.groups[i].msgs[j].txt == packet.data.txt){
										Main.groups[i].msgs[j].acks++;
										$("."+Main.groups[i].msgs[j].ts+" div:last").html(Main.groups[i].msgs[j].txt+"<span class='genericon genericon-checkmark'></span>"+Main.groups[i].msgs[j].acks );
										break;
									};
								};
								Main.peers.sort(SortObjectsByLTS);
								break;
							};
						};

						break;
				case 'haveYouSomeGroupHistory':
						var groupid=packet.data.groupid;

						for(var i in Main.groups)
						{
							if(Main.groups[i].groupid==groupid){
								for(j in Main.groups[i].peers){
									if(Main.groups[i].peers[j].destination == destination)
									{
										if(Main.groups[i].msgs.length>0){
											var cntd=0;
											var history=[];
											for(var k=(Main.groups[i].msgs.length-1) ;k>=0; k--){
												if(cntd < maxHistory2Send)cntd++;
												else break;
												history.push(Main.groups[i].msgs[k]);
											}
											history.sort(SortObjectsByTS);
											th_SendData2Dest(destination,{cmd:"someGroupHistory",data:{groupid:groupid,history:history}});
											cntd=null;
											history=null;
											break;
										};
									}
								}
							}
						};
						break;
				case 'someGroupHistory':
						var groupid=packet.data.groupid;
						var history=packet.data.history;
						//console.log(groupid);
						//console.log(JSON.stringify(history));
						for(var i in Main.groups)
						{
							if(Main.groups[i].groupid==groupid){
								for(j in Main.groups[i].peers){
									if(Main.groups[i].peers[j].destination == destination)
									{
										for(var k=0 ;k<history.length; k++){
											history[k].acks=1;//(history[k].nick==Main.profile.nick) ? true:false;
											var exist=false;
											for(l in Main.groups[i].msgs){
												if(Main.groups[i].msgs[l].txt==history[k].txt)exist=true;
											}
											if(!exist)Main.groups[i].msgs.push(history[k]);
										}
										Main.groups[i].msgs.sort(SortObjectsByTS);
										setTimeout(function(){
											Update_groupscnt_P();
											updateLayout();
											var h=0;
											$.each($("#GroupMsgs_P-list  div"),function(i,v){h+=$(v).height()});
											$("#GroupMsgs_P-list").scrollTop(h+2000);
										},300);
										break;
									}
								}
								break;
							}
						}
						break;


				case 'haveYouSomeChatHistory':
						for(var i in Main.peers)
						{
							if(Main.peers[i].destination == destination)
							{
								if(Main.peers[i].msgs.length>0){
									var cntd=0;
									var history=[];
									for(var j=(Main.peers[i].msgs.length-1) ;j>=0; j--){
										if(cntd < maxHistory2Send)cntd++;
										else break;
										history.push(Main.peers[i].msgs[j]);
									}
									history.sort(SortObjectsByTS);
									th_SendData2Dest(destination,{cmd:"someChatHistory",data:history});
									cntd=null;
									history=null;
									break;
								};
							}
						};
						break;

				case 'someChatHistory':
						for(var i in Main.peers)
						{
							if(Main.peers[i].destination == destination)
							{
								for(var j=0 ;j<packet.data.length; j++){
									packet.data[j].dlvrd=(packet.data[j].nick==Main.profile.nick) ? true:false;
									var exist=false;
									for(l in Main.peers[i].msgs){
										if(Main.peers[i].msgs[l].txt==packet.data[j].txt)exist=true;
									}
									if(!exist)Main.peers[i].msgs.push(packet.data[j]);
								}
								Main.peers[i].msgs.sort(SortObjectsByTS);
								setTimeout(function(){
									Update_chatscnt_P();//
									updateLayout();
									var h=0;
									$.each($("#ChatMsgs_P-list  div"),function(i,v){h+=$(v).height()});
									$("#ChatMsgs_P-list").scrollTop(h+2000);
								},300);
								break;
							}
						};
						break;
				case 'calling':
						if(/*Main.android_ver > 4.1 &&*/ !before_or_in_call){
							//if(mobile)cordova.backgroundapp.show();
							document.getElementById('open-room').onclick = function() {
								participants.join({
									sessionid: MODERATOR_SESSION_ID+packet.data,
									userid: MODERATOR_ID+packet.data,
									extra: MODERATOR_EXTRA,
									session: MODERATOR_SESSION
								});
								$('#open-room').css('display','none');
								$('#close-session').css("display","block");

								call_notify.pause();
							};
							SelectPeerForChat(destination);
							for(var i in Main.peers)
							{
								if(Main.peers[i].destination==destination)
								{
									$('#open-room').css('display','block');
									$('#open-room').html(localize.get('calling')/*+Main.peers[i].nick*/);
									$('#close-session').css("display","none");

									call_notify.play();
								};
							};
							$('.call').css('display','none');
							before_or_in_call=true;
							setTimeout(function(){waitForCallAccept();},500);
						}
						else if(true/*Main.android_ver > 4.1*/)
						{
							th_SendData2Dest(destination,{cmd:"busy",data:{}});
						}
						else
						{
							th_SendData2Dest(destination,{cmd:"notcompatible",data:{}});
						}
						break;
				case 'closecall':
						$('#close-session').css("display","none");
						$('#open-room').css('display','none');
						$('.call').css('display','block');
						try{
							moderator.close();
						}catch(er){;};
						try{
							participants.close();
						}catch(er){;};
						call_notify.pause();
						before_or_in_call=false;
						Mycely_remote_attached=false;
						break;
				case 'notcompatible':
						$('#close-session').css("display","none");
						$('#open-room').css('display','none');
						$('.call').css('display','block');
						call_notify.pause();
						try{
							moderator.close();
						}catch(er){;};
						try{
							participants.close();
						}catch(er){;};
						before_or_in_call=false;
						Mycely_remote_attached=false;
						alert(localize.get('notcompatible'));
						break;
				case 'busy':
						$('#close-session').css("display","none");
						$('#open-room').css('display','none');
						$('.call').css('display','block');
						call_notify.pause();
						try{
							moderator.close();
						}catch(er){;};
						try{
							participants.close();
						}catch(er){;};
						before_or_in_call=false;
						Mycely_remote_attached=false;
						alert(localize.get('busy'));
						break;
				case 'channelmsg':
						var current_chid=Main.channel.id;
						var knownch=false;
						var is_answ4me=false;
						var is_encred=true;
						for(var i in Main.chs)
						{
							if(Main.chs[i].id==packet.data.id)
							{
								if(!Main.chs[i].msgs)Main.chs[i].msgs=[];
								for(var k=0; k<Main.chs[i].msgs.length; k++){
									if(Main.chs[i].msgs[k].my==1){
										if(packet.data.mid==Main.chs[i].msgs[k].mid){
											if(!Main.chs[i].answs)Main.chs[i].answs=[];
											var txt="";
											try{
												txt=Base64.decode(privateKey.decrypt(Base64.decode(packet.data.txt), 'RSA-OAEP', {
												  md: forge.md.sha512.create()
												}));
												Main.chs[i].answs.push({ answerable:1, id:Main.chs[i].id, name: Main.chs[i].name,txt:txt, ts:Date.now(),mid:packet.data.mid,my:1,key:packet.data.key, nick:packet.data.key.substr(30,8)});
												is_answ4me=true;
											}catch(er){;};
											break;
										};
									};
								};
								console.log(packet.data);
								try{
									txt=Base64.decode(privateKey.decrypt(Base64.decode(packet.data.txt), 'RSA-OAEP', {
									  md: forge.md.sha512.create()
									}));
								}catch(er){is_encred=false;};

								if(!is_answ4me && !is_encred)	Main.chs[i].msgs.push({answerable:1, id:Main.chs[i].id, name: Main.chs[i].name,txt:packet.data.txt, ts:Date.now(),mid:packet.data.mid,my:0,key:packet.data.key, nick:packet.data.key.substr(30,8)});
								try{Main.chs[i].msgs.sort(SortObjectsByTS);}catch(er){;};
								try{Main.chs[i].answs.sort(SortObjectsByTS);}catch(er){;};
								Main.$set("chs", Main.chs);
								if(!current_chid || current_chid!=packet.data.id){

								}
								else
								{
									setTimeout(function(){
										updateLayout();
										var h=0;
										$.each($("#ChannelMsgs_P-list  div"),function(i,v){h+=$(v).height()});
										$("#ChannelMsgs_P-list").scrollTop(h+2000);
									},300);
								};
								//msg_notify.play();
								break;
							};
						};
						for(var i=0; i<known_channels.length; i++){
							if(known_channels[i].id==packet.data.id) knownch=true;
						}
						if(!knownch && known_channels.length>100){
							var ch={id:packet.data.id, name:packet.data.name, msgs:[]};
							known_channels.push(ch);
							$input.typeahead({source:known_channels, autoSelect: true});
						};
						break;
                case 'noInternet':
                        alert(localize.get('no_inet_warn'));
                        break;

				default:
						console.log(packet);
						break;
		};
		//cb();
	}
	catch(error){
		console.log("catched error in ProcessCmdFromTH "+error.toString());
	};
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// КОНЕЦ БЛОКА ОБРАБОТКИ ВХОДЯЩИХ КОММАНД ////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function ScanQR(){
	if(mobile){
	    dontForceForeground=true;
	    cordova.plugins.barcodeScanner.scan(
		function (result) {
		    if(!result.cancelled)
		    {
		        //alert("Barcode type is: " + result.format);
		        //alert("Decoded text is: " + result.text);
		        if(result.format=="QR_CODE"){
				if(!CheckNickIsSet()){return;};
				try{
					var data=JSON.parse(result.text);
					var hn=data.destination;
					var peer={
						cid:"",
						nick: data.nick,
						//uuid: data.uuid,
						destination: hn,
						banned: 0,
						state:0,
						title:"",
						lts:Date.now(),
						type:"known"
					};
					sendaddreq[hn]=true;
					Send2Backend("addpeer", {hn:hn, q:{nick:Main.profile.nick, hn:Main.profile.destination, os: Main.profile.os, ver:Main.profile.ver}});
					alert(localize.get('req_add_sent'));
					dontForceForeground=false;
				}catch(err){
					alert(localize.get('err_try_again'));
					dontForceForeground=false;
				};
		        }
			else
			{
		            alert(localize.get('err_try_again'));
				dontForceForeground=false;
		        }
		    }
		    else
		    {
		        //alert("You have cancelled scan");
			dontForceForeground=false;
		    }
		},
		function (error) {
		    alert(localize.get('err_try_again'));
			dontForceForeground=false;
		}
	    );
	};
}

function GenerateQR(){
	if(!CheckNickIsSet()){return;};
    $("#qrcode").html("");
    new QRCode(document.getElementById("qrcode"), JSON.stringify({nick:Main.profile.nick,destination:Main.profile.destination, os: Main.profile.os, ver:Main.profile.ver}));
    $("#qrtabH").click();
}

function GenerateQRForApk(){
	$("#qrcode").html("");
    new QRCode(document.getElementById("qrcode"), "https://github.com/Zeipt/Mycely/raw/master/platforms/android/build/outputs/apk/android-armv7-debug.apk");
    $("#qrtabH").click();
}

function GenOTC(){
    Send2Backend("GenOTC", {});

}

function CheckNickIsSet(){
	if(Main.profile.nick.length==0){
		alert(localize.get('nick_first'));
		return false;
	};
	return true;
};




function opensuccess() {
  	console.log('Success');
	//dontForceForeground=false;
};
function openerror(code) {
	if (code === 1) {
	    console.log('No file handler found');
	} else {
	    console.log('Undefined error');
	}
	dontForceForeground=false;
};


window.onerror = function(a, b, c) {
  console.log(a + ", " + b + ", " + c);
}





function SelectLang(){
	var l=$("#selectedLang").val();
	Send2Backend("selectedLang", {lang:l});
	global_locale=l;
	localize.start(l);
};
var localize={
	locals: {
		'en': {
			lang: 'Language',
			search: 'Search...',
			logs: 'Logs',
			exit: 'Exit',
			new_id: 'New ID',
			email: "Email",
			conf_new_id: 'Sure? You will be totally unreachable with old ID. You will lost all your contacts. Remove all DBs?',
			id_not_ready: "Your ID is not ready. Wait.",
			about: "About",
			about_ver: "Info can change with new versions...<br>Current version: "+currentver,
			check_upd: "Check for update",
			about_txt: "<b>Mycely</b> is P2P network (peer-to-peer). All communications are encrypted. All history exists only in mem for now. Later it will be saveable in encrypted db-files in User's defined place.",
			github: "GitHub repo",
			mail_to_dev: "Contact developer",
			req_to_add: "Ask peer to add:",
			peer_id_ph: "Peer's ID",
			send: "Send",
			define_pass: "Define your passphrase:",
			enter_pass: "Enter your passphrase:",
			add_to_group: "Add peer to group:",
			new_group: "Create new group:",
			pass_ph: "really long passphrase",
			your_pass_ph: "your passphrase",
			group_name_ph: "new group's name",
			set: "Set",
			continue: "Continue",
			close: "Close",
			create: "Create",
			new_msgs: "New messages:",
			send_your_id: "Send your ID<br> to friend",
			send_id1: 'Below is the LINK and ID of ',
			send_id2: '. Click this <a href=\'http://mycelyid.virt/',
			send_id3: '\' >LINK</a> or make things manually as described below. Long tap on it, copy this ID and paste it into the Add Contact form in Mycely. If you can\'t select all of the ID symbols at once, go to settings of your E-Mail app and change font size to minimal and rotate your device to horizontal... ',
			send_id4: 'Someone sent you ID',
			gen_qr: 'Gen your<br>QR-code',
			add_by_id: "Add friend<br>with ID",
			scan_qr: "Scan<br>QR-code",
			your_nick: "Your nickname:",
			your_nick_here: "Enter your nick here",
			no_new_msgs: "No new messages",
			num_new_msgs: " new messages",
			you_have: "You have ",
			less64_alert: "Length of this ID is less than 64. Check it and try again.",
			req_add_sent: "Request to add sent. After user confirms he/she will appear in your contacts list.",
			selectable: "Selectable users",
			selected: "Selected users",
			sure_ban1: "Sure? Ban ",
			sure_ban2: "?",
			sure_del_peer1: "Sure? Remove ",
			sure_del_peer2: " from contacts?",
			sure_del_group1: "Sure? Remove ",
			sure_del_group2: "?",
            upd_avail1: "Update available. New in this version: ",
            upd_avail2: ". If you confirm it will be downloaded and installed now.",
			no_upd: "No update available.",
			allow_adding: " requests to add you. Allow?",
			allow_adding_to_group1: "You are invited to group ",
			allow_adding_to_group2: ". Join?",
			removed_from_group: "You are removed from group ",
			err_try_again: "Error. Try again.",
			nick_first: "Error. You have to set your nickname first. Set it and try again.",
			new_dgb: "New DBg",
			conf_new_dgb: "Sure? Remove DBg?",
			support_in_ua: "In Ukraine you can support us directly: 4149&nbsp;4978&nbsp;1186&nbsp;9983",
			calling: "Call from ",
			stop_call: "Hang Up",
			busy: "Line is busy. Try later.",
			notcompatible: "Other side hasn't such feature.",
			new_channel: "Create or subscribe new channel:",
			group_channel_ph: "channels's name",

            add_by_otc: "Add</br>by OTC",
            gen_otc: "Gen OTC",
            peer_otc_ph: "Peer's OTC",
            your_otc: "Tell your friend this your One-Time-Code: ",
            only_lat_please: "Only latin symbols and digits, please.",
            no_inet_warn: "No Internet connection.",
            gen_qr_apk: "Gen QR-code for Mycely APK"
		},
		'de': {
            lang: 'Sprache',
			search: 'Suche...',
            logs: 'logs',
            exit: 'Ausgang',
            new_id: 'Neue ID',
            email: "Email",
            conf_new_id: 'Sicher? Sie werden unter laufender ID nicht errichbar, alle Kontakten in Anwendung werden gelöscht. Sollen Daten gelöscht werden?',
            id_not_ready: "Ihre ID ist noch nicht generiert. Bitte warten Sie.",
            about: "Über das Projekt",
            about_ver: "Informationen können je nach Version geändert werden. <br>Laufende Version: "+currentver,
            check_upd: "Updates überprüfen",
            about_txt: "<b>Mycely</b> Es ist P2P Netzwerk (от англ. peer-to-peer). Alle Kommunikationen werden unter Peers verschlüsselt. Ganzer Verlauf ist jetzt nur auf der Festplatte gespeichert. Später werden sie in der verschlüsselten Datenbank gespeichert, die der Benutzer auswählt.",
            github: "Quelldateien auf GitHub",
            mail_to_dev: "Dem Entwickler schreiben",
            req_to_add: "Kontakt hinzufügen:",
            peer_id_ph: "Peer-ID",
            send: "Senden",
            define_pass: "Passwort auswählen:",
            enter_pass: "Passwort eingeben:",
            add_to_group: "Einen Peer in die Gruppe hinzufügen:",
            new_group: "Neue Gruppe erstellen:",
            pass_ph: "Langes Passwort",
            your_pass_ph: "Ihr Passwort",
            group_name_ph: "Gruppenname",
            set: "Installieren",
            continue: "Fortsetzen",
            close: "Schließen",
            create: "Erstellen",
            new_msgs: "Neue Nachrichten:",
            send_your_id: "ID<br>Bekannten senden",
            send_id1: 'Unten gibt`s den Link und die ID ', //Unten gibt`s den Link und die ID von.
            send_id2: '. Klicken Sie auf <a href=\'http://mycelyid.virt/', //Klicken Sie auf den Link oder fügen Sie in die Kontaktliste manuell hinzu…
            send_id3: '\' >LINK</a> oder fügen Sie in die Kontaktliste manuell hinzu, wie folgt. Klicken Sie dauerhaft auf die ID am Ende dieses Textes, kopieren Sie die ID und geben Sie sie in die Eingabeform von ID in Mycely ein. Falls Sie die ganze ID nicht kopieren können, überprüfen Sie die Einstellungen Ihrer Anwendung, verkleinern Sie die Schrift und versuchen Sie Ihr Gerät waagrecht zu drehen…',
            send_id4: 'Jeman hat Ihnen seine Mycely-ID gesendet',
            gen_qr: 'Generieren Sie<br>Ihre QR-Code',
            add_by_id: "Nach ID hinzufügen<br>",
            scan_qr: "QR Code scannen<br>",
            your_nick: "Ihr Spitzname:",
            your_nick_here: "Geben Sie Ihr Spitzname ein",
            no_new_msgs: "Keine neue Nachrichten",
            num_new_msgs: " neue Nachrichten", //Sie haben 5 neue Nachrichten
            you_have: "Sie haben ",     //Sie haben 5 neue Nachrihten
            less64_alert: "ID-Länge ist weniger als 64. Überprüfen Sie und versuchen Sie noch ein Mal.",
            req_add_sent: "Kontaktanfrage ist gesendet. Nach der Bestätigung erscheint der Benutzer in Ihrer Kontaktliste.",
            selectable: "Außer Gruppe", //Zum Hinzufügen verfügbar
            selected: "In der Gruppe",     //schon in der Gruppe
            sure_ban1: "Sicher? Sperren ", //Sicher? Soll … gesperrt werden?
            sure_ban2: "?", //Sicher? Soll … gesperrt werden?
            sure_del_peer1: "Sicher? Entfernen ", //Entfernen? Soll … aus der Kontaktliste entfernt werden?
            sure_del_peer2: " aus der Kontaktliste?", //Sicher? Soll … aus der Kontaktliste entfernt werden?
            sure_del_group1: "Sicher? Entfernen ", //Sicher? Soll (Gruppe)entfernt werden?
            sure_del_group2: "?",  // Sicher? Soll(Gruppe)entfernt werden?
            upd_avail1: "Update ist verfügbar: ",
            upd_avail2: ". Es kann geladen und installiet werden.",
            no_upd: "Keine Updates",
            allow_adding: "Sie haben eine Kontaktanfrage von… Bestätigen?", // Sie haben eine Kontaktanfrage von...
            allow_adding_to_group1: "Sie wurde in die Gruppe eingeladen ", // Sie wurden in die Gruppe… eingeladen. Anschließen?
            allow_adding_to_group2: ". Anschließen?",       // Sie wurden in die Gruppe… eingeladen. Anschließen?
            removed_from_group: "Sie wurden aus der Gruppe entfernt",
            err_try_again: "Fehler. Versuchen Sie noch ein Mal.",
            nick_first: "Fehler. Zuerst soll Ihr Spitzname eingegeben werden. Geben Sie ihn ein und versuchen Sie noch ein Mal.",
			new_dgb: "New DBg",
			conf_new_dgb: "Уверены? Удалить DBg?",
			support_in_ua: "In der Ukraine können Sie uns direkt unterstützen: 4149&nbsp;4978&nbsp;1186&nbsp;9983",
			calling: "Anrufe ",
			stop_call: "aufhängen",
			busy: "Leitung ist besetzt. Versuche es später.",
			notcompatible: "Die Funktion wird von dem angerufenen Teilnehmer unterstützten.",
			new_channel: "Create or subscribe new channel:",
			group_channel_ph: "channels's name",

            add_by_otc: "Add by OTC",
            gen_otc: "Gen OTC",
            peer_otc_ph: "Peer's OTC",
            your_otc: "Tell your friend this your One-Time-Code: ",
            only_lat_please: "Only latin symbols and digits, please.",
            no_inet_warn: "No Internet connection.",
            gen_qr_apk: "Gen QR-code for Mycely APK"
		},
		'ru': {
			lang: 'Язык',
			search: 'Поиск...',
			logs: 'Логи',
			exit: 'Выход',
			new_id: 'Нов.ID',
			email: "Email",
			conf_new_id: 'Уверены? Вы станете недоступны по текущему ID, будут удалены все контакты в приложении. Удалить базы данных?',
			id_not_ready: "Ваш ID еще не сгенерирован. Ждите.",
			about: "О проекте",
			about_ver: "Информация может меняться от версии к версии. <br>Текущая версия: "+currentver,
			check_upd: "Проверить обновления",
			about_txt: "<b>Mycely</b> это P2P сеть (от англ. peer-to-peer). Все коммуникации между пирами шифруются. Вся история сейчас хранится только в оперативной памяти. Позже, она будет сохранятся в шифрованных базах там, где решит Пользователь.",
			github: "Исходники на GitHub",
			mail_to_dev: "Написать разработчику",
			req_to_add: "Добавить в контакты:",
			peer_id_ph: "ID пира",
			send: "Отправить",
			define_pass: "Задайте Ваш пароль:",
			enter_pass: "Введите Ваш пароль:",
			add_to_group: "Добавить пира в группу:",
			new_group: "Создать новую группу:",
			pass_ph: "длинный пароль",
			your_pass_ph: "Ваш пароль",
			group_name_ph: "название группы",
			set: "Установить",
			continue: "Продолжить",
			close: "Закрыть",
			create: "Создать",
			new_msgs: "Новых сообщ.:",
			send_your_id: "Отправьте ID<br>знакомым",
			send_id1: 'Ниже есть ссылка и ID ', //Ниже есть ссылка и ID такого-то.
			send_id2: '. Кликните <a href=\'http://mycelyid.virt/', //Кликните ссылку или добавьте в контакты вручную...
			send_id3: '\' >LINK</a> или добавьте в контакты вручную как описано ниже. Долгое нажатие на ID в конце этого текста, скопируйте ID и вставьте в форму добавления по ID в Mycely. Если Вы не можете скопировать весь ID целиком, загляните в настройки Вашего приложения, уменьшите размер шрифта и попробуйте повернуть Ваше устройство горизонтально... ',
			send_id4: 'Кто-то отправил Вам свой Mycely ID',
			gen_qr: 'Сгенерируйте<br>Ваш QR-код',
			add_by_id: "Добавить<br>по ID",
			scan_qr: "Сканировать<br>QR-код",
			your_nick: "Ваш псевдоним:",
			your_nick_here: "введите Ваш псевдоним",
			no_new_msgs: "Нет новых сообщений",
			num_new_msgs: " новых сообщений", //У Вас 5 новых сообщений
			you_have: "У Вас ",	//У Вас 5 новых сообщений
			less64_alert: "Длина введенного ID менее 64. Проверьте и повторите попытку.",
			req_add_sent: "Запрос на добавление отправлен. После подтверждения Пользователь появится в Вашем списке контактов.",
			selectable: "Вне группы", //доступные для добавления в группу
			selected: "В группе",     //уже в группе
			sure_ban1: "Уверены? Баним ", //Уверены? Баним такого-то?
			sure_ban2: "?", //Уверены? Баним такого-то?
			sure_del_peer1: "Уверены? Удалить ", //Уверены? Удалить такого-то из контаков?
			sure_del_peer2: " из контаков?", //Уверены? Удалить такого-то из контаков?
			sure_del_group1: "Уверены? Удалить ", //Уверены? Удалить (такую-то группу)?
			sure_del_group2: "?",  //Уверены? Удалить (такую-то группу)?
            upd_avail1: "Доступно обновление. Новое в версии: ",
            upd_avail2: ". Если желаете, оно будет скачано и установлено.",
			no_upd: "Нет обновлений.",
			allow_adding: " запрашивает разрешение добавить Вас в контакты. Разрешаем?", //Некто запрашивает...
			allow_adding_to_group1: "Вы приглашены в группу ", //Вы приглашены в группу такую-то. Присоединиться?
			allow_adding_to_group2: ". Присоединиться?",       //Вы приглашены в группу такую-то. Присоединиться?
			removed_from_group: "Вы удалены из группы ",
			err_try_again: "Что-то пошло не так. Попробуйте еще раз.",
			nick_first: "Ошибка. Первым делом нужно задать Ваш псевдоним. Сделайте это и попробуйте снова.",
			new_dgb: "New DBg",
			conf_new_dgb: "Уверены? Удалить DBg?",
			support_in_ua: "В Украине вы можете поддержать проект пожертвованием: 4149&nbsp;4978&nbsp;1186&nbsp;9983",
			calling: "Вам звонит ",
			stop_call: "Завершить",
			busy: "Занято. Попробуйте позже.",
			notcompatible: "Телефон Вызываемого не поддерживает эту функцию.",
			new_channel: "Create or subscribe new channel:",
			group_channel_ph: "channels's name",

            add_by_otc: "Добавить<br>по OTC",
            gen_otc: "Сгенерировать<br>OTC",
            peer_otc_ph: "OTC Пира",
            your_otc: "Сообщите другу Ваш OTC: ",
            only_lat_please: "Только латинские буквы и цифры, пожалуйста.",
            no_inet_warn: "Нет подключения к Интернету.",
            gen_qr_apk: "QR-code на Mycely APK"

		},
		'ua': {
                        lang: 'Мова',
			search: 'Пошук...',
            logs: 'Логи',
            exit: 'Вихід',
            new_id: 'Нов.ID',
            email: "Email",
            conf_new_id: 'Впевнені? Ви будете недоступні за даним ID, усі контакти з додатку буде видалено. Видалити бази даних?',
            id_not_ready: "Ваш ID ще не згенеровано. Очікуйте.",
            about: "Про проект",
            about_ver: "Інформація може змінюватися залежно від версії. <br>Поточна версія: "+currentver,
            check_upd: "Перевірити оновлення",
            about_txt: "<b>Mycely</b> це P2P мережа (от англ. peer-to-peer). Усі комунікації між пірами шифруються. Вся історія зараз зберігається лише в оперативній пам’яті. Пізніше вона зберігатиметься у шифрованих базах там, де вирішить Користувач.",
            github: "Оригінали на GitHub",
            mail_to_dev: "Написати розробнику",
            req_to_add: "Додати в контакти:",
            peer_id_ph: "ID піра",
            send: "Відправити",
            define_pass: "Задайте Ваш пароль:",
            enter_pass: "Введіть Ваш пароль:",
            add_to_group: "Додати піра в групу:",
            new_group: "Створити нову групу:",
            pass_ph: "довгий пароль",
            your_pass_ph: "Ваш пароль",
            group_name_ph: "назва групи",
            set: "Встановити",
            continue: "Продовжити",
            close: "Закрити",
            create: "Створити",
            new_msgs: "Нових повідомлень:",
            send_your_id: "Відправте ID<br>знайомим",
            send_id1: 'Нижче є посилання та ID ', //Нижче є посилання та ID такого-то.
            send_id2: '. Клікніть <a href=\'http://mycelyid.virt/', //Клікніть посилання або додайте в контакти вручну...
            send_id3: '\' >LINK</a> або додайте в контакти вручну як описано нижче. Тривале натискання на ID в кінці даного тексту, скопіюйте ID і вставте у форму додавання за ID в Mycely. Якщо Вам не вдається скопіювати увесь ID, зазирніть у налаштування Вашого додатку, зменште розмір шрифту й спробуйте повернути Ваш пристрій горизонтально... ',
            send_id4: 'Хтось відправив Вам свій Mycely ID',
            gen_qr: 'Згенеруйте<br>Ваш QR-код',
            add_by_id: "Додати<br>за ID",
            scan_qr: "Сканувати<br>QR-код",
            your_nick: "Ваш псевдонім:",
            your_nick_here: "введіть Ваш псевдонім",
            no_new_msgs: "Немає нових повідомлень",
            num_new_msgs: " нових повідомлень", //У Вас 5 нових повідомлень
            you_have: "У Вас ",     //У Вас 5 нових повідомлень
            less64_alert: "Довжина введеного ID менша ніж 64. Перевірте й спробуйте знову.",
            req_add_sent: "Запит на додавання відправлено. Після підтвердження Користувач з’явиться у Вашому переліку контактів.",
            selectable: "Поза групою", //доступні для додавання в групу
            selected: "В групі",     //уже в групі
            sure_ban1: "Впевнені? Банимо ", //Впевнені? Банимо такого-то?
            sure_ban2: "?", //Впевнені? Банимо такого-то?
            sure_del_peer1: "Впевнені? Видалити ", //Впевнені? Видалити такого-то з контактів?
            sure_del_peer2: " з контактів?", //Впевнені? Видалити такого-то з контактів?
            sure_del_group1: "Впевнені? Видалити ", //Впевнені? Видалити (таку-то групу)?
            sure_del_group2: "?",  //Впевнені? Видалити (таку-то групу)?
            upd_avail: "Доступне оновлення: ",
            upd_avail: ". Якщо бажаєте, воно буде завантажене й встановлене.",
            no_upd: "Немає оновлень.",
            allow_adding: " просить дозволу додати Вас в контакти. Дозволяємо?", //Дехто просить дозволу...
            allow_adding_to_group1: "Вас запросили в групу ", //Вас запросили в групу туку-то. Приєднатися?
            allow_adding_to_group2: ". Приєднатися?",       //Вас запросили в групу таку-то. Приєднатися?
            removed_from_group: "Вас видалено з групи",
            err_try_again: "Щось пішло не так. Спробуйте ще раз.",
            nick_first: "Помилка. Перш за все необхідно задати Ваш псевдонім. Зробіть це і спробуйте знову.",
			new_dgb: "New DBg",
			conf_new_dgb: "Впевнені? Видалити DBg?",
			support_in_ua: "В Україні ви можете підтримати нас безпосередньо: 4149&nbsp;4978&nbsp;1186&nbsp;9983",
			calling: "Телефонує ",
			stop_call: "Завершити",
			busy: "Зайнято. Спробуйте пізніше.",
			notcompatible: "Телефон піра не підтримує цю функцію.",
			new_channel: "Create or subscribe new channel:",
			group_channel_ph: "Назва каналу",

            add_by_otc: "Додати<br>по OTC",
            gen_otc: "Згенеруйте<br>OTC",
            peer_otc_ph: "OTC Пиру",
            your_otc: "Сообщите другу Ваш OTC: ",
            only_lat_please: "Тільки латинські букви і цифри, будь ласка.",
            no_inet_warn: "Немає підключення до Інтернету.",
            gen_qr_apk: "QR-код для Mycely APK"
		}
	},
	/* DO NOT CHANGE UNDER THIS */
	lang: '',
	start: function(lang){
		lang=lang.toLowerCase();
		this.lang=lang;
		var langs=this.locals;
		$('.lang').each(function(){
			var txt=$(this).data('lang');
			var to=$(this).data('lang-to');
			if(txt!==''&&typeof langs[lang]!=='undefined'&&typeof langs[lang][txt]!=='undefined'){
				switch(to){
					case 'text':
						$(this).text(langs[lang][txt]);
						break;
					case 'placeholder':
					case 'alt':
					case 'title':
						$(this).attr(to, langs[lang][txt]);
						break;
					case 'html':
					default:
						$(this).html(langs[lang][txt]);
						break;
				}
			}
		});
	},
	get: function(code){
		var langs=this.locals, lang=this.lang;
		if(code!==''&&typeof langs[lang]!=='undefined'&&typeof langs[lang][code]!=='undefined'){
			return langs[lang][code];
		}else{
			return '';
		}
	}
};

var global_locale="";
try{
    	var userLang = navigator.language || navigator.userLanguage;
    	var gloc=userLang.split("-");
    	global_locale=(typeof(gloc)=="object") ? gloc[0] : gloc ;
	if(global_locale!="ru" && global_locale!="en" && global_locale!="de" && global_locale!="ua")global_locale="en";
}catch(err){
    global_locale="en";
}

function localizeWto(){
	setTimeout(function(){localize.start(global_locale);},500);
}



function AskPeerForHistory(dest){
	th_SendData2Dest(dest,{cmd:"haveYouSomeChatHistory",data:{}});
};

function AskGroupForHistory(groupid){
	Broadcast2Group(groupid,"haveYouSomeGroupHistory",{groupid:groupid})
};









var call_notify,req2add_notify,msg_notify,delivery_notify,conf2add_notify;
var moderator;// = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
var participants;// = new RTCMultiConnection(MODERATOR_CHANNEL_ID);

if(true/*mobile*/){
	app.initialize();
	var call_notify = new Audio();
	call_notify.setAttribute("src","file:///android_asset/www/audio/call.wav");
	call_notify.setAttribute("loop","loop");
	//var call_notify = new Media("file:///android_asset/www/audio/call.wav");

}
/*else{
	window.addEventListener("load", Ready);

	req2add_notify = new Audio();
	req2add_notify.setAttribute("src","audio/req2add.mp3");
	msg_notify = new Audio();
	msg_notify.setAttribute("src","audio/newmsg.mp3");
	delivery_notify = new Audio();
	delivery_notify.setAttribute("src","audio/delivered.mp3");
	conf2add_notify = new Audio();
	conf2add_notify.setAttribute("src","audio/conf2add.mp3");
	call_notify = new Audio();
	call_notify.setAttribute("src","file:///android_asset/www/audio/call.wav");
	call_notify.setAttribute("loop","loop");

	//var moderator = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
	//var participants = new RTCMultiConnection(MODERATOR_CHANNEL_ID);
}*/

function handleOpenURL(url) {
     // TODO: parse the url, and do something
	alert(url);
}




var Main=new Vue({

  el: '#Main',

  data: {
		android_ver:0,
		profile:{nick:"",destination:"",os:"",ver:0,publicKey:"",privateKey:""},
		peers:[],
		groups:[],
		chs:[],
		chat:{nick:"",dest:"",msgs:[]},
		group:{name:"",groupid:"",peers:[],msgs:[]},
		channel:{name:"",id:"",msgs:[],answs:[]}
	},

  // Anything within the ready function will run when the application loads
  ready: function() {},

  // Methods we want to use in our application are registered here
  methods: {}
});








var totalnewchats=0;
function Update_chatscnt_P(){
	var dest=Main.chat.dest;
	totalnewchats=0;
	for(var i in Main.peers)
	{
		//console.log(dest+" "+Main.peers[i].destination+" "+Main.peers[i].newmsgcnt);

		if(	(dest && Main.peers[i].destination!=dest && Main.peers[i].newmsgcnt>0) ||
			(!dest && Main.peers[i].newmsgcnt>0) ||
			(inBG && Main.peers[i].newmsgcnt>0)

		){
			totalnewchats++;
		};
	};
	$(".chatscnt_P").html(totalnewchats);
	if(mobile){
		/*if(inBG && (totalnewgroups+totalnewchats)>0){
			cordova.plugins.notification.badge.set(totalnewgroups+totalnewchats);
		} else cordova.plugins.notification.badge.clear();*/
	};
};

function SelectPeerForChat(dest){
	unselectAllRooms()
	Main.chat.dest=dest;
	for(var i in Main.peers)
	{
		if(Main.peers[i].destination==dest){
			Main.chat.msgs=Main.peers[i].msgs;
			Main.chat.nick=Main.peers[i].nick;
			Main.chat.android_ver=Main.peers[i].ver;
            console.log("Main.profile.ver="+Main.profile.ver);
            console.log("Main.android_ver="+Main.android_ver);

            console.log("Main.chat.android_ver "+Main.chat.android_ver);
            console.log("Main.peers[i].ver "+Main.peers[i].ver);
            console.log(parseFloat(device.version));
			Main.peers[i].newmsgcnt=0;
			$(".newmsgcnttop.c"+Main.peers[i].destination).css("display","none");
            if(!Main.peers[i].msgs) Main.peers[i].msgs = [];
			if(Main.peers[i].msgs.length==0)AskPeerForHistory(dest);
		};
	};
	$('#ChatsTabH').click();
	$("#chatmsginput_P").css("display","block");
	Update_chatscnt_P();
	setTimeout(function(){
		updateLayout();
		var h=0;
		$.each($("#ChatMsgs_P-list  div"),function(i,v){h+=$(v).height()});
		$("#ChatMsgs_P-list").scrollTop(h+2000);
	},300);
};
var totalnewgroups=0;
function Update_groupscnt_P(){
	var groupid=Main.group.groupid;
	totalnewgroups=0;
	for(var i in Main.groups)
	{
		if(	(groupid && Main.groups[i].groupid!=groupid && Main.groups[i].newmsgcnt>0) ||
			(!groupid && Main.groups[i].newmsgcnt>0) ||
			(inBG && Main.groups[i].newmsgcnt>0)

		){
			totalnewgroups++;
		};
	};
	$(".groupscnt_P").html(totalnewgroups);
	if(mobile){
		/*if(inBG && (totalnewgroups+totalnewchats)>0){
			cordova.plugins.notification.badge.set(totalnewgroups+totalnewchats);
		} else cordova.plugins.notification.badge.clear();*/
	};
};

function SelectGroupForChat(groupid){
	unselectAllRooms()
	Main.group.groupid=groupid;
	for(var i in Main.groups)
	{
		if(Main.groups[i].groupid==groupid){
			if(!Main.groups[i].msgs)Main.groups[i].msgs=[];
			Main.group.msgs=Main.groups[i].msgs;
			Main.group.name=Main.groups[i].name;
			Main.group.peers=Main.groups[i].peers;
			Main.groups[i].newmsgcnt=0;
			$(".newgmsgcnttop.g"+Main.groups[i].groupid).css("display","none");
			if(Main.groups[i].msgs.length==0)AskGroupForHistory(groupid);
		};
	};
	$('#GroupsTabH').click();
	$("#GroupsTabchatmsginput_P").css("display","block");
	Update_groupscnt_P();
	setTimeout(function(){
		updateLayout();
		var h=0;
		$.each($("#GroupMsgs_P-list  div"),function(i,v){h+=$(v).height()});
		$("#GroupMsgs_P-list").scrollTop(h+2000);
	},300);
};

function SelectChannel(id){
	unselectAllRooms();
	Main.channel.id=id;
	for(var i in Main.chs)
	{
		if(Main.chs[i].id==id){
			if(!Main.chs[i].msgs)Main.chs[i].msgs=[];
			if(!Main.chs[i].answs)Main.chs[i].answs=[];
			Main.channel.msgs=Main.chs[i].msgs;
			Main.channel.answs=Main.chs[i].answs;
			Main.channel.name=Main.chs[i].name;
		};
	};
	$('#ChannelsTabH').click();
	$("#ChannelsTabchatmsginput_P").css("display","block");
	setTimeout(function(){
		updateLayout();
		var h=0;
		$.each($("#ChannelMsgs_P-list  div"),function(i,v){h+=$(v).height()});
		$("#ChannelMsgs_P-list").scrollTop(h+2000);
		$.each($("#MyChannelMsgs_P-list  div"),function(i,v){h+=$(v).height()});
		$("#MyChannelMsgs_P-list").scrollTop(h+2000);
	},300);
};

function unselectAllRooms(){
	Main.group.groupid=null;
	Main.chat.dest=null;
	Main.channel.id=null;
	$("#ChannelsTabchatmsginput_P,#GroupsTabchatmsginput_P,#chatmsginput_P").css("display","none");
}














var MODERATOR_CHANNEL_ID = 'WebShadow'; // channel-id
var MODERATOR_SESSION_ID = 'WSroomid';    // room-id
var MODERATOR_ID         = 'WSuid';    // user-id
var MODERATOR_SESSION    = {         // media-type
    audio: true/*,
    video: true*/
};
var MODERATOR_EXTRA      = {};       // empty extra-data



var before_or_in_call=false;
var Mycely_remote_attached=false;
function closecall(){
		$('#close-session').css("display","none");
		$('#open-room').css('display','none');
		$('.call').css('display','block');
		call_notify.pause();
		try{
			moderator.close();
		}catch(er){;};
		try{
			participants.close();
		}catch(er){;};
		th_SendData2Dest(Main.chat.dest,{cmd:"closecall",data:{}});
		before_or_in_call=false;
		Mycely_remote_attached=false;
};
function call(){
		$('#close-session').css("display","block");
		$('.call').css('display','none');
		var x=Main.profile.destination+(Math.round(Math.random() * 60535) + 5000).toString();
		moderator.session = MODERATOR_SESSION;
		moderator.userid = MODERATOR_ID+x;
		moderator.extra = MODERATOR_EXTRA;
		moderator.open({
			dontTransmit: true,
			sessionid: MODERATOR_SESSION_ID+x
		});
		th_SendData2Dest(Main.chat.dest,{cmd:"calling",data:x});
		before_or_in_call=true;
		setTimeout(function(){waitForCallAccept();},500);
		call_notify.play();
}
function waitForCallAccept(){
	if(Mycely_remote_attached){
		call_notify.pause();
	}
	else{
		if(before_or_in_call)setTimeout(function(){waitForCallAccept();},100);
	}
}











var $input = $('#newchannelname');
var known_channels=[];
$input.typeahead({source:known_channels, autoSelect: true});
function AddChannel(){
	var current = $input.typeahead("getActive");
	var ch={
	 	id:null,
	 	name:null,
		msgs:[]
	};
	if (current) {
		// Some item from your model is active!
		if (current.name.toLowerCase() == $input.val().toLowerCase()) {
		    	// This means the exact match is found. Use toLowerCase() if you want case insensitive match.
			console.log("new channel "+$input.val()+" "+current.id);
			ch.id=current.id;
			ch.name=current.name;

		} else {
		    	// This means it is only a partial match, you can either add a new item
		    	// or take the active if you don't want new items
			console.log("new channel^1 "+$input.val());
			ch.name=$input.val();
			var md1 = forge.md.md5.create();
			md1.update(ch.name);
			ch.id=md1.digest().toHex();

		}
	} else {
		// Nothing is active so it is a new value (or maybe empty value)
		console.log("new channel^2 "+$input.val());
		ch.name=$input.val();
		var md1 = forge.md.md5.create();
		md1.update(ch.name);
		ch.id=md1.digest().toHex();

	}
	console.log("new channel^3 "+ch.id+" "+ch.name);


	$("#close_newChannel").click();
	var arr=Main.chs;
	arr.push(ch);
	known_channels.push(ch);
	$input.typeahead({source:known_channels, autoSelect: true});
	Main.$set("chs",arr);
	add2dbch(ch, ch.id)
};

var context_msg={};
