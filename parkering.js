/*Oppgave.10*/
var updatedObject = [];
var object = [];
//tar inn parkering- JSON dokumentet
function startProgram(callback, url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("type")
      xhr.getResponseHeader("Content-Type");
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send();
}

function noe(obj) {
  object = obj;
  updatedObject = object;
  addMarker();

}
window.onload = function() {
  startProgram(noe, "https://opencom.no/dataset/36ceda99-bbc3-4909-bc52-b05a6d634b3f/resource/d1bdc6eb-9b49-4f24-89c2-ab9f5ce2acce/download/parking.json");

  initMap();
}

var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('Map'), {
    zoom: 13,
    center: new google.maps.LatLng(58.970628, 5.738697),
  });
}
//legger til markørene for hver parkering med nummer
function addMarker() {
  document.getElementById("parkering").innerHTML = "";
  for (let i = 0; i < markers.length; i++)
    markers[i].setMap(null);

  for (let i = 0; i < updatedObject.length; i++) { //for-løkke som har variablen i som har verien 0.
    //Om i er mindre enn object sin lengde så skal i øke med 1.

    console.log(updatedObject[i]["Sted"]); //skriver ut til consolen

    var node = document.createElement("LI"); //lager en node som en liste
    var textnode = document.createTextNode(updatedObject[i]["Sted"]); //lage en textnode der object befinner seg i.
    node.appendChild(textnode); //går inn i textnoden.
    document.getElementById("parkering").appendChild(node); //finner id-til object og skriver ut nodene til appendChild.

    lati = parseFloat(updatedObject[i]["Latitude"]);
    longi = parseFloat(updatedObject[i]["Longitude"]);

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



//Her begynner hurtigsøk. Vår ikke-trivielle interaksjon.

//Lager RegExp for å filtrere igjennom det som blir skrevet  inn i søkefeltet.
function hurtigSok() {
  text = document.getElementById("myInput").value

  dato = /dato:(\d+)/g
  klokkeslett = /klokkeslett:(\d+)/g
  sted = /sted:([a-zA-Z]+)/g
  latitude = /latitude:(\d+)/g
  longitude = /longitude:(\d+)/g
  ledige_plasser = /ledige_plasser:(\d+)/g

  var searchObject = {};
  var all_tests = [dato, klokkeslett, sted, latitude, longitude, ledige_plasser];
  for (let i = 0; i < all_tests.length; i++) {


    if (text.match(dato)) {
      searchObject["Dato"] = text.match(dato)[0].split(":")[1];
    }
    if (text.match(klokkeslett)) {
      searchObject["Klokkeslett"] = text.match(klokkeslett)[0].split(":")[1];
    }
    if (text.match(sted)) {
      searchObject["Sted"] = text.match(sted)[0].split(":")[1];
    }
    if (text.match(latitude)) {
      searchObject["Latitude"] = text.match(latitude)[0].split(":")[1];
    }
    if (text.match(longitude)) {
      searchObject["Longitude"] = text.match(longitude)[0].split(":")[1];
    }
    if (text.match(ledige_plasser)) {
      searchObject["Antall_ledige_plasser"] = text.match(ledige_plasser)[0].split(":")[1];
    }
  }

  results = search(searchObject);
}
//Gjør at søkeobjektene kommer ut korrekt
function search(searchObject) {
  updatedObject = object;
  var all_tests = [];
  var searchParams = Object.keys(searchObject);
  console.log(searchParams);
  for (i = 0; i < updatedObject.length; i++) {
    var truthChecker = [] // will contain boolean values "true" for each param checked.
    for (y = 0; y < searchParams.length; y++) {
      if (updatedObject[i][searchParams[y]].toLowerCase() == searchObject[searchParams[y]].toLowerCase()) {
        truthChecker.push(true);
      }
      if (truthChecker.length == searchParams.length) { //if all params are true, object will be pushed.
        all_tests.push(updatedObject[i]);
      }
    }
  }

  updatedObject = all_tests;
  if (all_tests.length < 1) {
    addMarker();
    emptyResults();
  } else {
    addMarker();
  }

}
//gir beskjed om det ikke kommer et treff på søket
function emptyResults() {
  var node = document.createElement("LI"); //lager en node som en liste
  var textnode = document.createTextNode("Vi fant dessverre ikke noe..."); //lage en textnode der object befinner seg i.
  node.appendChild(textnode); //går inn i textnoden.
  document.getElementById("parkering").appendChild(node); //finner id-til object og skriver ut nodene til appendChild.
}
