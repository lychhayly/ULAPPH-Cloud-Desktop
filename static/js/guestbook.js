function deleteMessage(mid) {
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
	editor_url = root + '/guestbook?GB_FUNC=DELETE&MID=' + mid;
	xmlhttp.open("POST",editor_url,true);
	xmlhttp.send();

	 xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var message = xmlhttp.responseText;
			if (message == "ok") {
				console.log("deleted");
				var e = document.getElementById(mid);
				e.src = "/img/delete2.png";
			} else {
				alert("Delete error!");			
			}
			return;
		}
	  }
	  return;
		  
};


function seenMessage(mid) {
	var xmlhttp2;

	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp2=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp2=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	var editor_url = "";
	var root = location.protocol + '//' + location.host;
	editor_url = root + '/guestbook?GB_FUNC=SEEN&MID=' + mid;
	xmlhttp2.open("POST",editor_url,true);
	xmlhttp2.send();

	 xmlhttp2.onreadystatechange=function()
	  {
	  if (xmlhttp2.readyState==4 && xmlhttp2.status==200)
		{
			var message = xmlhttp2.responseText;
			if (message == "ok") {
				console.log("seen");
				var e = document.getElementById(mid+"s");
				e.src = "/img/seen2.png";
			} else {
				alert("Seen error!");				
			}
			return;
		}
	  }
	return;  
};

function deleteSocialMessage(sid, mid) {
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
	editor_url = root + '/social?SO_FUNC=DELETE&MID=' + mid + '&SID=' + sid;
	xmlhttp.open("POST",editor_url,true);
	xmlhttp.send();

	 xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			var message = xmlhttp.responseText;
			if (message == "ok") {
				console.log("deleted");
				var e = document.getElementById(mid);
				e.src = "/img/delete2.png";
			} else {
				alert("Delete error!");			
			}
			return;
		}
	  }
	  return;
		  
};