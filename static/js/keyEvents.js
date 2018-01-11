addEventListeners();

function handleBodyKeyDown(event) {
  // If we're in a code element, only handle pgup/down.
  var inCode = event.target.classList.contains("code");

  switch (event.keyCode) {
	case 191: //forward slash key
		dispSearch();
		event.preventDefault();
		break;
		
	case 222: //sharp key
		uwmArrWin();
		event.preventDefault();
		break;
		
	case 187: //plus key
		uwmOnOff();
		event.preventDefault();
		break;
		
	case 189: //minus key
		uwmOnOff();
		event.preventDefault();
		break;
		
	case 39: //right arrow key
		nextWp();
		event.preventDefault();
		break;
		
	case 39: //right arrow key
		nextWp();
		event.preventDefault();
		break;
		
	case 32: //space key
		musicOnOff();
		event.preventDefault();
		break;
		
	case 9: //tab key
		winOnOff();
		event.preventDefault();
		break;
		
	case 27: //escape key
		uwmQuickSearch();
		event.preventDefault();
		break;

  }
};

function addEventListeners() {
  document.addEventListener('keydown', handleBodyKeyDown, false);
};

function removeEventListeners() {
  document.removeEventListener('keydown', handleBodyKeyDown, false);
};

function dispSearch() {

	var url = "/tools?t=QUICK_SEARCH";
	alertify.set({ delay: 59000 });
	alertify.error("<iframe src=\"" + url + "\" frameborder=\"0\" scrolling=\"yes\" allowtransparency=\"true\" height=\"400px\"></iframe>");
	
}
