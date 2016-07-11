var isWin = false;// /^win/.test(process.platform);
var isMac = false;// /^darwin/.test(process.platform);
var isIos = false;// /^ios/.test(process.platform);
var isAndroid = true;// /^android/.test(process.platform);
var mobile=true;// (isIos || isAndroid)?true:false;
//console.log=function(){;};

var th_SIO=19876;
undelivered=[];
queue=[];
var online=false;
var need_new_pass=false;
var need_your_pass=false;
var acsblPath="";
var th_PACKETS=[];
var th_packetnum=[];
th_packetnum[0]=[];
var GCHANNELNAME="GENERALCHANNELROOM";
var th_config;
var th_profile;
var th_clients=[];
var th_dl_port=19999;
var gth;




var iterations = 32;
var iv;
var hexiv;
var salt;
var salthex;
var waitingpass=false;
var cipher;
var decipher
var cfg={};
var dbpfn;
var dbufn;
var dbgfn;
var dbdfn;
var dbchfn;
var need2gen=false;
var my_pub_key;
var my_priv_key;
var pub;
var priv;
var pubpem;
var privpem;

var dbp;
var dbu;
var dbg;
var dbd;
var dbch;
var peers=[];
var groups=[];
var channels=[];
tid0=null;
tid1=null;

var thinited=false;
var dbsinited=false;
var update_path="";

var seeds=[{
    "paths": [
	{
	   "type": "ipv4",
	    "ip": "193.34.144.23",
	    "port": 42424
	}
    ],
    "parts": {
	"3a": "1df78fba497cfaf8eb1c2cf7b005208579193ea16385060329b9d769010e1827",
	"2a": "2625ebe91ff10ce6c7c3b1bfd9b6a80825669f14d5d90b36608bdcf91bf07b85",
	"1a": "5b5857763c9a5496fc5b2640d28a09ff5a3eef44de5813d39bfc27f1c4d114a6"
    },
    "keys": {
	"3a": "3NH1B5EgZoWi0qUqHhdqJgLyHpqEbmGEzddzyrqzQF4=",
	"2a": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAiXMD0A1cEYETDRzIgBe4xwu40qYreFW3EKZEpXfbKZCrbhuolyAgXf9+bWD+Hi7MeNdBGpuu5LBJqAEKRAZTynj7fYO36RDJmRfBIgKvYmabVtIPC6V0/olL+mTCJTlaI0es2xHSZmSUzOjE4na5nrZygpUbTcWv9Y8DtAC5KPOMYbMRL2wthalG/qDu9/MrbaD+/vvxUFvBRm0XjGQNM+fueyJlQ1Qsr0+720x/P9r87Q4vLcaZqRUykjlK0zlTOPazi3N86Jv1WEdUPSV5SY27ZP6lYdM1VnB92NArSyhou8Yi4gbqpEcK5FD5mH5/n71+PSYmgRewrlXLIqrOLwIDAQAB",
	"1a": "J0ss+FS+nXVrVoLcaj2zPXjqRpUxsKN5lDT0Ps4AeuCxc6cJUCofAA=="
    }
}];

var MainPushServer = "9b9c8311fdc1cf613f08ffd028f18db2ae8492e39f9abf3702667e676ad69b8b";

var hasbgtask=false;

if(mobile){
	var 	fs = require('fs'),
		path = require('path'),
		//net = require('net'),
		//zlib = require('zlib'),
		util = require('util'),
		os = require('os'),
		forge = require('node-forge')/*({disableNativeCode: true})*/,
		//clog = require('./utilities').log,
		Datastore = require('nedb'),
		stream = require('stream'),
		Duplex = stream.Duplex || require('readable-stream').Duplex,
		rawgithub = require('rawgithub'),
		rimraf = require("rimraf"),
		httpreq = require('httpreq'),
		//fsex = require('fs-extra'),
		th = require('telehash');

	//var shared = jxcore.store.shared;

	function Send2UI(cmd, data){
		queue.push(	JSON.stringify({cmd:cmd,data:data})	);
        //Mobile('dataFromBackend').call( JSON.stringify({cmd:cmd,data:data}) );
	};

    Mobile('asyncCmd').registerAsync(function(data, callback){
		//console.log("asyncCmd");
		//console.log(data);
		var message=JSON.parse(data);
		callback(null);
		ProcessCmdFromUI(message.cmd,message.data);
		return;
	});
    /*Mobile('syncCmd').registerSync(function(data, callback){
        //console.log("asyncCmd");
        //console.log(data);
        var message=JSON.parse(data);
        callback(null);
        ProcessCmdFromUI(message.cmd,message.data);
        return;
    });*/

	Mobile('getQueue').registerAsync(function(message, callback) {
		var buffer={};
		if(queue){
			buffer = queue.shift();
		};
		callback(buffer);
		message=null;
		callback=null;
		return;
	});

	Mobile('asyncPing').registerAsync(function(message, callback){

        var data = {
                peers: peers,
                groups: groups,
                channels: channels,
                profile: th_profile,
                config: th_config
        };
		callback(JSON.stringify(data));console.log(message+" is called!!!");console.log(process.platform);
		return;
	});
}

//////////////////////////////////дуплекс//////////////////////////////////
function DUPSTREAM(options) {
  // allow use without new operator
  if (!(this instanceof DUPSTREAM)) {
    return new DUPSTREAM(options);
  }
  Duplex.call(this, options); // init
  this.readArr = []; // array to read
}
util.inherits(DUPSTREAM, Duplex);

DUPSTREAM.prototype._read = function readBytes(n) {
  var self = this;
  var chunk;
    while (this.readArr.length) {
        chunk = this.readArr.shift();
        if (!self.push(chunk)) {
          break; // false from push, stop reading
        }
    }
  if(!chunk)self.push(null);
};
// for write stream just ouptut to stdout
DUPSTREAM.prototype._write =
  function (chunk, enc, cb) {
    this.readArr.push(chunk);
    cb();
};

var base64 = exports = {
    encode: function (unencoded) {
    return new Buffer(unencoded).toString('base64');
    },
    decode: function (encoded) {
    //return new Buffer(encoded, 'base64');
    return new Buffer(encoded, 'base64').toString('Binary');
    }
};


//var rsa = forge.pki.rsa;
//var pki = forge.pki;





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



function defined(obj){
	return (typeof(obj)!='undefined');
};
function isInClients(hashname){
	return defined(th_clients[hashname]) && defined(th_clients[hashname].chan);
};
function exit(){/*jxcore.store.shared.set("THREAD_KEEP_ALIVE", 0);*/process.kill(0);};

function add2dbp(data, typearg)
{
	//console.log("add2dbp",typearg,data);
	if(typeof(typearg)!="undefined")
	{
		dbp.update({type:typearg}, {$set:data},{upsert:true},function (err, numReplaced) {
			if(err){
				console.log(typearg+' update error', err);
				console.log(typearg,data);
				Send2UI("log",{msg:err,type:1});
			}
			else
			{
				console.log('update ok');
				if(typearg=="my_config"){Send2UI("updateConfig",{config:data});if(hasbgtask)shared.set("th_config", JSON.stringify(data));};
				if(typearg=="my_profile"){Send2UI("updateProfile",{profile:data});if(hasbgtask)shared.set("th_profile", JSON.stringify(data));}
				dbp.persistence.compactDatafile(function(){;});
			};
		});
	}
	else console.log("add2dbp needs type");
};

function add2dbu(data, id)
{
	//console.log("add2dbu",data);
	if(typeof(id)=="undefined")
	{
		console.log('no id');
		dbu.insert(data, function(err, response) {
			if(err){Send2UI("log",{msg:err,type:1});}
			else{
				setTimeout(function(){th_updateAllPeersLists();},500);
				dbu.persistence.compactDatafile(function(){;});
			};
		});
	}
	else
	{
		id=data.id;
		console.log("th thid", id);
		dbu.find({id:id}, function (err, docs) {
			if(err){
				console.log(err);
			}
			else
			{
				//console.log(docs);
				if(docs.length>0){
					peer=JSON.parse(JSON.stringify(docs))[0];
					dbu.update({_id:peer._id}, {$set:data},{upsert:true},function(err, response) {
						if(err){
							console.log('th_put error');
							Send2UI("log",{msg:err,type:1});
						}
						else
						{
							setTimeout(function(){th_updateAllPeersLists();},500);
							dbu.persistence.compactDatafile(function(){;});
						};
					});
				}
				else
				{
					dbu.insert(data, function(err, response) {
							if(err){Send2UI("log",{msg:err,type:1});}
							else{
								setTimeout(function(){th_updateAllPeersLists();},500);
								dbu.persistence.compactDatafile(function(){;});
							};
					});
				};
			};
		});
	};
};

function add2dbg(data, id)
{
	console.log("add2dbg",data);
	if(typeof(id)=="undefined")
	{
		console.log('no id');
		delete(data._id);
		delete(data.id);
		data.type="group";
		dbg.insert(data, function(err, response) {
			if(err){Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
			else{
				setTimeout(function(){th_updateAllGroupsLists(true);},500);
				dbg.persistence.compactDatafile(function(){;});
			};
		});
	}
	else
	{
		id=data.groupid;
		console.log("id",id);
		delete(data._id);
		delete(data.id);
		dbg.find({groupid:data.groupid}, function (err, docs) {
			if(err){
				console.log(err);
			}
			else
			{
				console.log(docs.length,docs);
				if(docs.length>0){
					group=JSON.parse(JSON.stringify(docs))[0];
					dbg.update({_id:group._id}, {$set:data},{upsert:true},function(err, response) {
						if(err){
							console.log('th_put error');
							Send2UI("log",{alert:true,msg:JSON.stringify(err)});
						}
						else
						{
							setTimeout(function(){th_updateAllGroupsLists(true);},500);
							dbg.persistence.compactDatafile(function(){;});
						};
					});
				}
				else
				{
					dbg.insert(data, function(err, response) {
						if(err){Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
						else{
							setTimeout(function(){th_updateAllGroupsLists(true);},500);
							dbg.persistence.compactDatafile(function(){});
						};
					});
				};
				docs=null;
			};
		});
	};
};
function add2dbch(data, id)
{
	console.log("add2dbch",data);
	if(typeof(id)=="undefined")
	{
		console.log('no id');
		data.type="channel";
		dbch.insert(data, function(err, response) {
			if(err){Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
			else{
				setTimeout(function(){th_updateAllChannelsLists(true);},500);
				dbch.persistence.compactDatafile(function(){;});
			};
		});
	}
	else
	{
		id=data.id;
		data.chid=id;
		delete(data.id);
		console.log("id",id);
		dbch.find({chid:id}, function (err, docs) {
			if(err){
				console.log(err);
			}
			else
			{
				console.log(docs.length,docs);
				if(docs.length>0){
					ch=JSON.parse(JSON.stringify(docs))[0];
					dbch.update({id:ch.id}, {$set:data},{upsert:true},function(err, response) {
						if(err){
							console.log('th_put error');
							Send2UI("log",{alert:true,msg:JSON.stringify(err)});
						}
						else
						{
							setTimeout(function(){th_updateAllChannelsLists(true);},500);
							dbch.persistence.compactDatafile(function(){;});
						};
					});
				}
				else
				{
					dbch.insert(data, function(err, response) {
						if(err){Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
						else{
							setTimeout(function(){th_updateAllChannelsLists(true);},500);
							dbch.persistence.compactDatafile(function(){});
						};
					});
				};
				docs=null;
			};
		});
	};
};

function add2Undelivered(data)
{
    undelivered.push(data);
    return;
    var msg = JSON.stringify(data);
	var d = JSON.parse(msg);
    var dest = d.destination;
    undelivered.push({destination: dest, data: msg, notified: false});
    /*
    dbd.insert({destination: dest, data: msg}, function(err, response) {
		if(err){Send2UI("log",{msg:err,type:1});}
		else{
			setTimeout(function(){th_updateAllUndelivered();},500);
		};
	});
    */
};

function delUndeliveredMsgs(destination){
	/*dbd.remove({ destination: destination }, { multi: true }, function (err, numRemoved) {
		if(err){
			console.log(type+' remove error', err);
			console.log(id,data);
		}
		else
		{
			console.log('remove ok '+numRemoved);
			dbd.persistence.compactDatafile(function(){;});
		};
	});*/
};

/*
function th_SendData2Dest(hashname,q){
	var args={};
	args.hashname=hashname;
	args.q=q;
	//console.log("sendToThread",ththreadId,args);
	var sendqueue=shared.get("queueToSend");
	if(!sendqueue){
		var sq=new Array;
		sq.push(args);
		shared.set("queueToSend", JSON.stringify(sq));
	}
	else{
		var sq=JSON.parse(sendqueue);
		sq.push(args);
		shared.set("queueToSend", JSON.stringify(sq));
	};
};
*/
function Broadcast2All(cmd,data){
	for(var m in peers){
		var dest=peers[m].destination;
		if(dest!=th_config.hashname)th_SendData2Dest(dest,{	cmd:cmd, data:data});
	};
};
function broadcast2AllExcept(cmd,data,except){
	for(var m in peers){
		var dest=peers[m].destination;
		if(dest!=th_config.hashname && dest!=except){
			th_SendData2Dest(dest,{	cmd:cmd, data:data});
			console.log("sent");
		};
	};
};

function initdbs(){
	console.log("init dbs");
	dbu.loadDatabase(function (err) {
		if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
		else
			dbu.find({type:"peer"}, function (err, docs) {
				if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
				else
				{
					//console.log(docs);
					peers=JSON.parse(JSON.stringify(docs));
					Send2UI("peers",{data:JSON.parse(JSON.stringify(docs))});
					//Send2UI("peers",{data:peers});
					//if(hasbgtask)shared.set("peers", JSON.stringify(peers));
					CheckProfileAndConfig();
				};
				docs=null;
				/*dbd.loadDatabase(function (err) {
					if(err){console.log(err);if(fs.existsSync(dbdfn)) fs.unlinkSync(dbdfn);	Send2UI("log",{alert:true,msg:"Undelivered DB error. It is removed and will be recreated at next start."});}
					else th_updateAllUndelivered();
					dbch.loadDatabase(function (err) {
						if(err){console.log(err);if(fs.existsSync(dbchfn)) fs.unlinkSync(dbchfn);	Send2UI("log",{alert:true,msg:"Cannels DB error. It is removed and will be recreated at next start."});}
						else th_updateAllChannelsLists();

					});
				});*/
			});
	});
	dbg.loadDatabase(function (err) {
		if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
		else
			dbg.find({type:"group"}, function (err, docs) {
				if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
				else
				{
					console.log(docs);
					groups=JSON.parse(JSON.stringify(docs));
					//Send2UI("groups",{data:groups});
					Send2UI("groups",{data:JSON.parse(JSON.stringify(docs))});
					if(hasbgtask)shared.set("groups", JSON.stringify(groups));
				};
				docs=null;
			});
	});

}

function CheckProfileAndConfig(){
	console.log("CheckProfileAndConfig");
	dbp.loadDatabase(function (err) {
		if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
		else
		{
			dbp.findOne({ type: 'my_profile' }, function (err, doc) {
				if(err){
					console.log(err);
					Send2UI("log",{alert:true,msg:JSON.stringify(err)});
				}
				else
				{
					if(doc){
						th_profile=JSON.parse(JSON.stringify(doc));
						//console.log("th_profile: "+JSON.stringify(th_profile));
						dbp.findOne({ type: 'my_config' }, function (err, doc) {
							if(err){
								console.log(err);
								if(hasbgtask){
									thtaskparams.thact="init";
									thtaskparams.thconfig=th_config;
									thtaskparams.thprofile=th_profile;
									jxcore.tasks.addTask(method, thtaskparams);
								}
								else initth();
							}
							else
							{
								if(doc && doc.hashname){
									//console.log("my_config0");
									th_config=JSON.parse(JSON.stringify(doc));
									th_profile.destination=th_config.hashname;
									Send2UI("updateProfile",{profile:th_profile});
									dbsinited=true;
									if(hasbgtask){
										thtaskparams.thact="start";
										thtaskparams.thconfig=th_config;
										thtaskparams.thprofile=th_profile;
										jxcore.tasks.addTask(method, thtaskparams);
									}
									else StartTH();
								}
								else
								{
									console.log("my_config1");
									if(hasbgtask){
										thtaskparams.thact="init";
										thtaskparams.thconfig=th_config;
										thtaskparams.thprofile=th_profile;
										jxcore.tasks.addTask(method, thtaskparams);
									}
									else initth();
								}
							};
						});
					}
					else
					{
						console.log("my_config2");
						if(hasbgtask){
							thtaskparams.thact="init";
							thtaskparams.thconfig=th_config;
							thtaskparams.thprofile=th_profile;
							jxcore.tasks.addTask(method, thtaskparams);
						}
						else initth();
					}
				};
				doc=null;
			});
		};
	});
};

function th_updateAllPeersLists(){
	dbu.find({type:"peer"}, function (err, docs) {
			if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
			else
			{
				//console.log(docs);
				peers=JSON.parse(JSON.stringify(docs));
				//Send2UI("peers",{data:peers});
				Send2UI("peers",{data:JSON.parse(JSON.stringify(docs))});
				if(hasbgtask)shared.set("peers", JSON.stringify(peers));

			};
		docs=null;
	});

};
function th_updateAllGroupsLists(){
	dbg.find({type:"group"}, function (err, docs) {
			if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
			else
			{
				//console.log(docs);
				groups=JSON.parse(JSON.stringify(docs));
				//Send2UI("groups",{data:groups});
				Send2UI("groups",{data:JSON.parse(JSON.stringify(docs))});
				if(hasbgtask)shared.set("groups", JSON.stringify(groups));
			};
		docs=null;
	});

};
function th_updateAllChannelsLists(){
	dbch.find({}, function (err, docs) {
			if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
			else
			{
				//console.log(docs);
				channels=JSON.parse(JSON.stringify(docs));
				for(var i=0; i<channels.length; i++){
					channels[i].id=channels[i].chid;
					delete(channels[i].chid);
				};
				//Send2UI("groups",{data:groups});
				Send2UI("channels",{data:channels});
				if(hasbgtask)shared.set("channels", JSON.stringify(channels));
			};
		docs=null;
	});

};
function th_updateAllUndelivered(){
    return;
	/*dbd.find({}, function (err, docs) {
			if(err){console.log(err);Send2UI("log",{alert:true,msg:JSON.stringify(err)});}
			else
			{
				//console.log(docs);
                undelivered = [];
                for(var i in docs){
                    undelivered.push(JSON.parse(docs[i].data));
                }
				//undelivered=JSON.parse(JSON.stringify(docs));

                if(hasbgtask)shared.set("undelivered", JSON.stringify(undelivered));

			};
		docs=null;
	});
    */
};
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////// БЛОК ОБРАБОТКИ ВХОДЯЩИХ КОММАНД ///////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function ProcessCmdFromUI(cmd,data){
	//console.log(cmd,data);
	switch(cmd){
		case 'THOUT':
								if(data.q.cmd=="newchatmsg"){
									for(i in peers){
										if(peers[i].destination==data.destination) {
											add2Undelivered({
												destination: peers[i].destination,
												cmd: data.q.cmd,
												data: data.q.data,
                                                notified: false
											});
											break;
										};
									};
								};
								//console.log(data.q.data);
								th_SendData2Dest(data.destination,data.q);
								if(data.q.cmd=="channelmsg") {
									var retr=false;
									for(i in retranslated){
										if(retranslated[i]==data.q.data)retr=true;
										break;
									};
									if(!retr)retranslated.push(data.q.data);
								};
								break;
		case 'addpeer':
								awaiting_adding_answer_from=data.hn;
								th_SendData2Dest(data.hn,{cmd:"addyou",data:data.q});
								break;
        case 'addpeerOTC':
        						awaiting_adding_answer_from=data.otc;
                                th_SendData2Dest(MainPushServer,{cmd:"getIdByOTC",data:{otc:data.otc}});

        						break;
        case 'GenOTC':
                                th_SendData2Dest(MainPushServer,{cmd:"genOTC",data:{}});

                                break;

		case 'add2dbp':
								add2dbp(data.data,data.id);
								break;
		case 'add2dbu':
								add2dbu(data.data,data.id);
								break;
		case 'add2dbg':
								add2dbg(data.data,data.id);
								break;
		case 'add2dbch':
								add2dbch(data.data,data.id);
								break;
		case 'newhashname':
								initth();
								break;
        case 'registerForPush':
                                console.log("registering for pushes "+JSON.stringify(data));
                                th_SendData2Dest(MainPushServer,{cmd:"register",data:{pushid:data.pushid}});
                                break;
		case 'updateProfile':
								th_profile.nick=data.nick;
								var req={};
								req.nick=data.nick;
								req.destination=th_config.hashname;
								add2dbp(req,"my_profile");
								break;
		case "delpeer":
								console.log(data.id);
								dbu.remove({ destination: data.destination }, {}, function (err, numRemoved) {
								  if(err){
										console.log(type+' remove error', err);
										console.log(id,data);
									}
									else
									{
										console.log('remove ok');
										dbu.persistence.compactDatafile();
										th_updateAllPeersLists();
									};
								});


								break;
		case "delgroup":
								console.log(data.groupid);
								dbg.remove({ groupid: data.groupid }, {}, function (err, numRemoved) {
								  if(err){
								        console.log(type+' remove error', err);
								        console.log(data.groupid);
								        //Send2UI("log",{msg:err,type:1});
								    }
								    else
								    {
								        console.log('remove ok');
								        dbg.persistence.compactDatafile();
                                        th_updateAllGroupsLists();
								    };
								});
								break;
		case "delchannel":
								console.log(data.id);
								dbch.remove({ chid: data.id }, {}, function (err, numRemoved) {
								  if(err){
								        console.log(type+' remove error', err);
								        console.log(data.id);
								        //Send2UI("log",{msg:err,type:1});
								    }
								    else
								    {
								        console.log('remove ok');
								        dbch.persistence.compactDatafile();
                                        th_updateAllChannelsLists();
								    };
								});
								break;
		case 'sendchatmsg2group':
								Broadcast2Group(data.groupid,cmd,data);
								break;
        case 'console.log':
                                console.log(data);
								break;
		case 'poll':
								//Send2UI("peers",{data:peers});
								//Send2UI("path",{data:process.cwd()});//
								//Send2UI("updateProfile",{profile:th_profile});
								break;
		case 'Exit':
								console.log("########################### Exit ####################################");
								exit();
								break;
		case 'GoBackground':
								console.log("########################### GoBackground ############################");
								break;
		case 'Online':
								console.log("########################### Online ##################################");
								online=true;
								if(dbsinited && thinited)Send2UI("thonline",{msg:"online..."});//shared.set("online", "true");
								break;
		case 'Offline':
								console.log("########################### Offline ####################################");
								online=false;
								//thinited=false;
								break;
		case 'checkUpdate':
								checkUpdate();
								break;
		case 'dwnldUpdate':
								console.log("downloading");
								try{
									httpreq.get("https://github.com/Zeipt/Mycely/raw/master/platforms/android/build/outputs/apk/android-armv7-debug.apk", {binary: true}, function (err, res){
										if (err){
											console.log(err);
										}
										else
										{
											fs.writeFile(update_path, res.body, function (err) {
											    	if(err)
													console.log("error writing file");
												else
												{
													console.log("downloaded");
													Send2UI("installUpdate",{path:update_path});
												}
											});
										}
									});
									/*httpreq.download(
									    "https://github.com/Zeipt/Mycely/raw/master/platforms/android/build/outputs/apk/android-armv7-debug.apk",
									    path.resolve("/storage/sdcard0/update.apk"))
									, function (err, progress){
									    if (err) {console.log(err);}
									    console.log(JSON.stringify(progress));
									}, function (err, res){
										if (err) {console.log(err);return;}
										console.log("downloaded");
										Send2UI("installUpdate",{path:path.resolve("/storage/sdcard0/update.apk")});
										//clearInterval(timervar);
								    	};*/
								}
								catch(err){console.log(err);};
								break;
		case 'needPass':
								need_your_pass=false;
								var dbkey = forge.pkcs5.pbkdf2(data.data, salt, iterations, 32);
								cipher = forge.cipher.createCipher('AES-CBC', dbkey);
								decipher = forge.cipher.createDecipher('AES-CBC', dbkey);
								try{
									dbp=new Datastore({ filename: dbpfn ,afterSerialization:encdb, beforeDeserialization:decdb});
									dbu=new Datastore({ filename: dbufn ,afterSerialization:encdb, beforeDeserialization:decdb});
									dbg=new Datastore({ filename: dbgfn ,afterSerialization:encdb, beforeDeserialization:decdb});
									dbch=new Datastore({ filename: dbchfn ,afterSerialization:encdb, beforeDeserialization:decdb});
								}catch(err){Send2UI("log",{alert:true,msg:JSON.stringify(err)});};
								try{
									dbd=new Datastore({ filename: dbdfn ,afterSerialization:encdb, beforeDeserialization:decdb});
								}catch(err){if(fs.existsSync(dbdfn)) fs.unlinkSync(dbdfn);};
								initdbs();
								break;
		case 'newPass':
								if(waitingpass){
									waitingpass=false;
									var dbkey = forge.pkcs5.pbkdf2(data.data, salt, iterations, 32);
									cipher = forge.cipher.createCipher('AES-CBC', dbkey);
									decipher = forge.cipher.createDecipher('AES-CBC', dbkey);
									try{
										dbp=new Datastore({ filename: dbpfn ,afterSerialization:encdb, beforeDeserialization:decdb});
										dbu=new Datastore({ filename: dbufn ,afterSerialization:encdb, beforeDeserialization:decdb});
										dbg=new Datastore({ filename: dbgfn ,afterSerialization:encdb, beforeDeserialization:decdb});
										dbch=new Datastore({ filename: dbchfn ,afterSerialization:encdb, beforeDeserialization:decdb});
									}catch(err){Send2UI("log",{alert:true,msg:JSON.stringify(err)});};
									try{
										dbd=new Datastore({ filename: dbdfn ,afterSerialization:encdb, beforeDeserialization:decdb});
									}catch(err){if(fs.existsSync(dbdfn)) fs.unlinkSync(dbdfn);};
									initdbs();
									need_new_pass=false;
								};
								break;
		case 'deldbs':
								if(fs.existsSync(dbpfn)) fs.unlinkSync(dbpfn);
								if(fs.existsSync(dbufn)) fs.unlinkSync(dbufn);
								if(fs.existsSync(dbgfn)) fs.unlinkSync(dbgfn);
								if(fs.existsSync(dbdfn)) fs.unlinkSync(dbdfn);
								if(fs.existsSync(dbchfn)) fs.unlinkSync(dbchfn);
								if(fs.existsSync(path.resolve(acsblPath, "./PDX_FF/cfg.json"))) fs.unlinkSync(path.resolve(acsblPath, "./PDX_FF/cfg.json"));
								exit();
								break;
		case 'deldbg':
								if(fs.existsSync(dbgfn)) fs.unlinkSync(dbgfn);
								exit();
								break;
		case 'deldbch':
								if(fs.existsSync(dbchfn)) fs.unlinkSync(dbchfn);
								exit();
								break;
		case 'selectedLang':
								cfg.locale=data.lang;
								fs.writeFileSync(path.resolve(acsblPath, "./PDX_FF/cfg.json"), JSON.stringify(cfg, null, 4));
								if(need_new_pass){
									Send2UI("setPass",{});waitingpass=true;
								}
								else{
									if(need_your_pass)
										Send2UI("needPass",{});
								};
								break;
		default: console.log("unknown cmd");console.log(data);
								break;

	};
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var awaiting_adding_answer_from=""; //???
var retranslated=[];
function ProcessOnlySomeCmdFromTH(destination,packet,cb)
{
	try{
		//console.log("cmd "+packet.js.cmd+" from "+destination.toString().substr(0,5)/*,packet.cmd*/);

		switch(packet.js.cmd)
		{
			case 'channelmsg':
						var retrans=true;
						for(i in retranslated){
							if(retranslated[i]==packet.js.data){
								retrans=false;
							};
						};
						if(retrans){
							retranslated.push(packet.js.data);
							Send2UI("Incoming",{js:packet.js,hashname:destination});
							broadcast2AllExcept(packet.js.cmd,packet.js.data,destination);
						};
						break;

			default:
						console.log(packet);
						break;
		};
		if(cb)cb();
	}
	catch(error){
		console.log("catched error in ProcessOnlySomeCmdFromTH", error);
	};
};



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
var socket_connected=false;

function encdb(txt){
	//console.log("encdb",txt);
	try{
		cipher.start({iv: iv});
		cipher.update(forge.util.createBuffer(txt));
		cipher.finish();
		var encrypted = cipher.output;
		// outputs encrypted hex
		return encrypted.toHex();
	}catch(err){console.log("encdb",err);};
};
function decdb(encrypted){
	//console.log("decdb",encrypted);
	try{
		decipher.start({iv: iv});
		var enc=forge.util.createBuffer(forge.util.hexToBytes(encrypted));
		decipher.update(enc);
		decipher.finish();
		// outputs decrypted
		return decipher.output.data;
	}catch(err){
        console.log("decdb",err);
        Send2UI("wrongPassword",{});
    };
};

if(mobile){
	Mobile.getDocumentsPath(function(err, location) {
		 if (err){
		    console.error("Error", err);
			Send2UI("log",{alert:true,msg:JSON.stringify(err)});
		 }
		 else{
		    console.log("Documents location: "+ location);
			console.log("Platform: "+process.platform);

			acsblPath=location;
			update_path=path.resolve("/storage/sdcard0/mycely_last.apk");//path.resolve(acsblPath, "./PDX_FF/mycely_last.apk");
			dbpfn=path.resolve(acsblPath, "./PDX_FF/dbp.db");
			dbufn=path.resolve(acsblPath, "./PDX_FF/dbu.db");
			dbgfn=path.resolve(acsblPath, "./PDX_FF/dbg.db");
			dbdfn=path.resolve(acsblPath, "./PDX_FF/dbd.db");
			dbchfn=path.resolve(acsblPath, "./PDX_FF/dbch.db");
			fs.exists(path.resolve(acsblPath, "./PDX_FF"), function (exists) {
			  	if(!exists){
					//console.log(err);
					fs.mkdir(path.resolve(acsblPath, "./PDX_FF"),function(err){
						if(err)console.log(err);
						else
						{
							fs.exists(dbpfn,  function (exists) {
							  	if(!exists){
									fs.open(dbpfn, 'w+',function(err, fd){
										if(err){
											console.log(err);
											Send2UI("log",{alert:true,msg:JSON.stringify(err)});
										}
										else fs.close(fd,function (err) {if(err)console.log(err);});
									});
								};
							});
							fs.exists(dbufn,  function (exists) {
							  	if(!exists){
									fs.open(dbufn, 'w+',function(err, fd){
										if(err){
											console.log(err);
											Send2UI("log",{alert:true,msg:JSON.stringify(err)});
										}
										else fs.close(fd,function (err) {if(err)console.log(err);});
									});
								};
							});
							fs.exists(dbgfn,  function (exists) {
							  	if(!exists){
									fs.open(dbgfn, 'w+',function(err, fd){
										if(err){
											console.log(err);
											Send2UI("log",{alert:true,msg:JSON.stringify(err)});
										}
										else fs.close(fd,function (err) {if(err)console.log(err);});
									});
								};
							});
							fs.exists(dbdfn,  function (exists) {
							  	if(!exists){
									fs.open(dbdfn, 'w+',function(err, fd){
										if(err){
											console.log(err);
											Send2UI("log",{alert:true,msg:JSON.stringify(err)});
										}
										else fs.close(fd,function (err) {if(err)console.log(err);});
									});
								};
							});
							fs.exists(dbchfn,  function (exists) {
							  	if(!exists){
									fs.open(dbchfn, 'w+',function(err, fd){
										if(err){
											console.log(err);
											Send2UI("log",{alert:true,msg:JSON.stringify(err)});
										}
										else fs.close(fd,function (err) {if(err)console.log(err);});
									});
								};
							});
							fs.exists(path.resolve(acsblPath, "./PDX_FF/cfg.json"), function (exists) {
							  	if(!exists){
									fs.open(path.resolve(acsblPath, "./PDX_FF/cfg.json"), 'w+',function(err, fd){
										if(err){
											console.log(err);
											Send2UI("log",{alert:true,msg:JSON.stringify(err)});
										}
										else
										{
											fs.close(fd,function (err) {
												if(err)console.log(err);
												else{
													iv = forge.random.getBytesSync(64);
													cfg.hexiv=forge.util.bytesToHex(iv);
													salt = forge.random.getBytesSync(128);
													cfg.salthex=forge.util.bytesToHex(salt);
													fs.writeFileSync(path.resolve(acsblPath, "./PDX_FF/cfg.json"), JSON.stringify(cfg, null, 4));
													need_new_pass=true;
													Send2UI("needLang",{});
												};
											});
										};
									});
								}
								else
								{
									cfg = require(path.resolve(acsblPath, "./PDX_FF/cfg.json"));
									iv=forge.util.hexToBytes(cfg.hexiv);
									salt=forge.util.hexToBytes(cfg.salthex);
									if(defined(cfg.locale)){
										Send2UI("setLang",{lang:cfg.locale});
										Send2UI("needPass",{});
										need_your_pass=true;
									}
									else {
										Send2UI("needLang",{});
									};

								};
							});
						}
					});
				}
				else
				{

					fs.exists(dbpfn,  function (exists) {
					  	if(!exists){
							fs.open(dbpfn, 'w+',function(err, fd){
								if(err){
									console.log(err);
									Send2UI("log",{alert:true,msg:JSON.stringify(err)});
								}
								else fs.close(fd,function (err) {if(err)console.log(err);});
							});
						};
					});
					fs.exists(dbufn,  function (exists) {
					  	if(!exists){
							fs.open(dbufn, 'w+',function(err, fd){
								if(err){
									console.log(err);
									Send2UI("log",{alert:true,msg:JSON.stringify(err)});
								}
								else fs.close(fd,function (err) {if(err)console.log(err);});
							});
						};
					});
					fs.exists(dbgfn,  function (exists) {
					  	if(!exists){
							fs.open(dbgfn, 'w+',function(err, fd){
								if(err){
									console.log(err);
									Send2UI("log",{alert:true,msg:JSON.stringify(err)});
								}
								else fs.close(fd,function (err) {if(err)console.log(err);});
							});
						};
					});
					fs.exists(dbdfn,  function (exists) {
					  	if(!exists){
							fs.open(dbdfn, 'w+',function(err, fd){
								if(err){
									console.log(err);
									Send2UI("log",{alert:true,msg:JSON.stringify(err)});
								}
								else fs.close(fd,function (err) {if(err)console.log(err);});
							});
						};
					});
					fs.exists(dbchfn,  function (exists) {
					  	if(!exists){
							fs.open(dbchfn, 'w+',function(err, fd){
								if(err){
									console.log(err);
									Send2UI("log",{alert:true,msg:JSON.stringify(err)});
								}
								else fs.close(fd,function (err) {if(err)console.log(err);});
							});
						};
					});
					fs.exists(path.resolve(acsblPath, "./PDX_FF/cfg.json"), function (exists) {
					  	if(!exists){
							fs.open(path.resolve(acsblPath, "./PDX_FF/cfg.json"), 'w+',function(err, fd){
								if(err){
									console.log(err);
									Send2UI("log",{alert:true,msg:JSON.stringify(err)});
								}
								else
								{
									fs.close(fd,function (err) {
										if(err)console.log(err);
										else{
											iv = forge.random.getBytesSync(64);
											cfg.hexiv=forge.util.bytesToHex(iv);
											salt = forge.random.getBytesSync(128);
											cfg.salthex=forge.util.bytesToHex(salt);
											fs.writeFileSync(path.resolve(acsblPath, "./PDX_FF/cfg.json"), JSON.stringify(cfg, null, 4));
											need_new_pass=true;
											Send2UI("needLang",{});
										};
									});
								};
							});
						}
						else
						{
							cfg = require(path.resolve(acsblPath, "./PDX_FF/cfg.json"));
							iv=forge.util.hexToBytes(cfg.hexiv);
							salt=forge.util.hexToBytes(cfg.salthex);
							if(defined(cfg.locale)){
								Send2UI("setLang",{lang:cfg.locale});
								Send2UI("needPass",{});
								need_your_pass=true;
							}
							else {
								Send2UI("needLang",{});
							};
						};
					});
				};

			});

		}
	});
}


var start,end;
var pki = forge.pki;
var rsa = forge.pki.rsa;
function genkeys(){
	start=Date.now();
	rsa.generateKeyPair({bits: 2048, workers: 0}, function(err, keypair) {
	  	// keypair.privateKey, keypair.publicKey
		console.log("keys ready");
		th_profile.publicKey=pki.publicKeyToPem(keypair.publicKey).toString();
		th_profile.privateKey=pki.privateKeyToPem(keypair.privateKey).toString();
		stop=Date.now();
		//Send2UI("keys",{date:(stop-start)/1000, publicKey:publicKey,privateKey:privateKey});
		add2dbp(th_profile,"my_profile");
		Send2UI("keysReady",{});
	})
};


function checkUpdate(){
	var verPath = path.resolve(__dirname,'./tmp/version/ver.json');
	var url = 'https://github.com/Zeipt/Mycely/blob/master/www/jxcore/tmp/version/ver.json';
	var currentver = require(verPath);
	rawgithub(url, function(err, data){
	    if(err){console.log(err);}
	    console.log("Github ver:"+JSON.parse(data).app);
	    console.log("Local ver:"+currentver.app);
	    if(parseFloat(JSON.parse(data).app)==parseFloat(currentver.app)) Send2UI("updateAvail",{avail:false});
	    else {
            if(defined(JSON.parse(data).changes)){
                Send2UI("updateAvail",{avail:true, changes: JSON.parse(data).changes});
            }
            else{
                Send2UI("updateAvail",{avail:true, changes: false});
            };
        };
	});
};
setInterval(function(){checkUpdate();}, 3600000);









var thinittid=null;
function initth(){
	console.log("virgin");
	th.init({seeds:seeds}, function(err, self){
		if(err) {
			console.log("hashname generation/startup failed",err);
			thinittid=setTimeout(function(){initth();},10000);
			return console.log("-----------",err);
		};
		console.log("hashname generation/startup success");
		gth=self;
		// self.id contains a the public/private keys and parts
		if(!th_config){
			th_config={
					thid:-1,
					hashname:-1,
					groups:[]
			};
		};
		th_config.type="my_config";
		th_config.hashname=self.hashname;
		th_config.thid=self.id;
		add2dbp(th_config,"my_config");
		if(!th_profile){
			th_profile={};
			th_profile.nick="";
			th_profile.type="my_profile";
		};
		th_profile.destination=th_config.hashname;
		add2dbp(th_profile,"my_profile");
		Send2UI("need_new_profile",{});
		thinittid=null;
		StartTH();
	});
};
var errorsth=0;
function StartTH(callback){
	console.log("starting telehash");
	th.init({id:th_config.thid, seeds:seeds}, function(err, self){
		if(err) {
			console.log("hashname failed to come online");
			if(err.toString()=="offline"){
				errorsth++;
				if(errorsth>1){errorsth=0;thinittid=setTimeout(function(){StartTH();},10000);}
				else {thinittid=setTimeout(function(){StartTH();},10000);};
			}
			return console.log("-----------",err);
		};
		// use self.* now
		channelName = GCHANNELNAME;
		console.log(self.hashname);
		console.log("WE ARE ONLINE");
		Send2UI("thonline",{});
		//begin listening for incoming packets on a channel
		self.listen(channelName, packetHandler);
		gth=self;
		thinittid=null;
		thinited=true;
		genkeys();
		//SetVarInMain("thinited");
		setTimeout(function(){FloodFill();if(mobile)checkUpdate();},5000);
		/*if(undelivered.length>0){
			setTimeout(function(){
				var sent=[];
				for(var j = 0; j < undelivered.length; j++) {
					var alreadysentfirst=false;
					for(k in sent){
						if(sent[k]==undelivered[j].destination)alreadysentfirst=true;
						//break;
					};
					if(!alreadysentfirst){
						sent.push(undelivered[j].destination);
						th_SendData2Dest(undelivered[j].destination, {cmd:undelivered[j].cmd, data:undelivered[j].data});
					};
				};
			},30000);
		};*/
		if(callback)callback();
	});
}
function FloodFill(){
    var d1=Math.floor(Math.random() * (255000000)) + 1;
    var timeout=Math.floor(Math.random() * (30000 - 1))+1;
    var md = forge.md.sha256.create();
    md.update(d1);
    var md1 = forge.md.sha256.create();
    md1.update("pinging: "+d1+"pinging: "+d1);
    targetHashname = md.digest().toHex();
    firstPacket = {
        js: {
                cmd: "ping",
                data:{
                    destination:md1.digest().toHex()
                }
        }
    };

    gth.start(targetHashname, GCHANNELNAME, firstPacket, packetHandlerDummy);

	setTimeout(function(){FloodFill();}, timeout);
};

function packetHandlerDummy(err, packet, chan, callback){return;};
function packetHandler(err, packet, chan, callback){
	if (err)
	{
		//if(err.toString()=="invalid hashname")Send2UI("th","maybe thisisyou",{});
		//if(err.toString()=="timeout")Send2UI("th","peerError",{});
		if(err.toString()=='reset'){
			delete(th_clients[chan.hashname]);
			chan.end();
		}
		if(err.toString()=="timeout"){

			    for(i in peers){
				    if(chan && chan.hashname && peers[i].destination==chan.hashname){
					for(var j = 0; j < undelivered.length; j++) {
					    //console.log("undelivered "+j+" "+undelivered[j].cmd+" "+undelivered[j].data);
					    if(peers[i].destination==undelivered[j].destination)
					    {
                            //console.log("undelivered "+j+" "+undelivered[j].notified);

					        if(!undelivered[j].notified) {
                                //console.log("sending kickPeer");
                                undelivered[j].notified = true;
                                th_SendData2Dest(MainPushServer,{cmd:"kickPeer", data:{hn:chan.hashname}});
                            }
                			break;
					    }
					};
				    }
				};

            setTimeout(function(){
			    for(i in peers){
				    if(chan && chan.hashname && peers[i].destination==chan.hashname){
					for(var j = 0; j < undelivered.length; j++) {
					    //console.log("undelivered "+j+" "+undelivered[j].data.cmd+" "+undelivered[j].data.data+" ");
					    if(peers[i].destination==undelivered[j].destination)
					    {

					        th_SendData2Dest(peers[i].destination,{cmd:undelivered[j].cmd, data:undelivered[j].data});
                            break;
					    }
					};
				    }
				};
			},10000);
		};
		if(defined(th_clients[chan.hashname])){
			delete(th_clients[chan.hashname]);
			chan.end();
		};
		return console.log("oh noes, we got an error! "+ err.toString());
	}
	console.log(chan.hashname);
	if(!defined(th_clients[chan.hashname])) th_clients[chan.hashname]={};
	th_clients[chan.hashname].chan=chan;
	var known=false;
	var banned=false;
	for(i in peers){
		if(peers[i].destination==chan.hashname) {
			known=true;
			banned=peers[i].banned;
			break;
		};
	};
	if(	!packet.js.cmd || banned ||
		(!known && !(packet.js.cmd=="addyou" || packet.js.cmd=="genOTC" || packet.js.cmd=="getIdByOTC" || packet.js.cmd=="addingyouanswer" || packet.js.cmd=="chatmsg2group" || packet.js.cmd=="chatmsg2groupack"))
	){
		delete(th_clients[chan.hashname]);
		chan.end();
		return;
	}

	if(packet.js.cmd!="channelmsg"){
        Send2UI("Incoming",{js:packet.js,hashname:chan.hashname});
    }

    if(packet.js.cmd=="newchatmsg" || packet.js.cmd=="chatmsg2group" || packet.js.cmd=="addyou"){
        frontAlive = false;
        Mobile("isFrontAlive").call({q:"w"}, function(ret){
            frontAlive = true;
        });
        setTimeout(function(){
            if(!frontAlive){
                Mobile.notify(function(err, location) {
                  if (err)
                    console.error("Error Notify", err);
                  else
                    console.log("Notify");
                });
            }
        },1000);

    };

	callback(true);
	if(//packet.js.cmd=="updateMyProfile"  ||
		//packet.js.cmd=="addyou" ||
		packet.js.cmd=="channelmsg" ||
		packet.js.cmd=="newchatmsgack"
	){
		ProcessOnlySomeCmdFromTH(chan.hashname, packet,null);
		if(packet.js.cmd=="newchatmsgack"){
			for(var i = undelivered.length - 1; i >= 0; i--) {
				for(var j in peers){
					//console.log(JSON.stringify(undelivered[i].data));
					//console.log(JSON.stringify(packet.js.data));
					if(	peers[j].destination==chan.hashname &&
						undelivered[i].data==packet.js.data
					) {
						undelivered.splice(i, 1);

                        for(var k = undelivered.length - 1; k >= 0; k--) {
							if(undelivered[k].destination==chan.hashname) {
								th_SendData2Dest(chan.hashname,{cmd:undelivered[k].cmd, data:undelivered[k].data});
								undelivered.splice(k, 1);
							};
						};
						//delUndeliveredMsgs(chan.hashname);
						break;
					};
				};
			};
		}
	};
};
function th_SendData2Dest(hashname,q){
	//console.log("th_SendData2Dest "+hashname+" "+JSON.stringify(q));
	if(defined(th_clients[hashname]) && defined(th_clients[hashname].chan))
	{
		th_clients[hashname].chan.send({js:q});
	}
	else
	{
		try{
			gth.start(hashname, GCHANNELNAME, {	js: q }, packetHandler);
		}catch(err){
			console.log("#########0 " + err.toString()+" "+hashname);
		}
	};
};








var alarmtout=0;
var smallestfreeram=3000000;
var mb=1024*1024;
var frontAlive = false;
function checkMem(){
	//console.log(util.inspect(process.memoryUsage()));
	//var total=os.totalmem()/mb;
    frontAlive = false;
    Mobile("isFrontAlive").call({q:"w"}, function(ret){
        frontAlive = true;
    });
    setTimeout(function(){console.log("frontAlive="+frontAlive);},1000);

	var free=os.freemem()/mb;
	var rss=process.memoryUsage().rss/mb;
	//if(smallestfreeram>free)smallestfreeram=free;
	//total,  smallestfreeram,
	console.log(free,rss);
	if(mobile)if(free<20000)jxcore.tasks.forceGC();
	if(free<3.0 && alarmtout==0){
		alarmtout=5;
		Send2UI("alarmGo2Foreground",{data:"Free mem warning! "+free});
	}
	else if(alarmtout>0)alarmtout--;
	free=null;
	rss=null;
	setTimeout(function(){checkMem();},10000);
	//return;
};
setTimeout(function(){checkMem();},10000);
if(mobile)setInterval(function(){jxcore.tasks.forceGC();},30000);
