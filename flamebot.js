/*Variable area*/
var Discordbot = require('discord.io');

var channelId = '112968553669378048';
var greyRoleId = '114190868503724038';
var redRoleId = '114203448404213767';
var bluRoleId = '114203612284059654';

var bot = new Discord.Client({
	token: "Mjc4OTE4NDQyMTA1NDM4MjA4.C3zSpg.E8AnWmLJi07N0tTLqQOyr53ta4M",
	autorun: true
});

/*Event area*/
bot.on("err", function(error) {
	console.log(error);
});

bot.on("ready", function(rawEvent) {
	console.log("Logged in as: ");
	console.log("Connected!");
	console.log(bot.username + " - (" + bot.id + ")");
	say('I have joined the channel. To start a pug, type !start');
});

//Set global variables
var i = 0;
var admins = [];
var players = [];
var captains = [];
var grey = [];
var red = [];
var blu = [];
var turnCount = 0;
var pugActive = false;
var pickingPhase = false;
var locked = false;
var RED = 'RED';
var BLU = 'BLU';
var GREY = 'GREY';

function pugReset(){
	i = 0;
	players = [];
	captains = [];
	grey = [];
	red = [];
	blu = [];
	turnCount = 0;
	pugActive = false;
	pickingPhase = false;
	locked = false;	
	admins = [];
	admins[0] = new Admin('flame', '108293726064910336');
}

function getPlayerIndex(userID){
	for(var a = 0; a < players.length; a++){
		if(players[a].userid === userID){
			return a;
		}
	}
	return -1;
}

function getPlayerIndexByName(name){
	for(var a = 0; a < players.length; a++){
		if(players[a].name === name){
			return a;
		}
	}
	return -1;
}

function getAdminStarted(){
	for(var adm = 0; adm < admins.length; adm++){
		if(admins[adm].started){
			return admins[adm].name;
		}
	}
	return '';
}

function getAdminIndex(userID){
	for(var a = 0; a < admins.length; a++){
		if(admins[a].userid === userID){
			return a;
		}
	}
	return -1;
}

function getCaptainIndex(userID){
	for(var c = 0; c < captains.length; c++){
		if(captains[c].userid === userID){
			return c;
		}
	}
	return -1;
}

function getGreyIndex(userID){
	for(var a = 0; a < grey.length; a++){
		if(grey[a].userid === userID){
			return a;
		}
	}
	return -1;
}

function getRedIndex(userID){
	for(var a = 0; a < Object.keys(red).length; a++){
		if(red[a].userid === userID){
			return a;
		}
	}
	return -1;
}

function getBluIndex(userID){
	for(var a = 0; a < Object.keys(blu).length; a++){
		if(blu[a].userid === userID){
			return a;
		}
	}
	return -1;
}

function clearColors(){
	var clearList = [];
	for(var g = 0; g < grey.length; g++){
		clearList.push({
			server: channelId,
			user: grey[g].userid,
			role: greyRoleId
		});
	}
	for(var r = 0; r < red.length; r++){
		clearList.push({
			server: channelId,
			user: red[r].userid,
			role: redRoleId
		});
	}
	for(var b = 0; b < blu.length; b++){
		clearList.push({
			server: channelId,
			user: blu[b].userid,
			role: bluRoleId
		});
	}
	for(var cl = 0; cl < clearList.length; cl++){
		bot.removeFromRole(clearList[cl]);
	}
}

function updateColors(){
	var addPlayers = [];
	var removePlayers =[];
	console.log('UPDATING COLORS: ' + red.length + ' ' + grey.length + ' ' + blu.length);
	
	for(var g = 0; g < grey.length; g++){
		if(getRedIndex(grey[g].userid) > -1){
			removePlayers.push({
				server: channelId,
				user: grey[g].userid,
				role: greyRoleId
			});
		}
		else if(getBluIndex(grey[g].userid) > -1){
			removePlayers.push({
				server: channelId,
				user: grey[g].userid,
				role: greyRoleId
			});
		}
		else{	
			addPlayers.push({
				server: channelId,
				user: grey[g].userid,
				role: greyRoleId
			});
		}
	}
	for(var r = 0; r < red.length; r++){
		console.log('MAKING RED: ' + r + ' ' + red[r].name );
		addPlayers.push({
			server: channelId,
			user: red[r].userid,
			role: redRoleId
		});
	}
	for(var b = 0; b < blu.length; b++){
		console.log('MAKING BLU: ' + b + ' ' + blu[b].name );
		addPlayers.push({
			server: channelId,
			user: blu[b].userid,
			role: bluRoleId
		});
	}
	for(var kappa = 0; kappa < addPlayers.length; kappa++){
		bot.addToRole(addPlayers[kappa]);
	}
	for(var rem = 0; rem < removePlayers.length; rem++){
		bot.removeFromRole(removePlayers[rem]);
	}
}

function addToColor(color, player){
	var userId = player.userid;
	if(color === 'GREY'){
		console.log('Adding player ' + player.name +': ' + player.userid + ' to Grey');
		//grey.push(player);
		bot.addToRole({
		    server: channelId,
		    user: userId,
		    role: greyRoleId
		});
		console.log(grey[getGreyIndex(player.userid)].name + ' added to Grey');
	}
	else if(color === 'RED'){
		console.log('Adding player ' + player.name +': ' + player.userid + ' to Red');
		red.push(player);
		bot.addToRole({
		    server: channelId,
		    user: userId,
		    role: redRoleId
		});
		console.log(red[getRedIndex(player.userid)].name + ' added to Red');
	}
	else if(color === 'BLU'){
		console.log('Adding player ' + player.name +': ' + player.userid + ' to Blu');
		blu.push(player);
		bot.addToRole({
		    server: channelId,
		    user: userId,
		    role: bluRoleId
		});	
		console.log(blu[getBluIndex(player.userid)].name + ' added to Blu');
	}
}

function removeFromColor(color, player){
	if(color === 'GREY'){
		var greyIndex = getGreyIndex(player.userid);
		grey.splice(greyIndex,1);
		bot.removeFromRole({
		    server: channelId,
		    user: player.userid,
		    role: greyRoleId
		});
		sleep(500);
		console.log(player.name + ' removed from Grey');
	}
	else if(color === 'RED'){
		var redIndex = getRedIndex(player.userid);
		red.splice(redIndex,1);
		bot.removeFromRole({
		    server: channelId,
		    user: player.userid,
		    role: redRoleId
		});
		sleep(500);
		console.log(player.name + ' removed from Red');
	}
	else if(color === 'BLU'){
		var bluIndex = getBluIndex(player.userid);
		blu.splice(bluIndex,1);
		bot.removeFromRole({
		    server: channelId,
		    user: player.userid,
		    role: bluRoleId
		});
		sleep(500);
		console.log(player.name + ' removed from Blu');
	}
	
}

function removeFromGrey(player){
	sleep(500);
	removeFromColor('GREY',player);
	var gIndex = getGreyIndex(player.userid);
}

function addToGrey(player){
	grey.push(players[getPlayerIndex(player.userid)]);
}

function addToBlu(player){
	blu.push(players[getPlayerIndex(player.userid)]);
	players[getPlayerIndex(player.userid)].isPicked = true;
	players[getPlayerIndex(player.userid)].isBlu = true;
	removeFromGrey(player);
}

function addToRed(player){
	red.push(players[getPlayerIndex(player.userid)]);
	players[getPlayerIndex(player.userid)].isPicked = true;
	players[getPlayerIndex(player.userid)].isRed = true;
	removeFromGrey(player);
}



function swapTurn(player, turnCounter, pickedPlayer){
	var capOneIndex = getPlayerIndex(captains[0].userid);
	var capTwoIndex = getPlayerIndex(captains[1].userid);
	
	if(turnCounter < 10){
		if(player.playersIndex() === capOneIndex){
			say(player.name + ' has picked ' + pickedPlayer.name + '. ' + captains[1].name + '\'s turn to pick');
			players[capOneIndex].isTurn = false;
			players[capTwoIndex].isTurn = true;
		}
		else if(player.playersIndex() === capTwoIndex){
			say(player.name + ' has picked ' + pickedPlayer.name + '. ' + captains[0].name + '\'s turn to pick');
			players[capTwoIndex].isTurn = false;
			players[capOneIndex].isTurn = true;
		}
	}
	else{
		pickingPhase = false;
		locked = true;
		var whosePug = getAdminStarted();
		var redString = '';
		var bluString = '';
		say('Pug is starting. Please move to the correct voice channel.' + whosePug + ' is responsible for creating the lobby');
		for(var rcount = 0; rcount < red.length; rcount++){
			if(rcount != red.length-1){
				redString += red[rcount].name + ', ';
			}
			else{
				redString += red[rcount].name;
			}
		}
		for(var bcount = 0; count < blu.length; bcount++){
			if(bcount != blu.length-1){
				bluString += blu[bcount].name + ', ';
			}
			else{
				bluString += blu[bcount].name;
			}
		}
		
		say('Teams are - Red: ' + redString + ' Blue: ' + bluString);
		sleep(500);
		updateColors();
		sleep(10000);
		pugRest();
		say('Type !start to start a new pug.');
	}

}

function checkPug(){	
	if(players.length >= 12 && captains.length >=2 && !locked){
		var capOne = players[getPlayerIndex(captains[0].userid)];
		var capTwo = players[getPlayerIndex(captains[1].userid)];
		
		say('Pug is now locked. You may no longer add or remove. Captains are ' + capOne.name + ' and ' + capTwo.name +'.');
		pickingPhase = true;
		sleep(100);
		say(capOne.name + '\'s turn to pick.');
		capOne.isTurn = true;
		
		addToBlu(capOne);
		sleep(500);
		addToRed(capTwo);
		sleep(500);
		updateColors();
		sleep(500);
		locked = true;
	}
	updateColors();
}



bot.on("message", function(user, userID, channelID, message, rawEvent) {
	
	var msg = new Message(message);

	if (message.indexOf('!') > -1){
		if(msg.start){
			if(!pugActive){
				if(!isAdmin(userID)){
					admins.push(new Admin(user, userID));
				}
				var aIndex = getAdminIndex(userID);
				admins[aIndex].started = true;
				say('A pug has been started by ' + user + '. Type !add to join.');
				pickingPhase = false;
				locked = false;
				pugActive = true;
			}
			else{
				var whoStarted = getAdminStarted();
				say('A pug has already been started by ' + whoStarted + '.');
			}
		}
		/*else if(msg.Reset && isAdmin(userID)){
			bot.disconnect();
		}*/
		else if(msg.end && pugActive){
			if(isAdmin(userID)){
				say('The pug has been ended by ' + user +'.');
				clearColors();
				sleep(2500);
				pugReset();
				pugActive = false;
			}
			else {
				var didStart = getAdminStarted();
				say('The pug may only be ended by an admin and/or ' + didStart + '.');
			}
		}
		else if(msg.status){
			if(!pugActive){
				say('There is no ongoing pug. To start a pug, type !start');
			}
			else{
				if(locked && pickingPhase){
					var redTeam = '';
					var bluTeam = '';
					var noTeam = '';
					
					for(var rt = 0; rt < red.length; rt++){
						redTeam += ' ' +red[rt].name;
					}
					for(var bt = 0; bt < blu.length; bt++){
						bluTeam += ' ' + blu[bt].name;
					}
					for(var gt = 0; gt < grey.length; gt++){
						noTeam += ' ' + grey[gt].name;
					}
					say('Blu Team: ' + bluTeam + '\nRed Team: ' + redTeam);
				}
				if(!locked && !pickingPhase){
					say('Captains: ' + captains.length + '/2, Players: ' + players.length + '/12');
				}
			}
		}
		else if(msg.players){
			if(pugActive){
				var playersAdded = "";
				if(!locked && !pickingPhase){
					for(var k=0; k< players.length; k++){
						if(k !== players.length-1){
							playersAdded += ' ' +players[k].name + '(' + players[k].playersIndex() + '),';
						}
						else{
							playersAdded += ' ' +players[k].name + '(' + players[k].playersIndex() + ')';
						}
					}
					if(players.length === 0){
						say('There are no players added to this pug. Type !add to join');
					}
					else{
						say('Players Added:' + playersAdded);
					}
				}
				if(locked && pickingPhase){
					for(var ka=0; ka< players.length; ka++){
						if(isAvailable(players[ka].userid)){
							playersAdded += ' ' +players[ka].name + '(' + players[ka].playersIndex() + ')';	
						}
					}
					say('Players Available:' + playersAdded);					
				}
			}
			else{
				say('There is no ongoing pug. To start a pug, type !start.');
			}
		}
		else if(msg.captains){
			if(pugActive){
				var captainsAdded = "";
				for(var h=0; h<Object.keys(captains).length; h++){
					captainsAdded += ' ' +captains[h].name;
				}
				say('Captains Added:' + captainsAdded);
			}
			else{
				say('There is no ongoing pug. To start a pug, type !start.');
			}
		}
		else if(msg.add){
			if(pugActive){
				if(!pickingPhase && !locked){
					if(!isAdded(userID)){
						players.push(new Player(user, userID));
						var pIndex = getPlayerIndex(userID);
						addToGrey(players[pIndex]);
					}
					var playIndex = getPlayerIndex(userID);
					if(msg.captain && !players[playIndex].isCaptain && captains.length < 2){
						say(user + ' has been added as a captain.');
						players[playIndex].isCaptain = true;
						captains.push(players[playIndex]);
					}
					checkPug();
					updateColors();
				}
				else if(pickingPhase && locked){
					say('You may not add during the picking phase. Please wait for the next pug.');
				}
				else if(!pickingPhase && locked){
					say('A pug has exited the picking phase, please wait for the pug to be ended.');
				}
			}
			else{
				say('There is no ongoing pug. To start a pug, type !start.');
			}
		}
		else if(msg.remove){
			if(pugActive){
				if(!pickingPhase){
					var plIndex = getPlayerIndex(userID);
					var capIndex = getCaptainIndex(userID);
					if(isAdded(userID) && plIndex > -1){
							removeFromColor('GREY', players[plIndex]);
					}
					players.splice(plIndex,1);
					if(capIndex > -1){
					captains.splice(capIndex,1);
					}
				}				
			}
		}
		else if(msg.pick){
			if(pugActive && pickingPhase){
				var playr = players[getPlayerIndex(userID)];
				if(playr.isCaptain && playr.isTurn){
					var pickMsg = message.split(' ');
					if(pickMsg.length > 1){
						var pickString = pickMsg[1];
						var pickIndx = -1;
						if(pickString.indexOf('@') > -1){
							var pattern = /\d+/g;
							var pickId = pickString.match(pattern);
							pickId = pickId.toString();
							pickIndx = getPlayerIndex(pickId);
						}
						else{
							pickIndx = getPlayerIndexByName(pickString);
							if(pickIndx < 0){
								if(Number(pickString)<players.length-1){
									pickIndx = pickString;	
								}
							}
						}
						if (pickIndx > -1 && isAvailable(players[pickIndx].userid)){
							if(playr.isBlu){
								addToBlu(players[pickIndx]);
								sleep(500);
								updateColors();
								turnCount++;
								swapTurn(playr, turnCount, players[pickIndx]);
							}
							else if(playr.isRed){
								addToRed(players[pickIndx]);
								sleep(500);
								updateColors();
								turnCount++;
								swapTurn(playr, turnCount, players[pickIndx]);
							}
						}
						else {
							say('Error picking player ' + '\'' +pickString + '\'.');
						}
					}
				}
			}
		}
		else if(msg.lock){
			if(pugActive && !pickingPhase && isAdmin(userID)){
				//if(captains.length > 1){
				say('Pug has been locked, picking phase to begin');
				//say('Captains are: ' + captains[0] );
				//}
			}
		}
		else if(msg.clear && admins.length > 0){
			if(userID === admins[0].userid){
				clearColors();
				say('Clearing Colors');
			}
		}
		else if(msg.colors){
			updateColors();
		}
	}
	
	if (message === "ping") {
		sendMessages(channelID, ["pong"]); //Sending a message with our helper function
		console.log(user + " - " + userID);
		console.log("in " + channelID);
		console.log(message);
		console.log("----------");
	}
});

bot.on("presence", function(user, userID, status, rawEvent) {
	var pIndex = getPlayerIndex(userID);
	var aIndex = getAdminIndex(userID);
	var cIndex = getCaptainIndex(userID);
	if(aIndex > -1 && admins[aIndex].started){
		if(status === 'offline'){
			say(user + ' has created a pug and gone offline. The pug has been ended. To start a new pug type !start');
			clearColors();
			pugReset();
		}
	}
	if(pIndex > -1 && !pickingPhase){
		if(status === 'offline'){
			wipeColors(userID);
			players.splice(pIndex,1);
		}
	}
	/*console.log(user + " is now: " + status);*/
});

bot.on("debug", function(rawEvent) {
	//console.log(rawEvent); //Logs every event
});

bot.on("disconnected", function() {
	console.log("Bot disconnected");
	bot.connect(); //Auto reconnect
});

/*Function declaration area*/
function sendMessages(ID, messageArr, interval) {
	var len = messageArr.length;
	var callback;
	var resArr = [];
	typeof(arguments[2]) === 'function' ? callback = arguments[2] : callback = arguments[3];
	if (typeof(interval) !== 'number') interval = 250;
	
	function _sendMessages() {
		setTimeout(function() {
			if (messageArr.length > 0) {
				bot.sendMessage({
					to: ID,
					message: messageArr[0]
				}, function(res) {
					resArr.push(res);
				});
				messageArr.splice(0, 1);
				_sendMessages();
			}
		}, interval);
	}
	_sendMessages();
	
	var checkInt = setInterval(function() {
		if (resArr.length === len) {
			if (typeof(callback) === 'function') {
				callback(resArr);
			}
			clearInterval(checkInt);
		}
	}, 0);
}

function sendFiles(channelID, fileArr, interval) {
	var len = fileArr.length;
	var callback;
	var resArr = [];
	typeof(arguments[2]) === 'function' ? callback = arguments[2] : callback = arguments[3];
	if (typeof(interval) !== 'number'){
		interval = 500;
	}
	
	function _sendFiles() {
		setTimeout(function() {
			if (fileArr.length > 0) {
				bot.uploadFile({
					channel: channelID,
					file: fileArr[0]
				}, function(res) {
					resArr.push(res);
				});
				fileArr.splice(0, 1);
				_sendFiles();
			}
		}, interval);
	}
	_sendFiles();
	
	var checkInt = setInterval(function() {
		if (resArr.length === len) {
			if (typeof(callback) === 'function') {
				callback(resArr);
			}a
			clearInterval(checkInt);
		}
	}, 0);
}

function say(message){
	sendMessages(channelId, [message]);
}

function wipeColors(userID){
	removeFromColor('GREY', userID);
	removeFromColor('RED', userID);
	removeFromColor('BLU', userID);
}

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
 }

function Message(message){
	if(message.indexOf('!add') === 0){ this.add = true; }
	if(message.indexOf('!remove') === 0){ this.remove = true; }
	if(message.indexOf('!start') === 0){ this.start = true; }
	if(message.indexOf('!end') === 0){ this.end = true; }
	if(message.indexOf('!status') === 0){ this.status = true; }
	if(message.indexOf('!clear') === 0){ this.clear = true; }
	if(message.indexOf('!reset') === 0){ this.reset = true; }
	if(message.indexOf('!lock') === 0){ this.lock = true; }
	if(message.indexOf('!pick') === 0){ this.pick = true; }
	if(message.indexOf('!captains') === 0){ this.captains = true; }
	if(message.indexOf('!players') === 0){ this.players = true; }
	if(message.indexOf('!colors') === 0){ this.colors = true; }
	
	if(message.indexOf('captain') > -1){ this.captain = true; }
	if(message.indexOf('scout') > -1){ this.scout = true; }
	if(message.indexOf('demo') > -1){ this.demo = true; }
	if(message.indexOf('soldier') > -1){ this.soldier = true; }
	if(message.indexOf('medic') > -1){ this.medic = true; }
}

function Player(user, userID){
	this.name = user;
	this.userid = userID;
	this.role = null;
	this.index = null;
	this.scout = false;
	this.soldier = false;
	this.demo = false;
	this.medic = false;
	this.isModerator = false;
	this.isCaptain = false;
	this.isTurn = false;
	this.isPicked = false;
	this.isRed = false;
	this.isBlu = false;
	this.pickedAs = null;
	
	this.playersIndex = function(){
		for(var a = 0; a < Object.keys(players).length; a++){
			if(players[a].userid === userID){ return a; }
		}
		return -1;
	};
	
	this.captainsIndex = function(){
		for(var a = 0; a < Object.keys(captains).length; a++){
			if(captains[a].userid === userID){ return a; } 
		}
		return -1;
	};
	
	this.adminsIndex = function(){
		for(var a = 0; a < Object.keys(admins).length; a++){
			if(admins[a].userid === userID){ return a; } 
		}
		return -1;
	};
	
	this.redIndex = function(){
		for(var a = 0; a < Object.keys(red).length; a++){
			if(red[a].userid === userID){ return a; } 
		}
		return -1;
	};
	
	this.bluIndex = function(){
		for(var a = 0; a < Object.keys(blu).length; a++){
			if(blu[a].userid === userID){ return a; } 
		}
		return -1;
	};
}

function Admin(user, userID){
	this.name = user;
	this.userid = userID;
	this.started = false;
}

function isAdmin(userID){
	for(var a = 0; a < admins.length; a++){
		if(admins[a].userid === userID){
			return true;
		}
	}
}

function isAvailable(userID){
	for(var gr = 0; gr < grey.length; gr++){
		if(grey[gr].userid === userID){
			return true;
		}
	}
}

function isAdded(userID){
	for(var a = 0; a < players.length; a++){
		if(players[a].userid === userID){
			return true;
		}
	}
}