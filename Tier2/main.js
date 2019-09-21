// Change the font size of sample texts when the fontSize select is changed.
function changeFontSize(event){
  let fontCards = document.querySelectorAll(".font-card-sample > p");

  for (let i=0; i < fontCards.length; i++) {
    fontCards[i].style.fontSize = `${event.target.value}px`;
  }
}

// Change the content of sample texts when the fontSize select is changed.
function changeSampleText(event){
  let fontCards = document.querySelectorAll(".font-card-sample > p");

  if(event.target.value != ""){
    for (let i=0; i < fontCards.length; i++) {
      fontCards[i].innerText = `${event.target.value}`;
    }
  } else {
    for (let i=0; i < fontCards.length; i++) {
      fontCards[i].innerText = `Then came the night of the first falling star.`;
    }
  }
}

// Change form dark mode to light, and the reverse
function changeColorMode(mode) {
  if(mode == "white"){
    document.documentElement.style.setProperty("--mode-color-background", "white");
    document.documentElement.style.setProperty("--mode-color-foreground", "black");
  } else {
    document.documentElement.style.setProperty("--mode-color-background", "black");
    document.documentElement.style.setProperty("--mode-color-foreground", "white");
  }
}

// When header is 75% or more out of the viewport, display the "to top" button
let options = {
  root: null,
  rootMargin: "0px",
  threshold: [.75]
}

function showToTop(entry) {
  let div = document.querySelector("#to-top");
  entry[0].isIntersecting ? div.style.display = "none" : div.style.display = "block";
}

let observer = new IntersectionObserver(showToTop, options);
observer.observe(document.querySelector("header"));

// Click function for Scrolling to Top when #to-top is clicked
function scrollToTop(){
  window.scroll({
    top: 0,
    left: 0,
    behavior: 'smooth'
  });
}

// Toggle List and Grid View and Icons
function toggleView(isReset){
  let fontCards = document.querySelectorAll(".font-card");
  for (let i = 0; i < fontCards.length; i++){
    if (fontCards[i].classList.contains("list") || isReset) {
      fontCards[i].classList.remove("list");
      document.querySelector("#grid-icon").classList.add("hide");
      document.querySelector("#list-icon").classList.remove("hide");
    } else {
      fontCards[i].classList.add("list");
      document.querySelector("#list-icon").classList.add("hide");
      document.querySelector("#grid-icon").classList.remove("hide");
    }
  }
}

// Reset Button
function resetPage() {

  let textResetEvent = {
    target: {
      value: ""
    }
  }

  let sizeResetEvent = {
    target: {
      value: 32
    }
  }

  document.querySelector("#custom-text").value = "";
  changeSampleText(textResetEvent);
  document.querySelector("#selected-font-size").selected = true;
  changeFontSize(sizeResetEvent);
  changeColorMode("white");
  toggleView(true);
}


//  ------- TIER 2 REQUIREMENTS -------  //


//  Global Variables for Calling and Displaying Fonts
let key = 'AIzaSyBqfUHvXPiHKcQc9KeWA7tVqT05-rHMWHM'
let endpoint = 'https://www.googleapis.com/webfonts/v1/webfonts?'
let sortBy = 'sort=popularity';
let fontsData;
let currentStartingIndex = 0;
let currentFonts = [];
let searchArr = [];
let lazyLoadObserver;


// Get All Fonts
function getFonts(){
  fetch(`${endpoint}key=${key}&${sortBy}`)
    .then((resp) => resp.json())
    .then(function(data) {
      fontsData = data.items;
      setSearchArr();
      initiateLazyLoading();
      setDisplay();
    })
    .catch((error) => console.log(error));
}

getFonts();

// Pagination
function pagination(){
  let fontDisplayNumber = currentStartingIndex + 7;
  currentFonts = [];
  for(let i = currentStartingIndex; (i < fontDisplayNumber) && (i <= (fontsData.length - 1)); i++){
    currentFonts.push(fontsData[i].family)
    currentStartingIndex++;
  }
}


// Create StyleSheet URL
function createStyleSheet(){
  let apiURL = [];
  apiURL.push('http://fonts.googleapis.com/css?family=');

  if(currentFonts.length > 1){
    for(let i = 0; i < currentFonts.length; i++){
      apiURL.push(currentFonts[i].replace(/ /g, '+'));
      (i != currentFonts.length - 1) ? apiURL.push('|') : null;
    }
  } else {
    apiURL.push(currentFonts[0].replace(/ /g, '+'));
  }

  return apiURL.join('');
}


// Insert StyleSheet URL
function insertStyleSheet(url, type = 'normal'){
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


function createFontCard(name, sampleText){
  document.querySelector('#custom-text').value != "" ? sampleText = document.querySelector('#custom-text').value : null;

  let fontCard = document.createElement('div');
  fontCard.classList = 'font-card';

  let fontCardInfo = document.createElement('div');
  fontCardInfo.classList = 'font-card-info'

  let h2 = document.createElement('h2');
  h2.innerText = name;

  let addFont = document.createElement('p');
  addFont.classList = 'add-font';
  addFont.innerText = '+'

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


function insertFontCards(){
  currentFonts.forEach(function(font){
    fontCardContainer.appendChild(createFontCard(font, sampleText));
  })
}


function setDisplay(){
  currentFonts == 
  pagination();
  insertStyleSheet(createStyleSheet());
  insertFontCards();
}

function clearDisplay(type = 'search'){
  document.querySelector('#font-card-container').innerText = '';
  let styleSheets = document.querySelectorAll('link[class=' + type + ']');
  for(let i = 0; i < styleSheets.length; i++){
    styleSheets[i].remove();
  }
}


// Lazy Loading
let whichArray = 'fontsData';
let lazyLoadOptions = {
  root: null,
  rootMargin: "0px",
  threshold: [0]
}


function loadMoreFonts(entry) {
  let div = document.querySelector("footer");

  if(whichArray == 'fontsData'){
    (entry[0].isIntersecting) && (currentStartingIndex < fontsData.length - 1) ? setDisplay() : null;
  } else {
    if(currentFonts != undefined){
      (entry[0].isIntersecting) && (currentStartingIndex < currentFonts.length - 1) ? searchPagination() : null;
    }
  }
}


function initiateLazyLoading() {
  lazyLoadObserver = new IntersectionObserver(loadMoreFonts, lazyLoadOptions);
  lazyLoadObserver.observe(document.querySelector("footer"));
};


// Search Fonts Feature
function setSearchArr() {
  fontsData.forEach(font => searchArr.push(font.family));
}


function search(event){
  let searchString = event.target.value.toLowerCase();
  
  if(searchString.length > 0){
    let searchRegEx = new RegExp(searchString + '+');
    let searchReturnArr = [];
    whichArray = 'currentFonts';
    searchArr.forEach(function(font){
      font.toLowerCase().search(searchRegEx) != -1 ? searchReturnArr.push(font) : null;
    });
    if(searchReturnArr.length == 0){
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

function populateSearch(event){
  clearDisplay('normal');
  currentStartingIndex = 0;
  currentFonts = search(event);
  currentFonts != undefined ? searchPagination() : null;
}

function searchPagination(){
  currentStartingIndex = currentFonts.length;
  insertStyleSheet(createStyleSheet('search'));
  insertFontCards();
}