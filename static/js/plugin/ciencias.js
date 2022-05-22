$(document).ready(function () {
    const configSensor1 = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "CO",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: ''
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };
    const configSensor2 = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "CO2",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Creating Real-Time Charts with Flask'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };

    const configSensor3 = {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: "H2",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [],
                fill: false,
            }],
        },
        options: {
            responsive: true,
            title: {
                display: false,
                text: 'Creating Real-Time Charts with Flask'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Time'
                    }
                }],
                yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Value'
                    }
                }]
            }
        }
    };
    const contextS1 = document.getElementById('Sensor1').getContext('2d');
    const lineChartS1 = new Chart(contextS1, configSensor1);
    const sourceS1 = new EventSource("/data_sensor1");
    sourceS1.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (configSensor1.data.labels.length === 30) {
            configSensor1.data.labels.shift();
            configSensor1.data.datasets[0].data.shift();
        }
        configSensor1.data.labels.push(data.time);
        configSensor1.data.datasets[0].data.push(data.value);
        lineChartS1.update();
    }

    const contextS2 = document.getElementById('Sensor2').getContext('2d');
    const lineChartS2 = new Chart(contextS2, configSensor2);
    const sourceS2 = new EventSource("/data_sensor2");
    sourceS2.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (configSensor2.data.labels.length === 30) {
            configSensor2.data.labels.shift();
            configSensor2.data.datasets[0].data.shift();
        }
        configSensor2.data.labels.push(data.time);
        configSensor2.data.datasets[0].data.push(data.value);
        lineChartS2.update();
    }

    const contextS3 = document.getElementById('Sensor3').getContext('2d');
    const lineChartS3 = new Chart(contextS3, configSensor3);
    const sourceS3 = new EventSource("/data_sensor3");
    sourceS3.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (configSensor3.data.labels.length === 30) {
            configSensor3.data.labels.shift();
            configSensor3.data.datasets[0].data.shift();
        }
        configSensor3.data.labels.push(data.time);
        configSensor3.data.datasets[0].data.push(data.value);
        lineChartS3.update();
    }
});