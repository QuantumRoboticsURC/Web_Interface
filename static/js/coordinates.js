function dmsversdd(){
    var lat = document.getElementById("lat").value;
    var lat_degres = parseFloat(document.getElementById('latitude_degres').value) || 0;
    var lat_minutes = parseFloat(document.getElementById('latitude_minutes').value) || 0;
    var lat_secondes = parseFloat(document.getElementById('latitude_secondes').value) || 0;

    if(lat === "nord"){
        var lat_geo = (lat_degres + (lat_minutes / 60) + (lat_secondes / 3600)) 
    } else {
        var lat_geo = -(lat_degres + (lat_minutes / 60) + (lat_secondes / 3600))
    }

    var lon = document.getElementById("lon").value;
    var lon_degres = parseFloat(document.getElementById('longitude_degres').value) || 0;
    var lon_minutes = parseFloat(document.getElementById('longitude_minutes').value) || 0 ;
    var lon_secondes = parseFloat(document.getElementById('longitude_secondes').value) || 0;

    if(lon === "est"){
        var lon_geo = (lon_degres + (lon_minutes / 60) + (lon_secondes / 3600)) 
    } else {
        var lon_geo = -(lon_degres + (lon_minutes / 60) + (lon_secondes / 3600))
    }
    document.getElementById('label_lat').innerText = lat_geo;
    document.getElementById('label_lon').innerText = lon_geo;
}