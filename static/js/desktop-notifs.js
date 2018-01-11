(function() {
	'use strict';
	
	// Set the name of the "hidden" property and the change event for visibility
	var hidden, visibilityChange; 
	if (typeof document.hidden !== "undefined") {
	  hidden = "hidden";
	  visibilityChange = "visibilitychange";
	} else if (typeof document.mozHidden !== "undefined") { // Firefox up to v17
	  hidden = "mozHidden";
	  visibilityChange = "mozvisibilitychange";
	} else if (typeof document.webkitHidden !== "undefined") { // Chrome up to v32, Android up to v4.4, Blackberry up to v10
	  hidden = "webkitHidden";
	  visibilityChange = "webkitvisibilitychange";
	}
	
	var videoElement = document.getElementById("videoElement");

	// If the page is hidden, pause the video;
	// if the page is shown, play the video
	function handleVisibilityChange() {
	  if (document[hidden]) {
		//hidden
	  } else {
		//$('#focusCont').text("Focused");
		var h = document.getElementById("host");
		var l = getLocation(h.value);
		var d = document.getElementById("desktop");
		var n = document.getElementById("dName");
		alertify.set({ delay: 5000 });
		//alertify.log("<b>" + n.value + " (" + d.value + ")" + " - " + l.hostname + "</b>");
		soundDesktop();
		alertify.log("<h3>" + n.value + " (" + d.value + ")" + " - " + l.hostname + "</h3>");
		//speakMessage("Welcome to desktop " + n.value + " (" + d.value + ")");
		//repStat();
	  }
	}

	// Warn if the browser doesn't support addEventListener or the Page Visibility API
	if (typeof document.addEventListener === "undefined" || typeof document[hidden] === "undefined") {
	  alert("This demo requires a modern browser that supports the Page Visibility API.");
	} else {
	  // Handle page visibility change   
	  document.addEventListener(visibilityChange, handleVisibilityChange, false);
	}

})();

var getLocation = function(href) {
	var l = document.createElement("a");
	l.href = href;
	return l;
};

function repStat() {
	
/* 	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  cxhr2=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  cxhr2=new ActiveXObject('MSXML2.XMLHTTP.3.0');
	  }  */
  
	var aUser = document.getElementById("aUser");
	if (aUser.value == "") {
		return;
	}
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttstat=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttstat=new ActiveXObject('MSXML2.XMLHTTP.3.0');
	  }
	  
	chk_url = '/people?PEOPLE_FUNC=REP-ACT&UID=' + aUser.value;
	xmlhttstat.open("GET",chk_url,true);
	xmlhttstat.send();
	return;
};

function soundDesktop() {
	
	var aSound = document.createElement('audio');

	if (isEdge == true || isIE == true || isSafari == true) {
		soundManager.createSound({
			id: 'mySoundSS',
			volume: 80,
			url: root + "/audio/shooting-star.mp3"
		});
		playSound('mySoundSS');	
		return;
	}
	soundManager.createSound({
		id: 'mySoundSS',
		volume: 80,
		url: root + "/audio/shooting-star.ogg"
	});
	playSound('mySoundSS');
	
};
