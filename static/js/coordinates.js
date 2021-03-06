function dmsversdd(){
    var lat = document.getElementById("lat").value;
    var lat_degrees = parseFloat(document.getElementById('latitude_degrees').value) || 0;
    var lat_minutes = parseFloat(document.getElementById('latitude_minutes').value) || 0;
    var lat_seconds = parseFloat(document.getElementById('latitude_seconds').value) || 0;

    if(lat === "nord"){
        var lat_geo = (lat_degrees + (lat_minutes / 60) + (lat_seconds / 3600)) 
    } else {
        var lat_geo = -(lat_degrees + (lat_minutes / 60) + (lat_seconds / 3600))
    }

    var lon = document.getElementById("lon").value;
    var lon_degrees = parseFloat(document.getElementById('longitude_degrees').value) || 0;
    var lon_minutes = parseFloat(document.getElementById('longitude_minutes').value) || 0 ;
    var lon_seconds = parseFloat(document.getElementById('longitude_seconds').value) || 0;

    if(lon === "est"){
        var lon_geo = (lon_degrees + (lon_minutes / 60) + (lon_seconds / 3600)) 
    } else {
        var lon_geo = -(lon_degrees + (lon_minutes / 60) + (lon_seconds / 3600))
    }
    document.getElementById('label_lat').innerText = lat_geo;
    document.getElementById('label_lon').innerText = lon_geo;
}

function ddmversdd(){
    var lat = document.getElementById("lat_ddm").value;
    var lat_degrees = parseFloat(document.getElementById('latitude_degrees_ddm').value) || 0;
    var lat_minutes = parseFloat(document.getElementById('latitude_minutes_ddm').value) || 0;
    var lat_seconds = (lat_minutes % 1) * 60;
    lat_minutes = Math.floor(lat_minutes);

    if(lat === "nord"){
        var lat_geo = (lat_degrees + (lat_minutes / 60) + (lat_seconds / 3600)) 
    } else {
        var lat_geo = -(lat_degrees + (lat_minutes / 60) + (lat_seconds / 3600))
    }

    var lon = document.getElementById("lon_ddm").value;
    var lon_degrees = parseFloat(document.getElementById('longitude_degrees_ddm').value) || 0;
    var lon_minutes = parseFloat(document.getElementById('longitude_minutes_ddm').value) || 0 ;
    var lon_seconds = (lon_minutes % 1) * 60;
    lon_minutes = Math.floor(lon_minutes);
    if(lon === "est"){
        var lon_geo = (lon_degrees + (lon_minutes / 60) + (lon_seconds / 3600)) 
    } else {
        var lon_geo = -(lon_degrees + (lon_minutes / 60) + (lon_seconds / 3600))
    }
    document.getElementById('label_lat').innerText = lat_geo;
    document.getElementById('label_lon').innerText = lon_geo;
}