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
		uploadULAPH();
        longpress = true;
    }, 1000);
    
    return false;
};

function uploadULAPH() {
	//alert("upload to ulapph");
	take_snapshot();
	//upload_ulapph();
};

function dataURItoBlob(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString;
	if (dataURI.split(',')[0].indexOf('base64') >= 0) {
		byteString = atob(dataURI.split(',')[1]);
	} else {
		byteString = unescape(dataURI.split(',')[1]);
	}

	// separate out the mime component
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	// write the bytes of the string to a typed array
	var ia = new Uint8Array(byteString.length);
	for (var i = 0; i < byteString.length; i++) {
		ia[i] = byteString.charCodeAt(i);
	}

	return new Blob([ia], {type:mimeString});
}

function upload_ulapph() {
	saveSettings();
	var xmlhttp;

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	var editor_url = "";
	var root = location.protocol + '//' + location.host;
	editor_url = root + '/editor?EDIT_FUNC=GET_UP_URL&SID=TDSMEDIA-0';
	xmlhttp.open("POST",editor_url,true);
	xmlhttp.send();

	 xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var uploadURL = xmlhttp.responseText;
			var blob = dataURItoBlob(document.getElementById("imgdata").value);
			var fd = new FormData(document.forms[0]);
			fd.append("file", blob);
			
			var sid = "";
			var tgt = document.getElementById("sid").value;
			if (parseInt(tgt) > 0) {
				sid = 'TDSSLIDE-' + tgt;
				//document.getElementById("note").innerHTML = "<h1>" + sid + "</h1>";
			} else {
				sid = '';
				//document.getElementById("note").innerHTML = "<h1>No target slide!</h1>";
			}
			
			fd.append("EMBED", sid);

			var caption = "";
			var ttl = document.getElementById("title").value;
			if (ttl != "") {
				caption = ttl;
				//document.getElementById("note").innerHTML = document.getElementById("note").innerHTML + "<h3>" + ttl + "</h3>";
			} else {
				caption = '';
				//document.getElementById("note").innerHTML = document.getElementById("note").innerHTML + "<b>No caption or title!</b>";
			}

			var streamUwm = "";
			var uwm = document.getElementById("uwm").value;
			if (uwm != "") {
				streamUwm = uwm;
				//document.getElementById("note").innerHTML = document.getElementById("note").innerHTML + "<h3>Streaming to UWM: " + streamUwm + "</h3>";
			} else {
				streamUwm = '0';
				//document.getElementById("note").innerHTML = document.getElementById("note").innerHTML + "<b>No caption or title!</b>";
			}
			if (caption == "") {
				caption = "ulapphMirrorImage "+"desktop"+streamUwm;
			}
			//edwinxxx
			var urlParams;
			var match,
					pl     = /\+/g,  // Regex for replacing addition symbol with a space
					search = /([^&=]+)=?([^&]*)/g,
					decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
					query  = window.location.search.substring(1);

			urlParams = {};
			while (match = search.exec(query))
			   urlParams[decode(match[1])] = decode(match[2]);
			if (urlParams["camfunc"] != "image-capture") {
				fd.append("STRUWM", streamUwm);
			}
			fd.append("TITLE", caption);
			fd.append("CATEGORY", "desktop"+streamUwm);
			var desc = document.getElementById("desc").value;
			if (desc == "") {
				//append date
				var dateObj = new Date();
				var month = dateObj.getUTCMonth() + 1; //months from 1-12
				var day = dateObj.getUTCDate();
				var year = dateObj.getUTCFullYear();

				newdate = year + "" + month + "" + day;

				fd.append("DESC", "ulapphMirrorImage "+newdate);
			} else {
				fd.append("DESC", desc);
			}
			fd.append("DATA_TYPE", "image");
			fd.append("MIME_TYPE", "image/jpeg");
			fd.append("FL_SHARED", "N");
			fd.append("DOC_STAT", "Personal");
			
			var request = new XMLHttpRequest();
			request.open("POST", uploadURL);
			request.send(fd);
			request.onreadystatechange=function()
			  {
			  if (request.readyState==4 && request.status==200)
				{
					var respVal = request.responseText;
					//alert("Image has been uploaded to Media Gallery!");
					document.body.style.background = "green";
					//var upok = new Audio();
					//upok.autoplay = false;
					//upok.src = navigator.userAgent.match(/Firefox/) ? '/audio/kewl.ogg' : '/audio/kewl.ogg';
					//upok.play();
					if (respVal == "recapture") {
						//take another image now
						console.log("new image captured!");
						take_snapshot();
					}
					return;
				}
			 }

		}
	  }
		  
}

node.addEventListener("mousedown", start);
node.addEventListener("touchstart", start);
node.addEventListener("click", click);
node.addEventListener("mouseout", cancel);
node.addEventListener("touchend", cancel);
node.addEventListener("touchleave", cancel);
node.addEventListener("touchcancel", cancel);

function loadSettings() {
        var sid = localStorage["mirror-sid"];
        document.getElementById("sid").value = sid;
        var title = localStorage["mirror-title"];
        document.getElementById("title").value = title;
        var uwm = localStorage["mirror-uwm"];
        document.getElementById("uwm").value = uwm;
        var desc = localStorage["mirror-desc"];
        document.getElementById("desc").value = desc;
}

function saveSettings() {
        var sid = document.getElementById("sid").value;
        localStorage["mirror-sid"] = sid;
        var title = document.getElementById("title").value;
        localStorage["mirror-title"] = title;
        var uwm = document.getElementById("uwm").value;
        localStorage["mirror-uwm"] = uwm;
        var desc = document.getElementById("desc").value;
        localStorage["mirror-desc"] = desc;
}
