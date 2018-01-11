var ea = document.getElementById("aUser");
var ed = document.getElementById("desktop");
var ss = document.getElementById("soundStat");
var en = document.getElementById("dName");
var thisDesktop = ed.value;
var eh = document.getElementById("host");  
var em = document.getElementById("mode");
var sn = document.getElementById("snm");  
//var dbName = eh.value +  "-" + ea.value;
var res = ea.value;
var SPL = res.split("---");
if (SPL.length == 2) {
	var dbName = eh.value +  "-" + SPL[0];
} else {
	var dbName = eh.value +  "-" + ea.value;
}

var FL_UPDATE = false;
var syncCtr = 0;

var db;

try {
	if (window.openDatabase) {
		db = openDatabase(dbName, "1.0", "ULAPPH Sticky Notes", 200000);
		if (!db)
			alert("Failed to open the database on disk.  This is probably because the version was bad or there is not enough space left in this domain's quota");
				} else
					alert("Couldn't open the database.  Please try with a WebKit nightly with this feature enabled");
			} catch(err) { }

var captured = null;
localStorage['highestZ-' + thisDesktop] = 0;
localStorage['highestId' + thisDesktop] = 0;

function Note()
{
	var self = this;

	var note = document.createElement('div');
	note.className = 'note';
	note.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
	note.addEventListener('click', function() { return self.onNoteClick() }, false);
	this.note = note;

	var close = document.createElement('div');
	close.className = 'closebutton';
	close.addEventListener('click', function(event) { return self.close(event) }, false);
	note.appendChild(close);

	var edit = document.createElement('div');
	edit.className = 'edit';
	edit.setAttribute('contenteditable', true);
	edit.addEventListener('keyup', function() { return self.onKeyUp() }, false);
	note.appendChild(edit);
	this.editField = edit;

	var ts = document.createElement('div');
	ts.className = 'timestamp';
	ts.addEventListener('mousedown', function(e) { return self.onMouseDown(e) }, false);
	note.appendChild(ts);
	this.lastModified = ts;

	document.body.appendChild(note);
	return this;
}

Note.prototype = {
	get id()
	{
		if (!("_id" in this))
			this._id = 0;
		return this._id;
	},

	set id(x)
	{
		this._id = x;
	},

	get text()
	{
		return this.editField.innerHTML;
	},

	set text(x)
	{
		this.editField.innerHTML = x;
	},

	get timestamp()
	{
		if (!("_timestamp" in this))
			this._timestamp = 0;
		return this._timestamp;
	},

	set timestamp(x)
	{
		if (this._timestamp == x)
			return;

		this._timestamp = x;
		var date = new Date();
		date.setTime(parseFloat(x));
		this.lastModified.textContent = modifiedString(date);
	},

	get left()
	{
		return this.note.style.left;
	},

	set left(x)
	{
		this.note.style.left = x;
	},

	get top()
	{
		return this.note.style.top;
	},

	set top(x)
	{
		this.note.style.top = x;
	},

	get zIndex()
	{
		return this.note.style.zIndex;
	},

	set zIndex(x)
	{
		this.note.style.zIndex = x;
	},

	close: function(event)
	{
		if (confirm('Are you sure you want to delete this?')) {
			// Delete
		} else {
			return;
		}
		this.cancelPendingSave();

		var note = this;
		db.transaction(function(tx)
		{
			tx.executeSql("DELETE FROM WebKitStickyNotes WHERE timestamp = ?", [note.timestamp]);
			alertify.log("Successful delete: " + note.desktop + "-" + note.id);
		});
		
		var duration = event.shiftKey ? 2 : .25;
		this.note.style.webkitTransition = '-webkit-transform ' + duration + 's ease-in, opacity ' + duration + 's ease-in';
		this.note.offsetTop; // Force style recalc
		this.note.style.webkitTransformOrigin = "0 0";
		this.note.style.webkitTransform = 'skew(30deg, 0deg) scale(0)';
		this.note.style.opacity = '0';

		var self = this;
		setTimeout(function() { document.body.removeChild(self.note) }, duration * 1000);
		
		//sound
		soundDelNote();
	},

	saveSoon: function()
	{
		this.cancelPendingSave();
		var self = this;
		this._saveTimer = setTimeout(function() { self.save() }, 200);
		
	},

	cancelPendingSave: function()
	{
		if (!("_saveTimer" in this))
			return;
		clearTimeout(this._saveTimer);
		delete this._saveTimer;
	},

	save: function()
	{
		this.cancelPendingSave();

		if ("dirty" in this) {
			this.timestamp = new Date().getTime();
			delete this.dirty;
		}

		var note = this;
		db.transaction(function (tx)
		{
			tx.executeSql("UPDATE WebKitStickyNotes SET desktop = ?, note = ?, timestamp = ?, left = ?, top = ?, zindex = ? WHERE id = ? and desktop = ?", [note.desktop, note.text, note.timestamp, note.left, note.top, note.zIndex, note.id, note.desktop]);
			FL_UPDATE = true;
		});
		
	},

	saveAsNew: function()
	{
		this.timestamp = new Date().getTime();
		
		var note = this;
		db.transaction(function (tx) 
		{
			tx.executeSql("INSERT INTO WebKitStickyNotes (id, desktop, note, timestamp, left, top, zindex) VALUES (?, ?, ?, ?, ?, ?, ?)", [note.id, note.desktop, note.text, note.timestamp, note.left, note.top, note.zIndex]);
			alertify.log("Successful insert: " + note.desktop + "-" + note.id);
		}); 
	},

	onMouseDown: function(e)
	{
		captured = this;
		this.startX = e.clientX - this.note.offsetLeft;
		this.startY = e.clientY - this.note.offsetTop;
		this.zIndex = parseInt(localStorage['highestZ-' + thisDesktop]) + 1;
		//alert("onMouseDown");
		removeEventListeners();

		var self = this;
		if (!("mouseMoveHandler" in this)) {
			this.mouseMoveHandler = function(e) { return self.onMouseMove(e) }
			this.mouseUpHandler = function(e) { return self.onMouseUp(e) }
		}

		document.addEventListener('mousemove', this.mouseMoveHandler, true);
		document.addEventListener('mouseup', this.mouseUpHandler, true);

		return false;
	},

	onMouseMove: function(e)
	{
		if (this != captured)
			return true;

		this.left = e.clientX - this.startX + 'px';
		this.top = e.clientY - this.startY + 'px';
		return false;
	},

	onMouseUp: function(e)
	{
		document.removeEventListener('mousemove', this.mouseMoveHandler, true);
		document.removeEventListener('mouseup', this.mouseUpHandler, true);

		this.save();
		return false;
	},

	onNoteClick: function(e)
	{
		this.editField.focus();
		getSelection().collapseToEnd();
	},

	onKeyUp: function()
	{
		this.dirty = true;
		this.saveSoon();
		//alert("onKeyUp");
	},
}

function loaded()
{
	db.transaction(function(tx) {
		tx.executeSql("SELECT COUNT(*) FROM WebkitStickyNotes", [], function(result) {
			deleteNotes();
			var deskID = document.getElementById("desktop").value;
			console.log("deskID: "+deskID);
			if (deskID == "uwm") {
				console.log("Loading data...");
				loadCloudData();
			}
			selectNotes();
			loadNotes();

		}, function(tx, error) {
			tx.executeSql("CREATE TABLE WebKitStickyNotes (id REAL, desktop TEXT, note TEXT, timestamp REAL, left TEXT, top TEXT, zindex REAL)", [], function(result) { 
				deleteNotes();
				var deskID = document.getElementById("desktop").value;
				console.log("deskID: "+deskID);
				if (deskID == "uwm") {
					console.log("Loading data...");
					loadCloudData();
				}
				selectNotes();
				loadNotes();
			});
		});
	});
	
}

function loadNotes()
{
	db.transaction(function(tx) {
		var thisDesktop = document.getElementById("desktop").value;
		tx.executeSql("SELECT id, desktop, note, timestamp, left, top, zindex FROM WebKitStickyNotes WHERE desktop = ?", [thisDesktop], function(tx, result) {
			for (var i = 0; i < result.rows.length; ++i) {
				var row = result.rows.item(i);
				var note = new Note();
				note.id = row['id'];
				note.desktop = row['desktop'];
				note.text = row['note'];
				note.timestamp = row['timestamp'];
				note.left = row['left'];
				note.top = row['top'];
				note.zIndex = row['zindex'];
				
				console.log("Loaded " + row['desktop'] + "-" + row['id']);
				
				if (row['id'] > parseInt(localStorage['highestId' + thisDesktop]))
					localStorage['highestId' + thisDesktop] = row['id'];
				if (row['zindex'] > parseInt(localStorage['highestZ-' + thisDesktop]))
					localStorage['highestZ-' + thisDesktop] = row['zindex'];
			}
		}, function(tx, error) {
			alert('Failed to retrieve notes from database - ' + error.message);
			return;
		});
	});
}

function selectNotes()
{
	db.transaction(function(tx) {
		var thisDesktop = document.getElementById("desktop").value;
		tx.executeSql("SELECT COUNT(*) FROM WebkitStickyNotes", [], function(tx, result) {
			console.log("Current noted db contains "+result.rows.length+" items");
		}, function(tx, error) {
			alert('Failed to retrieve notes from database - ' + error.message);
			return;
		});
	});
}

function deleteNotes()
{	
	//delete only if the desktop is main
	var deskID = document.getElementById("desktop").value;
	console.log("deskID: "+deskID);
	if (deskID != "uwm") {
		return;
	}
	
	console.log("deleteNotes()");
	db.transaction(function(tx)
	{	
		console.log("Deleting entries for all desktops");
		tx.executeSql("DELETE FROM WebKitStickyNotes");
		alertify.log("Successful delete entries!");
	});
		
}

function modifiedString(date)
{
	return 'Last Modified: ' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}

function newNote()
{
	
	var ed = document.getElementById("desktop");
	var thisDesktop = ed.value;
	console.log("thisDesktop: "+thisDesktop);
	console.log("highestId: "+localStorage['highestId' + thisDesktop]);
	
	var note = new Note();
	note.id = parseInt(localStorage['highestId' + thisDesktop]) + 1;
	localStorage['highestId' + thisDesktop] = note.id;
	note.desktop = thisDesktop;
	note.timestamp = new Date().getTime();
	note.left = Math.round(Math.random() * 400) + 'px';
	note.top = Math.round(Math.random() * 500) + 'px';
	note.zIndex = parseInt(localStorage['highestZ-' + thisDesktop]) + 1;
	localStorage['highestZ-' + thisDesktop] = note.zIndex;
	note.saveAsNew();
	//sound
	soundNote();
	console.log("Inserted new note: "+note);
}

function soundNote() {
	
	var aSound = document.createElement('audio');
	var root = location.protocol + '//' + location.host;
	
	soundManager.createSound({
		id: 'mySoundHN',
		volume: 50,
		url: root + "/audio/showHide.ogg"
	});
	playSound('mySoundHN');
	
};

function soundDelNote() {
	
	var aSound = document.createElement('audio');
	var root = location.protocol + '//' + location.host;
	
	soundManager.createSound({
		id: 'mySoundCN',
		volume: 50,
		url: root + "/audio/closeWindow.ogg"
	});

	playSound('mySoundCN');
	
};

function newNoteMU(mText)
{
	var ed = document.getElementById("desktop");
	var thisDesktop = ed.value;
	
	console.log("thisDesktop: "+thisDesktop);
	console.log("highestId: "+localStorage['highestId' + thisDesktop]);
	
	var note = new Note();
	note.id = pareInt(localStorage['highestId' + thisDesktop]) + 1;
	localStorage['highestId' + thisDesktop] = note.id;
	note.desktop = "desktop0";
	note.text = mText
	note.timestamp = new Date().getTime();
	note.left = Math.round(Math.random() * 400) + 'px';
	note.top = Math.round(Math.random() * 500) + 'px';
	note.zIndex = parseInt(localStorage['highestZ-' + thisDesktop]) + 1;	
	localStorage['highestZ-' + thisDesktop] = note.zIndex;
	note.saveAsNew();
}

function syncNotes()
{
	var emString = "";
	if (FL_UPDATE == false) {
		return;
	}
	db.transaction(function(tx) {
		tx.executeSql("SELECT id, desktop, note, timestamp, left, top, zindex FROM WebKitStickyNotes", [], function(tx, result) {
			for (var i = 0; i < result.rows.length; ++i) {
				var row = result.rows.item(i);
	
				var note_id = row['id'];
				var note_desktop = row['desktop'];
				var note_text = row['note'];
				var note_timestamp = row['timestamp'];
				var note_left = row['left'];
				var note_top = row['top'];
				var note_zIndex = row['zindex'];
				var urlParms = "&dbName=" + dbName + "&desktop=" + note_desktop + "&dName=" + en.value + "&note_id=" + note_id + "&note_text=" + note_text + "&note_timestamp=" + note_timestamp + "&note_left=" + note_left + "&note_top=" + note_top + "&note_zIndex=" + note_zIndex;
				
			  if (window.XMLHttpRequest)
			  {// code for IE7+, Firefox, Chrome, Opera, Safari
				xhrn=new XMLHttpRequest();
			  }
			  else
			  {// code for IE6, IE5
				xhrn=new ActiveXObject('MSXML2.XMLHTTP.3.0');
			  }
			  xhrn.open("POST", "/people?PEOPLE_FUNC=SYNC_NOTE" + urlParms, true);
			  xhrn.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');

			  if (em.value == "full") {
				xhrn.send();
			  }
			  
			  emString += "\r\n" + note_desktop + "-" + note_id + ": " + note_text;

			  xhrn.onloadend = function () {
				syncCtr = syncCtr + 1;
			  };
				
			}

			if (syncCtr > 0) {
			    alertify.success("All Notes synced to Gmail.");
				syncCtr = 0;
			}

			FL_UPDATE = false;
		}, function(tx, error) {
			alert('Failed to retrieve notes from database - ' + error.message);
			return;
		});
	});
}

addEventListener('load', loaded, false); 
