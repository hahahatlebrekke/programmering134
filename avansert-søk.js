/*Oppgave.5*/
function myFunction() {
  var x = document.getElementById("advanced_search");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
if (document.getElementById("Klokkeslett")) {
  var Klokkeslett = today.getHours() + "." + today.getMinutes();
}
