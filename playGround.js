/*Oppgave.6*/
//tar inn lekeplass- JSON dokumentet
var object = null;
function startProgram(callback, url) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log("type")
      xhr.getResponseHeader("Content-Type");
      callback(JSON.parse(xhr.responseText));
    }
  }
  xhr.send();
}
//Tar JSON dokumentet og tar det inn i en Array
function noe(obj) {
  object = obj["entries"];
  addMarker();
}
window.onload = function() {
  startProgram(noe, "https://hotell.difi.no/api/json/bergen/lekeplasser?");
  initMap();
}

var map;
var markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById('Map'), {
    zoom: 11,
    center: new google.maps.LatLng(60.388076, 5.334937),
  });
}
//legger til markørene for hver lekeplassog legger til nummer
function addMarker() {
  document.getElementById("lekeplassene").innerHTML = "";
  for (let i = 0; i < markers.length; i++)
    markers[i].setMap(null);

  for (let i = 0; i < object.length; i++) { //for-løkke som har variablen i som har verien 0.
    //Om i er mindre enn object sin lengde så skal i øke med 1.

    var node = document.createElement("LI"); //lager en node som en liste
    var textnode = document.createTextNode(object[i].navn); //lage en textnode der object befinner seg i.
    node.appendChild(textnode); //går inn i textnoden.
    document.getElementById("lekeplassene").appendChild(node); //finner id-til object og skriver ut nodene til appendChild.

    lati = parseFloat(object[i].latitude);
    longi = parseFloat(object[i].longitude);

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

function createList(list) {}
