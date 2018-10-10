let latAndLong;
let locationName;
let hamburgerMode = false
let menu = 'closed'
let forecastInfo;
let showLoading = true;

window.addEventListener('resize', respond);
document.getElementById('hamburger').addEventListener('click', openMenu)


function clickToday() {
    toggleHamburger();
    normalizeButtons();
    hideEverything();
    document.getElementById("todayDiv").style = "display: block;"
    document.getElementById("date").style = "display: block;"
    document.getElementById("today").style = "background-color: black; color: seashell;"
}

function clickLemmaSearch() {
    toggleHamburger();
    normalizeButtons();
    hideEverything();
    document.getElementById("lemmaSearchDiv").style = "display: block;"
    document.getElementById("lemmaSearch").style = "background-color: black; color: seashell;"
}

function clickDateSearch() {
    toggleHamburger();
    normalizeButtons();
    hideEverything();
    document.getElementById("dateSearchDiv").style = "display: block;"
    document.getElementById("dateSearch").style = "background-color: black; color: seashell;"
}

function clickForecast() {
    toggleHamburger();
    normalizeButtons();
    hideEverything();
    document.getElementById("forecastDiv").style = "display: block;"
    document.getElementById("forecast").style = "background-color: black; color: seashell;"
}

function clickLearnMore() {
    toggleHamburger();
    normalizeButtons();
    hideEverything();
    document.getElementById("learnMoreDiv").style = "display: block;"
    document.getElementById("learnMore").style = "background-color: black; color: lightgrey;"
}

function normalizeButtons() {
    document.getElementById("today").style = "background-color: lightblue; color: black;";
    document.getElementById("lemmaSearch").style = "background-color: lightblue; color: black;";
    document.getElementById("dateSearch").style = "background-color: lightblue; color: black;";
    document.getElementById("forecast").style = "background-color: lightblue; color: black;";
    document.getElementById("learnMore").style = "background-color: lightblue; color: black;";
}

function hideEverything() {
    document.getElementById("todayDiv").style = "display:none"
    document.getElementById("lemmaSearchDiv").style = "display:none"
    document.getElementById("dateSearchDiv").style = "display:none"
    document.getElementById("forecastDiv").style = "display:none"
    document.getElementById("learnMoreDiv").style = "display:none"
    document.getElementById("date").style = "display:none"
}

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}
today = mm + "/" + dd;

function printBrontoscope() {
    document.getElementById("text").innerHTML = calendar[today];
}

function printGrkBrontoscope() {
    document.getElementById("grkText").innerHTML = grkCalendar[today];
}

function printDate() {
    document.getElementById('dateHere').innerHTML = today
    document.getElementById("date").innerHTML = " Today's Brontoscope:";
}

function searchFunctions() {
    searchFunction()
    grkSearchFunction()
}

function searchFunction() {
    searchDate = document.getElementById("search").value;
    document.getElementById("searchDateHere").innerHTML = searchDate
    if (calendar[searchDate]) {
        document.getElementById("searchResult").innerHTML = calendar[searchDate];
    } else {
        document.getElementById("searchResult").innerHTML = "Not a valid date; please follow the mm/dd. Note that the Etruscan Brontoscopic Calendar is comprised of twelve months of thirty days"
    }
}

function grkSearchFunction() {
    grkSearchDate = document.getElementById("search").value;
    if (calendar[searchDate]) {
        document.getElementById("grkSearchResult").innerHTML = grkCalendar[grkSearchDate];
    } else {
        document.getElementById("grkSearchResult").innerHTML = ""
    }
}

function lemmaSearch() {
    document.getElementById('lemmaSearchResultDiv').innerHTML = '';
    let lemma = document.getElementById("lemmaSearchID").value;
    for (let date in calendar) {
        if (calendar[date].includes(lemma) || grkCalendar[date].includes(lemma)) {
            let datum = document.createElement('p')
            datum.textContent = date

            let list = document.createElement('ul')

            let lemmaParagraph = document.createElement('li');
            lemmaParagraph.textContent = calendar[date];

            let grkLemmaParagraph = document.createElement('li')
            grkLemmaParagraph.textContent = grkCalendar[date];

            document.getElementById('lemmaSearchResultDiv').appendChild(datum);
            document.getElementById('lemmaSearchResultDiv').appendChild(list);
            list.appendChild(lemmaParagraph)
            list.appendChild(grkLemmaParagraph)
            document.getElementById('lemmaSearchResultDiv').innerHTML += '<hr>'

        }
    }
    highlightLemma();
}

function highlightLemma() {
    let lemma = document.getElementById("lemmaSearchID").value;
    let regex = new RegExp(lemma, 'ig')
    document.getElementById('lemmaSearchResultDiv').innerHTML = document.getElementById('lemmaSearchResultDiv').innerHTML.replace(regex, '<span class="red">' + lemma + '</span>')
}

function geolocate() {
    navigator.geolocation.getCurrentPosition(success, error);
}

function success(position) {
    latAndLong = position.coords.latitude + "," + position.coords.longitude;
    console.log(latAndLong);
    fetchPlaceName();
    fetch("https://api.weather.gov/points/" + latAndLong + "/forecast")
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            forecastInfo = jsonResponse;
            console.log('jsonResponse:', forecastInfo);
            showForecast(jsonResponse, "thunder")
            return jsonResponse;
        })
}
function error(PositionError){
   console.log(PositionError.message)
}

function showForecast(forecastInfo, string) {
    if (document.getElementById('loading')) {
        showLoading = false;
        document.getElementById('loading').style.display = 'none'
    }
    let displayDiv = document.getElementById("forecastDisplayDiv");
    let days = forecastInfo.properties.periods;
    let heading = document.createElement('p');
    heading.setAttribute('id', 'locationDisplay')
    heading.textContent = "Thunder in the forecast for ";
    displayDiv.appendChild(heading);
    document.getElementById('locationDisplay').textContent += locationName.toUpperCase()

    for (let i = 0; i < days.length; i++) {
        if (days[i].shortForecast.includes(string) || days[i].shortForecast.includes(string.charAt(0).toUpperCase() + string.slice(1))) {
            let p = document.createElement('p');
            let formattedDate = days[i].startTime.slice(5, 10).replace(/\-/gi, '/')
            p.textContent = formattedDate + " (" + days[i].name + "): " + days[i].shortForecast;
            displayDiv.appendChild(p);
            let list = document.createElement('ul')
            displayDiv.appendChild(list)
            let english = document.createElement('li')
            english.textContent = calendar[formattedDate]
            list.appendChild(english)
            let greek = document.createElement('li')
            greek.textContent = grkCalendar[formattedDate]
            list.appendChild(greek)
            displayDiv.innerHTML += '<hr>'
        }
    }
    if (document.getElementById("forecastDisplayDiv").children.length < 3) {
        let noResults = document.createElement('p')
        noResults.innerHTML = 'No ' + string + ' in the forcast. Search instead for <span class="option" onclick="searchSnow()" textDecoration="underline">snow</span> or <span class="option" onclick="searchRain()">rain?</span>'

        document.getElementById("forecastDisplayDiv").appendChild(noResults)
    }
}
function searchSnow() {
    document.getElementById('forecastDisplayDiv').innerHTML = ''
    showForecast(forecastInfo, "snow")
}

function searchRain() {
    document.getElementById('forecastDisplayDiv').innerHTML = ''
    showForecast(forecastInfo, "rain")
}

function fetchPlaceName() {
    fetch("https://reverse.geocoder.api.here.com/6.2/reversegeocode.json?prox=" + latAndLong + secretKeys)
        .then(function (response) {
            return response.json();
        })
        .then(function (jsonResponse) {
            locationName = jsonResponse.Response.View[0].Result[0].Location.Address.Label
            console.log(locationName)

        })
}


function animateLoading() {
        let interval1 = setInterval(function () {
            document.getElementById('loading').textContent += ' . ';
            if (showLoading === false) {
                clearInterval(interval1)
        }}, 250)
        let interval2 = setInterval(function () {
            document.getElementById('loading').textContent = 'Did you allow geolocation? This may take a minute';
            if (showLoading === false){
                clearInterval(interval2)
        }}, 1000)
    }

function respond() {
    let pageWidth = document.documentElement.clientWidth;
    let buttons = document.getElementsByClassName('button');
    if (pageWidth < 760) {
        hamburgerMode = true;
        document.getElementById('container').style.flexDirection = 'column';
        document.getElementById('container').style.display = 'none';
        document.getElementById('container').style.position = 'absolute';
        document.getElementById('container').style.right = '2px';
        document.getElementById('hamburger').style.display = 'inline';
    }
    if (pageWidth > 760) {
        hamburgerMode = false;
        document.getElementById('container').style.flexDirection = 'row';
        document.getElementById('container').style.display = 'flex';
        document.getElementById('container').style.position = '';
        document.getElementById('hamburger').style.display = 'none';
    }
}

function openMenu() {
    if (hamburgerMode) {
        if (menu === 'closed') {
            menu = 'open';
            document.getElementById('container').style.display = 'flex';
        } else if (menu === 'open') {
            document.getElementById('container').style.display = 'none';
            menu = 'closed';
        }
    }
}

function toggleHamburger() {
    if (hamburgerMode === true) {
        document.getElementById('container').style.display = 'none';
        menu = 'closed';

    }
}

function initialize() {
    lemmaSearch();
    searchFunctions();
    geolocate();
    printDate();
    printBrontoscope();
    printGrkBrontoscope();
    clickToday();
    animateLoading();
    respond();
}

initialize()
