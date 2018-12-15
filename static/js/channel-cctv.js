//--start channel codes
var FL_CONNECTED_OK = false;
var root = location.protocol + '//' + location.host;

function onOpen() {
	//soundNow();
	console.log("Channel opened...");
	FL_CONNECTED_OK = true;
};

function procMessage(obj) {
	console.log("procMessage...");
 	var res = obj.message;
	var sysUpd = res.indexOf("ULAPPH-SYS-UPD@888@");
	var str = res; 
	var resp = str.split(":");

	if (sysUpd > 0) {
		var cmdata = str.split("@888@");
		console.log("cmdata: "+cmdata);
		switch (cmdata[2]) {
			case "SYS_STRUWM_CAPTURE":
				console.log("SYS_STRUWM_CAPTURE...");
				var uid = cmdata[3];
				console.log("uid: "+uid);
				var desktop = cmdata[4];
				console.log("desktop: "+desktop);
				var uwm = "desktop" + document.getElementById("uwm").value;
				console.log("uwm: "+uwm);
				if (uid != "" && desktop == uwm) {
					//capture
					console.log("triggered cctv capture!");
					take_snapshot();
				}
				break;
				

		}
		return;	
	}
};


function onClose() {
	FL_CONNECTED_OK = false;
	reConnect();
};

function reConnect() {

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  cxhr=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  cxhr=new ActiveXObject('MSXML2.XMLHTTP.3.0');
	  }
	cxhr.open("GET","/stream?STR_FUNC=DEL_CHAN", true); 
	return;
};
