//http://jsfiddle.net/kelunik/pkjze6e6/42/
var node = document.getElementById("page");
var longpress = false;
var presstimer = null;
var longtarget = null;

var cancel = function(e) {
    if (presstimer !== null) {
        clearTimeout(presstimer);
        presstimer = null;
    }
    
    this.classList.remove("longpress");
};

var click = function(e) {
    if (presstimer !== null) {
        clearTimeout(presstimer);
        presstimer = null;
    }
    
    this.classList.remove("longpress");
    
    if (longpress) {
        return false;
    }
    
    //alert("press");
	//keyEvents.js
	addEventListeners();
};

var start = function(e) {
    //console.log(e);
    
    if (e.type === "click" && e.button !== 0) {
        return;
    }
    
    longpress = false;
    
    this.classList.add("longpress");
    
    presstimer = setTimeout(function() {
        //alert("long click");
		addEventListeners();
		launchAS();
        longpress = true;
    }, 1000);
    
    return false;
};

function launchAS() {
	
/* 	var isMobile = document.getElementById("isMobile").value;
	var jswmstr = "";
	if (isMobile == "true" || isMobile == true) {
		jswmstr = "'" + "/tools?FUNC=WIDGET&t=MiniBrowserGet" + "', 500, 300, 'middle', 'middle', {title: '" + "Mini Browser" + "', icon: '/img/jswm-web.png'}";
	} else {
		//jswmstr = "'" + "/tools?FUNC=MIRROR2" + "', 500, 300, 'middle', 'middle', {title: '" + "Mirror" + "', icon: '/img/jswm-web.png'}";
		jswmstr = "'" + "/tools?FUNC=ALL_DESKTOPS" + "', 500, 300, 'middle', 'middle', {title: '" + "All Desktops" + "', icon: '/img/jswm-web.png'}";
	} */
/* 	var jswmstr = "'" + "/tools?FUNC=ALL_DESKTOPS" + "', 500, 300, 'middle', 'middle', {title: '" + "All Desktops" + "', icon: '/img/jswm-web.png'}";
	eval('windowManager.openURI(' + jswmstr + ');'); */

	//var tdesk = prompt("Please enter desktop name", "TempDesktop");
	//if (tdesk != null) {
	//window.open("/uwm?u=" + tdesk, "_blank");
	window.open("/chat-bubble/ulapphbot.html", "_blank");
	/*var jswmstr = "'" + "/uwm?u=" + tdesk + "', 500, 300, 'middle', 'middle', {title: '" + "Mirror" + "', icon: '/img/jswm-web.png'}";
	eval('windowManager.openURI(' + jswmstr + ');');
	
	var aSound = document.createElement('audio');
	soundManager.createSound({
		id: 'waterMob',
		volume: 75,
		url: root + "/audio/water-drop.ogg"
	});
	playSound('waterMob');*/
	//} else {
	//	alert("Please enter desktop name");
	//}
};

node.addEventListener("mousedown", start);
node.addEventListener("touchstart", start);
node.addEventListener("click", click);
node.addEventListener("mouseout", cancel);
node.addEventListener("touchend", cancel);
node.addEventListener("touchleave", cancel);
node.addEventListener("touchcancel", cancel);
