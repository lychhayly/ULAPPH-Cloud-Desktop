//function loadCloudData(mediaID) {
function loadCloudData() {
	var mediaID = parseInt(document.getElementById("notesrc").value);
	console.log("mediaID: "+mediaID);
	if (mediaID == "0" || mediaID == 0 || mediaID == undefined) {
		return;
	}
	//current desktop
	var deskID = document.getElementById("desktop").value;
	console.log("deskID: "+deskID);
	if (deskID != "uwm") {
		return;
	}
					
	console.log("Loading data... Please wait... This may take a while.");
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }

	var notes_url = "";
	notes_url = '/media?FUNC_CODE=RAWJSON&MEDIA_ID=' + mediaID + '&SID=TDSMEDIA-' + mediaID;
	xmlhttp.open("POST",notes_url,true);
	xmlhttp.send();

	 xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			if (xmlhttp.responseText != "") {
				var objJSON = JSON.parse(xmlhttp.responseText);
				for(var i=0; i<objJSON.notes.length; i++) {
					var curDesk = objJSON.notes[i].desktop;
					console.log("curDesk: "+curDesk);
					localStorage['highestId' + curDesk] = objJSON.notes[i].id;
					localStorage['highestZ-' + curDesk] = objJSON.notes[i].zindex;
					var note = new Note();
					note.id = objJSON.notes[i].id;
					localStorage['highestId' + thisDesktop] = objJSON.notes[i].id;
					note.desktop = objJSON.notes[i].desktop;
					note.text = objJSON.notes[i].note;
					note.timestamp = objJSON.notes[i].timestamp;
					note.left = objJSON.notes[i].left;
					note.top = objJSON.notes[i].top;
					note.zIndex = objJSON.notes[i].zindex;
					localStorage['highestZ-' + thisDesktop] = note.zIndex;
					note.saveAsNew();
					console.log("Loaded note: "+note.desktop+"-"+note.id);
				}
				console.log("Notes data processed: "+objJSON.notes.length);
			}
			
		}
		
	}
	
};