/*Oppgave.2*/
/*Oppgave.3*/
/*Oppgave.4*/
/*Oppgave.5*/

//tar inn toalett- JSON dokumentet
var object = null;

function startProgram(callback, url) {
  var obj = null;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("type",
        xhr.getResponseHeader("Content-Type"));
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}
//Tar JSON dokumentet og tar det inn i en Array
function noe(obj) {
  object = obj["entries"];
  createList(obj);

}
window.onload = function() {
  startProgram(noe, "https://hotell.difi.no/api/json/bergen/dokart?");

  initMap();
}
//lager map med markers. Gir koordinaer sånn at kartet vet hvor de skal vise kartet og hvor nært det er
var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('Map'), {
    zoom: 13,
    center: new google.maps.LatLng(60.388076, 5.334937)
  });

  function addMarker(coords, map) {}
}
//Lager RegExp for å filtrere igjennom det som blir skrevet  inn i søkefeltet.
//Gjør også avansert søk brukbart
function hurtigSok() {
  text = document.getElementById("myInput").value

  kjønn = /kjønn:([a-zA-ZæøåÆØÅ]+)/g
  pris = /pris:(\d+)/g
  plass = /plass:([\w\sæøåÆØÅ]+)/g
  place = /place:([a-zA-Z]+)/g
  tid_sondag = /tid_sondag:(\d+)/g
  tid_hverdag = /tid_hverdag:(\d+)/g
  tid_lordag = /tid_lordag:(\d+)/g
  pissoir_only = /pissoir_only:([a-zA-Z]+)/g
  stellerom = /stellerom:([a-zA-Z\d]+)/g
  rullestol = /rullestol:([a-zA-Z\d]+)/g
  adresse = /adresse:([a-zA-Z\d]+)/g


  var searchObject = {};
  var all_tests = [kjønn, pris, plass, place, tid_sondag, tid_hverdag, tid_lordag, pissoir_only, stellerom, rullestol, adresse];
  for (let i = 0; i < all_tests.length; i++) {
    if (text.match(kjønn)) {
      gender = text.match(kjønn)[0].split(":")[1];

      if (gender == "dame")
        searchObject[gender] = "1";

      if (gender == "herre")
        searchObject[gender] = "1";
    }
    if (text.match(pris)) {
      searchObject["pris"] = text.match(pris)[0].split(":")[1];
    }
    if (text.match(adresse)) {
      searchObject["adresse"] = text.match(adresse)[0].split(":")[1];
    }
    if (text.match(plass)) {
      searchObject["plassering"] = text.match(plass)[0].split(":")[1];
    }
    if (text.match(place)) {
      searchObject["place"] = text.match(place)[0].split(":")[1];
    }
    if (text.match(tid_sondag)) {
      searchObject["tid_sondag"] = text.match(tid_sondag)[0].split(":")[1];
    }
    if (text.match(tid_hverdag)) {
      searchObject["tid_hverdag"] = text.match(tid_hverdag)[0].split(":")[1];
    }
    if (text.match(tid_lordag)) {
      searchObject["tid_lordag"] = text.match(tid_lordag)[0].split(":")[1];
    }
    if (text.match(pissoir_only)) {
      searchObject["pissoir_only"] = text.match(pissoir_only)[0].split(":")[1];
    }
    if (text.match(stellerom)) {
      searchObject["stellerom"] = text.match(stellerom)[0].split(":")[1];
    }
    if (text.match(rullestol)) {
      searchObject["rullestol"] = text.match(rullestol)[0].split(":")[1];
    }
  }
  if (document.getElementById("maksPris").value > 0) {
    searchObject["maksPris"] = document.getElementById("maksPris").value;
  }
  if (document.getElementById("gender").value == "Herre") {
    searchObject.herre = "1";
  } else if (document.getElementById("gender").value == "Dame") {
    searchObject.dame = "1";
  }
  if (document.getElementById("Klokkeslett").value) {
    searchObject["klokkeslett"] = document.getElementById("Klokkeslett").value;
  }
  if (document.getElementById("rullestolTilgang").checked) {
    searchObject.rullestol = "1";
  }
  if (document.getElementById("stelleromTilgang").checked) {
    searchObject.stellerom = "1";
  }
  if (document.getElementById("free").checked) {
    searchObject.pris = "0";
  }
  if (document.getElementById("open_now").checked) {
    var today = new Date();
    var Klokkeslett = today.getHours() + "." + today.getMinutes();
    var today = today.getDay()
    if (today == 6) {
      searchObject.open_now = Klokkeslett;
      searchObject.day = "tid_lordag";
    } else if (today == 0) {
      searchObject.open_now = Klokkeslett;
      searchObject.day = "tid_sondag";
    } else if (today > 0 && today < 6) {
      searchObject.open_now = Klokkeslett;
      searchObject.day = "tid_hverdag";
    }

  }
  var results = search(searchObject);
  createList(results);
}


//Gjør at søkeobjektene kommer ut korrekt
function search(searchObject) {
  var all_tests = [];
  var searchParams = Object.keys(searchObject);
  for (let i = 0; i < object.length; i++) {
    var truthChecker = [] // will contain boolean values "true" for each param checked.
    for (y = 0; y < searchParams.length; y++) {
      if (searchParams[y] == "pris") {
        if (searchObject.pris == "0" && object[i][searchParams[y]] == "NULL") {
          truthChecker.push(true);
        } else {
          truthChecker.push(searchObject.pris === object[i].pris);
        }
      }
      if (searchParams[y] === 'rullestol') {
        truthChecker.push(searchObject.rullestol === object[i].rullestol);
      }
      if (searchParams[y] === 'stellerom') {
        truthChecker.push(searchObject.stellerom === object[i].stellerom);
      }
      if (searchParams[y].includes("open_now")) {
        var today = new Date();
        var day = today.getDay();
        var currentTime = searchObject[searchParams[y]]
        var currentTimeMinutes = klokke1(currentTime);
        var objectTime = getTodaysTime(object[i], day);

        var hours = today.getHours();
        var minutes = today.getMinutes() + (hours * 60);

        if (objectTime.open == "always") {
          truthChecker.push(true);
        } else if (objectTime.open == "closed") {
          truthChecker.push(false);
        } else {
          truthChecker.push(minutes > objectTime.open && minutes < objectTime.close)
        }
      }
      if (searchParams[y] === 'dame') {
        truthChecker.push(searchObject.dame === object[i].dame);
      }
      if (searchParams[y] === 'herre') {
        truthChecker.push(searchObject.herre === object[i].herre);
      }
      if (searchParams[y] === 'plassering') {
        truthChecker.push(searchObject.plassering.toLowerCase() === object[i].plassering.toLowerCase());
      }
      if (searchParams[y] === 'maksPris') {
        truthChecker.push(object[i].pris <= searchObject.maksPris);
      }
      if (searchParams[y] === 'klokkeslett') {
        var today = new Date();
        var day = today.getDay();
        var totalMin = klokke1(searchObject.klokkeslett);

        if (day == 6) {
          searchObject.open_now = Klokkeslett;
          var objectOpen = klokke1(object[i]["tid_lordag"]);
          var objectClose = klokke1(object[i]["tid_lordag"]);

        } else if (day == 0) {
          searchObject.open_now = Klokkeslett;
          searchObject.day = "tid_sondag";
          var objectOpen = klokke1(object[i]["tid_sondag"]);
          var objectClose = klokke1(object[i]["tid_sondag"]);

        } else if (day > 0 && day < 6) {
          searchObject.open_now = Klokkeslett;
          searchObject.day = "tid_hverdag";
          var objectOpeningTime = object[i]["tid_hverdag"];
          var objectOpeningMinutes = parseTime(objectOpeningTime);
          if (objectOpeningMinutes.open === "always") {
            truthChecker.push(true);
          } else if (objectOpeningMinutes.open === "closed") {
            truthChecker.push(false);
          } else {
            console.log(totalMin > objectOpeningMinutes.open &&
              totalMin < objectOpeningMinutes.close)
            truthChecker.push(totalMin > objectOpeningMinutes.open &&
              totalMin < objectOpeningMinutes.close);
          }
        }
      }
    }


    var match = true;
    truthChecker.forEach(function(boolean) {
      if (!boolean) {
        match = boolean;
      }
    });

    if (match) {
      all_tests.push(object[i]);
    }
  }
  return all_tests;
}

function getTodaysTime(object, day) {
  if (day > 0 && day < 6) {
    return parseTime(object.tid_hverdag);
  }
}
//gjør at verdier som ALL og NUll også kommer opp
function parseTime(time) {
  if (time === "ALL") {
    return {
      open: "always"
    }
  } else if (time === "NULL") {
    return {
      open: "closed"
    }
  }
  var open = time.split(" - ")[0]
  var close = time.split(" - ")[1]

  var openHour = parseInt(open.split(".")[0])
  var openMin = (parseInt(open.split(".")[1])) + (openHour * 60);
  var closeHour = parseInt(close.split(".")[0])
  var closeMin = (parseInt(close.split(".")[1])) + (closeHour * 60);

  return {
    open: openMin,
    close: closeMin
  }
}

function klokke1(klokke) {
  if (klokke.includes(":")) {
    var openHour = parseInt(klokke.split(":")[0])
    var openMin = (parseInt(klokke.split(":")[1])) + (openHour * 60);
  } else {
    var openHour = parseInt(klokke.split(".")[0])
    var openMin = (parseInt(klokke.split(".")[1])) + (openHour * 60);
  }
  return openMin;
}
//lager objektene i en nummerert liste
function createList(list) {
  document.getElementById("toalettene").innerHTML = "";
  for (let i = 0; i < markers.length; i++)
    markers[i].setMap(null);

  for (let i = 0; i < list.length; i++) { //for-løkke som har variablen i som har verien 0.
    //Om i er mindre enn object sin lengde så skal i øke med 1.


    var node = document.createElement("LI"); //lager en node som en liste
    var textnode = document.createTextNode(list[i].plassering); //lage en textnode der object befinner seg i.
    node.appendChild(textnode); //går inn i textnoden.
    document.getElementById("toalettene").appendChild(node); //finner id-til object og skriver ut nodene til appendChild.

    lati = parseFloat(list[i].latitude);
    longi = parseFloat(list[i].longitude);

    markerLabel = object.id;
    latlng = new google.maps.LatLng({
      lat: lati,
      lng: longi
    });

    var marker = new google.maps.Marker({
      position: latlng,
      animation: google.maps.Animation.DROP,
      map: map,
      label: {
        text: i + 1 + "",
        color: "white"
      }
    });
    markers.push(marker);
  }
}
