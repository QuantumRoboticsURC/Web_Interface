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
      {strokeStyle: "#FF0000", min: 20.0, max: 22.0}, // Red from 100 to 60
      {strokeStyle: "#FFDD00", min: 22.0, max: 23.0}, // Green
      {strokeStyle: "#00FFFF", min: 23.0, max: 24.0}, // Yellow
      {strokeStyle: "#00FF00", min: 24.0, max: 25.2}  // Red
   ],
   staticLabels: {
    font: "10px sans-serif",  // Specifies font
    labels: [21.0, 22.0, 23.0, 24.0, 25.2],  // Print labels at these values
    color: "#000000",  // Optional: Label text color
    fractionDigits: 2  // Optional: Numerical precision. 0=round off.
  },
};

var target = document.getElementById('bateria'); // your canvas element
var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
gauge.maxValue = 25.2; // set max gauge value
gauge.minValue = 20.0;
gauge.setMinValue(21.0);  // Prefer setter over gauge.minValue = 0
gauge.animationSpeed = 50; // set animation speed (32 is default value)
gauge.set(24.0); // set actual value
const source = new EventSource("/data_bateria");
const velocidad = new EventSource("/velocidad");

source.onmessage = function (event) {
  const data = JSON.parse(event.data);
  document.getElementById("labelBattery").innerHTML= 20; /*(data.value).toFixed(2)+'  V';*/
  gauge.set(21);/*data.value);*/
}

/*velocidad.onmessage = function (event) {
  const data = JSON.parse(event.data);
  document.getElementById("VeloAngular").innerHTML=(data.angular * 100).toFixed(2) + ' %';
  document.getElementById("VeloLinear").innerHTML=(data.lineal * 100).toFixed(2) + ' %';
  document.getElementById("leftTrac").innerHTML=((data.angular+data.lineal)*303).toFixed(2) + ' RPM';
  document.getElementById("rigthTrac").innerHTML=Math.abs((-data.angular+data.lineal)*303).toFixed(2) + ' RPM';
}*/
//<!--<img style="width:100%;height: 100%;" id="bg" src="{{ url_for('video_feeder') }}">-->
