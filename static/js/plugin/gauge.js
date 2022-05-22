var opts = {
  angle: 0, // The span of the gauge arc
  lineWidth: 0.2, // The line thickness
  radiusScale: 1, // Relative radius
  pointer: {
    length: 0.54, // // Relative to gauge radius
    strokeWidth: 0.053, // The thickness
    color: '#000000' // Fill color
  },
  limitMax: false,     // If false, max value increases automatically if value > maxValue
  limitMin: false,     // If true, the min value of the gauge will be fixed
  colorStart: '#6FADCF',   // Colors
  colorStop: '#8FC0DA',    // just experiment with them
  strokeColor: '#E0E0E0',  // to see which ones work best for you
  generateGradient: true,
  highDpiSupport: true,     // High resolution support
  staticZones: [
      {strokeStyle: "#FF0000", min: 11, max: 11.3}, // Red from 100 to 60
      {strokeStyle: "#FFDD00", min: 11.31, max: 11.7}, // Green
      {strokeStyle: "#00FFFF", min: 11.71, max: 12.1}, // Yellow
      {strokeStyle: "#00FF00", min: 12.11, max: 12.6}  // Red
   ],
   staticLabels: {
    font: "10px sans-serif",  // Specifies font
    labels: [11, 11.31, 11.71, 12.11, 12.6],  // Print labels at these values
    color: "#000000",  // Optional: Label text color
    fractionDigits: 2  // Optional: Numerical precision. 0=round off.
  },
};

var target = document.getElementById('bateria'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 12.6; // set max gauge value
gauge.minValue = 11;
gauge.setMinValue(11);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 50; // set animation speed (32 is default value)
gauge.set(11); // set actual value
const source = new EventSource("/data_bateria");
const velocidad = new EventSource("/velocidad");

source.onmessage = function (event) {
  const data = JSON.parse(event.data);
  document.getElementById("labelBattery").innerHTML=(data.value).toFixed(2)+'  V';
  gauge.set(data.value);
}

/*velocidad.onmessage = function (event) {
  const data = JSON.parse(event.data);
  document.getElementById("VeloAngular").innerHTML=(data.angular * 100).toFixed(2) + ' %';
  document.getElementById("VeloLinear").innerHTML=(data.lineal * 100).toFixed(2) + ' %';
  document.getElementById("leftTrac").innerHTML=((data.angular+data.lineal)*303).toFixed(2) + ' RPM';
  document.getElementById("rigthTrac").innerHTML=Math.abs((-data.angular+data.lineal)*303).toFixed(2) + ' RPM';
}*/
//<!--<img style="width:100%;height: 100%;" id="bg" src="{{ url_for('video_feeder') }}">-->