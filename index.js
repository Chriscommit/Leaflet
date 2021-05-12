let monToken = 'pk.eyJ1IjoiZmxvcmlhbi1mbG9jb24iLCJhIjoiY2tldjJ1a3A5NDB1ZTJzcGNpOGJ1OTRxcSJ9.kFHGE_fRa8nxG2UN7DAaNA';
let mymap; //stockera la map
let markers; //stockera les markers

//si mon navigateur supporte la géoloc?
if ("geolocation" in navigator) {
    //code pour récup la position (geoloc)
    function coordonnees(position) {
        showMyMapWithMyPosition(position)
    }
    navigator.geolocation.getCurrentPosition(coordonnees)
        //sinon
} else {
    //on informe que ton navigateur est bidon (IE de ses morts!)
    console.log("L'API géolocation n'est pas disponible sur votre navigateur")
}
//fonction qui montre la position de l'utilisateur sur la map. (geoloc)
function showMyMapWithMyPosition(position) {
    //on peut tester qu'on récup bien une position, la lat, la lng (console.log)
    console.log(position)
        //on initialise la map en lui passant notre position

    createMap(position.coords.latitude, position.coords.longitude)
        //on fait apparaitre le formulaire qui est caché au départ
    let form = document.querySelector("#search")
    form.classList.remove("hide")
        //lorsque l'on envoi une requète dans le formulaire (gestion d'event)
    form.addEventListener("submit", function(e) {
        //on enlève le comportement du navigateur par défault.
        e.preventDefault()

        //récupération des boutiques en fonction de la position
        getBusinessNearMyPosition(position.coords.latitude, position.coords.longitude)
    })


}
//fonction de récupération des boutiques
function getBusinessNearMyPosition(lat, lng) {
    console.log("ça marche le big bizniiiiiissssssss")
        //on récupère la valeur entrée dans le formulaire
    let userValue = document.querySelector("#business").value
        //on efface les anciens markers (voir leaflet)
    markers.clearLayers()
        //requète API vers openstreetmap en lui passant la valeur rentrée ainsi que la position (voir API openstreetmap)
    fetch('https://nominatim.openstreetmap.org/search?q=' + userValue + ',' + lat + ',' + lng + '&format=geocodejson')
        .then(
            //récupération de la réponse AJAX et enregistrement au format JSON
            response =>
            response.json()
        )
        .then(response => {
            //récupération des places
            let places = response.features
                //on test qu'on récup bien les places dans la console
            console.log(response.features)
                //on fait une boucle pour afficher toutes les places renvoyé en réponse (boucle .map ES6)
            places.map((place) => {
                //création du marker en fonction des coordonnées de la boutique
                let marker = L.marker([place.geometry.coordinates[1], place.geometry.coordinates[0]]).addTo(mymap)
                    //on stock ce qu'on va afficher dans la popup
                let popup = "<p class=\"popup\">" + place.properties.geocoding.name + "<br>" + place.properties.geocoding.label + "</p>"
                    //création de la popup sur le marker
                marker.bindPopup(popup)
                    //ajout du marker à la map
                markers.addLayer(marker)
            })
        })
        .catch(error => console.log(error))




}

//fonction d'initialisation de la map et du marker de positionnement
function createMap(lat, lng) {
    //on définit le centre géographique et le zoom de la map.
    mymap = L.map('mapid').setView([lat, lng], 13);
    //regroupe les markers (calque) et en fait qu'un seul puis on ajoute à la map
    markers = L.layerGroup().addTo(mymap);
    //on charge la map et ses propriétés (ne pas oublier la clé d'accés) via l'api mapbox puis on ajoute à la map(voir tileLayer dans leaflet)
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: monToken,
    }).addTo(mymap);

    //on initialise l'icon de notre position
    let myIcon = L.icon({
        iconUrl: 'img/bluecircle.png',
        iconSize: [20, 20],
    });
    //on crée notre marker de position avec son icon et on ajoute à la map.
    let marker = L.marker([lat, lng], { icon: myIcon }).addTo(mymap);
}