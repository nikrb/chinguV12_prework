function saveFavourite(name) {
	console.log('save favourite:', name);
	let fav_endpoint = 'http://localhost:8080/api/favourites';
	fetch(fav_endpoint, {
		method: 'post',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify( { name })
	})
	.then( res => res.json())
	.then(
		results => console.log('fav result:', results)
	);
}
function getFavourites() {
	let fav_ep = "http://localhost:8080/api/favourites";
	fetch(fav_ep)
	.then( res => res.json())
	.then( results => console.log('favourites list:', results));
}

// Change the font size of sample texts when the fontSize select is changed.
function changeFontSize(event) {
	let fontCards = document.querySelectorAll('.font-card-sample > p');

	for (let i = 0; i < fontCards.length; i++) {
		fontCards[i].style.fontSize = `${event.target.value}px`;
	}
}

// Change the content of sample texts when the fontSize select is changed.
function changeSampleText(event) {
	let fontCards = document.querySelectorAll('.font-card-sample > p');

	if (event.target.value != '') {
		for (let i = 0; i < fontCards.length; i++) {
			fontCards[i].innerText = `${event.target.value}`;
		}
	} else {
		for (let i = 0; i < fontCards.length; i++) {
			fontCards[i].innerText = `Then came the night of the first falling star.`;
		}
	}
}

// Change form dark mode to light, and the reverse
function changeColorMode(mode) {
	if (mode == 'white') {
		document.documentElement.style.setProperty('--mode-color-background', 'white');
		document.documentElement.style.setProperty('--mode-color-foreground', 'black');
	} else {
		document.documentElement.style.setProperty('--mode-color-background', 'black');
		document.documentElement.style.setProperty('--mode-color-foreground', 'white');
	}
}

// When header is 75% or more out of the viewport, display the "to top" button
let options = {
	root: null,
	rootMargin: '0px',
	threshold: [0.75],
};

function showToTop(entry) {
	let div = document.querySelector('#to-top');
	entry[0].isIntersecting ? (div.style.display = 'none') : (div.style.display = 'block');
}

let observer = new IntersectionObserver(showToTop, options);
observer.observe(document.querySelector('header'));

// Click function for Scrolling to Top when #to-top is clicked
function scrollToTop() {
	window.scroll({
		top: 0,
		left: 0,
		behavior: 'smooth',
	});
}

// Toggle List and Grid View and Icons
function toggleView(isReset) {
	let fontCards = document.querySelectorAll('.font-card');
	for (let i = 0; i < fontCards.length; i++) {
		if (fontCards[i].classList.contains('list') || isReset) {
			fontCards[i].classList.remove('list');
			document.querySelector('#grid-icon').classList.add('hide');
			document.querySelector('#list-icon').classList.remove('hide');
		} else {
			fontCards[i].classList.add('list');
			document.querySelector('#list-icon').classList.add('hide');
			document.querySelector('#grid-icon').classList.remove('hide');
		}
	}
}

// Reset Button
function resetPage() {
	let textResetEvent = {
		target: {
			value: '',
		},
	};

	let sizeResetEvent = {
		target: {
			value: 32,
		},
	};

	document.querySelector('#custom-text').value = '';
	changeSampleText(textResetEvent);
	document.querySelector('#selected-font-size').selected = true;
	changeFontSize(sizeResetEvent);
	changeColorMode('white');
	toggleView(true);
}

//  ------- TIER 2 REQUIREMENTS -------  //

//  Global Variables for Calling and Displaying Fonts
let key = 'AIzaSyBqfUHvXPiHKcQc9KeWA7tVqT05-rHMWHM';
let endpoint = 'https://www.googleapis.com/webfonts/v1/webfonts?';
let sortBy = 'sort=popularity';
let fontsData;
let currentStartingIndex = 0;
let currentFonts = [];
let searchArr = [];
let lazyLoadObserver;

// Get All Fonts
function getFonts() {
	fetch(`${endpoint}key=${key}&${sortBy}`)
		.then(resp => resp.json())
		.then(function(data) {
			fontsData = data.items;
			setSearchArr();
			initiateLazyLoading();
			setDisplay();
		})
		.catch(error => console.log(error));
}

getFonts();

// Pagination
function pagination() {
	let fontDisplayNumber = currentStartingIndex + 7;
	currentFonts = [];
	for (let i = currentStartingIndex; i < fontDisplayNumber && i <= fontsData.length - 1; i++) {
		currentFonts.push(fontsData[i].family);
		currentStartingIndex++;
	}
}

// Create StyleSheet URL
function createStyleSheet() {
	let apiURL = [];
	apiURL.push('https://fonts.googleapis.com/css?family=');

	if (currentFonts.length > 1) {
		for (let i = 0; i < currentFonts.length; i++) {
			apiURL.push(currentFonts[i].replace(/ /g, '+'));
			i != currentFonts.length - 1 ? apiURL.push('|') : null;
		}
	} else {
		apiURL.push(currentFonts[0].replace(/ /g, '+'));
	}

	return apiURL.join('');
}

// Insert StyleSheet URL
function insertStyleSheet(url, type = 'normal') {
	let link = document.createElement('link');
	link.setAttribute('class', type);
	link.setAttribute('rel', 'stylesheet');
	link.setAttribute('href', url);

	document.querySelector('#font-card-container').appendChild(link);
}

// .font-card creator

/*
Here's what the div should look like:
<div class="font-card">
  <div class="font-card-info">
    <h2>Roboto</h2>
    <p class="add-font">+</p>
  </div>
  <div class="font-card-sample">
    <p style="font-family:Roboto">Then came the night of the first falling star.</p>
  </div>
</div>
*/

let fontCardContainer = document.querySelector('#font-card-container');
let sampleText = 'Then came the night of the first falling star.';

function createFontCard(name, sampleText) {
	document.querySelector('#custom-text').value != ''
		? (sampleText = document.querySelector('#custom-text').value)
		: null;

	let fontCard = document.createElement('div');
	fontCard.classList = 'font-card';

	let fontCardInfo = document.createElement('div');
	fontCardInfo.classList = 'font-card-info';

	let h2 = document.createElement('h2');
	h2.innerText = name;

	let addFont = document.createElement('p');
	addFont.classList = 'add-font';
	addFont.innerText = '+';
	addFont.onclick = function(e) {
		saveFavourite(name);
	};

	let fontCardSample = document.createElement('div');
	fontCardSample.classList = 'font-card-sample';

	let sampleTextDiv = document.createElement('p');
	sampleTextDiv.style.fontFamily = name;
	sampleTextDiv.innerText = sampleText;

	fontCardInfo.appendChild(h2);
	fontCardInfo.appendChild(addFont);

	fontCardSample.appendChild(sampleTextDiv);

	fontCard.appendChild(fontCardInfo);
	fontCard.appendChild(fontCardSample);

	return fontCard;
}

function insertFontCards() {
	currentFonts.forEach(function(font) {
		fontCardContainer.appendChild(createFontCard(font, sampleText));
	});
}

function setDisplay() {
	currentFonts == pagination();
	insertStyleSheet(createStyleSheet());
	insertFontCards();
}

function clearDisplay(type = 'search') {
	document.querySelector('#font-card-container').innerText = '';
	let styleSheets = document.querySelectorAll('link[class=' + type + ']');
	for (let i = 0; i < styleSheets.length; i++) {
		styleSheets[i].remove();
	}
}

// Lazy Loading
let whichArray = 'fontsData';
let lazyLoadOptions = {
	root: null,
	rootMargin: '0px',
	threshold: [0],
};

function loadMoreFonts(entry) {
	let div = document.querySelector('#lazy-load');
	if (whichArray == 'fontsData') {
		entry[0].isIntersecting && currentStartingIndex < fontsData.length - 1 ? setDisplay() : null;
	} else {
		if (currentFonts != undefined) {
			entry[0].isIntersecting && currentStartingIndex < currentFonts.length - 1 ? searchPagination() : null;
		}
	}
}

function initiateLazyLoading() {
	lazyLoadObserver = new IntersectionObserver(loadMoreFonts, lazyLoadOptions);
	lazyLoadObserver.observe(document.querySelector('#lazy-load'));
}

// Search Fonts Feature
function setSearchArr() {
	fontsData.forEach(font => searchArr.push(font.family));
}

function search(event) {
	let searchString = event.target.value.toLowerCase();

	if (searchString.length > 0) {
		let searchRegEx = new RegExp(searchString + '+');
		let searchReturnArr = [];
		whichArray = 'currentFonts';
		searchArr.forEach(function(font) {
			font.toLowerCase().search(searchRegEx) != -1 ? searchReturnArr.push(font) : null;
		});
		if (searchReturnArr.length == 0) {
			let p = document.createElement('p');
			p.setAttribute('class', 'no-results');
			p.innerText = "Success is not the absence of failure; it's the persistence through failure.";
			document.querySelector('#font-card-container').appendChild(p);
		}
		return searchReturnArr;
	} else {
		whichArray = 'fontsData';
		currentStartingIndex = 0;
		currentFonts = [];
		clearDisplay('search');
		setDisplay();
	}
}

function populateSearch(event) {
	clearDisplay('normal');
	currentStartingIndex = 0;
	currentFonts = search(event);
	currentFonts != undefined ? searchPagination() : null;
}

function searchPagination() {
	currentStartingIndex = currentFonts.length;
	insertStyleSheet(createStyleSheet('search'));
	insertFontCards();
}

function open_login_window(event) {
	var modal = document.getElementById('myModal');
	var login_block = document.getElementById('login-modal');
	var register_block = document.getElementById('register-modal');
	// Get the button that opens the modal
	var btn = document.getElementById('login-li-btn');

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName('close')[0];

	// When the user clicks the button, open the modal

	modal.style.display = 'block';
	register_block.style.display = 'none';
	login_block.style.display = 'initial';

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = 'none';
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
}

function open_register_window(event) {
	console.log('Executing');
	var modal = document.getElementById('myModal');
	var login_block = document.getElementById('login-modal');
	var register_block = document.getElementById('register-modal');
	// Get the button that opens the modal

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName('close')[0];

	// When the user clicks the button, open the modal

	modal.style.display = 'block';
	register_block.style.display = 'initial';
	login_block.style.display = 'none';

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
		modal.style.display = 'none';
	};

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
		if (event.target == modal) {
			modal.style.display = 'none';
		}
	};
}

let auth_endpoint = 'http://localhost:8080/api/users';
let success_code = 200;

function login(event) {
	//function to login a user
	event.preventDefault();
	let email = document.getElementById('email_login').value;
	let password = document.getElementById('password_login').value;
	console.log(email);
	console.log(password);
	return fetch(auth_endpoint + '/login', {
		method: 'POST',
		body: JSON.stringify({ email: email, password: password }),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(function(data) {
			console.log(data);
			if (data.status === success_code) {
				document.cookie = 'auth=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; path=/';
				location.reload();
			} else {
				document.cookie = 'auth=; expires=Thu, 18 Dec 2012 12:00:00 UTC; path=/';
				alert('Invalid login. Please try again later');
			}
		})
		.catch(error => console.log(error));
}

function register(event) {
	//function to register a user
	event.preventDefault();
	let email = document.getElementById('email_register').value;
	let password = document.getElementById('password_register').value;
	let name = document.getElementById('name_register').value;
	return fetch(auth_endpoint + '/signup', {
		method: 'POST',
		body: JSON.stringify({ email, password, name }),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(function(data) {
			console.log(data);
			if (data.status === success_code) {
				document.cookie = 'auth=true; expires=Thu, 18 Dec 2022 12:00:00 UTC; path=/';
				location.reload();
			} else {
				document.cookie = 'auth=; expires=Thu, 18 Dec 2012 12:00:00 UTC; path=/';
				alert('Invalid login. Please try again later');
			}
		})
		.catch(error => console.log(error));
}

function get_cookies() {
	//returns cookie in form of key-value pair
	let split_array = document.cookie.split(';');
	let cookies = {};
	split_array.forEach(getKeyValue);
	function getKeyValue(element) {
		let pair = element.split('=');
		let key = pair[0];
		let value = pair[1];
		console.log(cookies);
		cookies[key] = value;
	}
	return cookies;
}

function checkIfLoggedIn() {
	//return true if user is logged in, else false
	let cookies = get_cookies();
	if (cookies['auth'] === 'true') {
		console.log('Logged in');
		return true;
	} else {
		console.log('Not logged in');
		return false;
	}
}

window.onload = function() {
	//checks if user is logged in shows 'signed in' or login on navbar
	let loggedIn = checkIfLoggedIn();
	if (loggedIn) {
		document.getElementById('signed-in').style.display = 'block';
		document.getElementById('login-li-btn').style.display = 'none';
	} else {
		document.getElementById('signed-in').style.display = 'none';
		document.getElementById('login-li-btn').style.display = 'block';
	}
};
