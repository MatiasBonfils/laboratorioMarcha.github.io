var ang_izq_cad_grafico = JSON.parse(localStorage.getItem("ang_izq_cad_grafico"));

var xValues = [];
for (var i = 0; i < ang_izq_cad_grafico.length; i++) {
  xValues.push((i * 100 / (ang_izq_cad_grafico.length - 1)).toFixed(0));
}

new Chart("myChart", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "green",
      data: ang_izq_cad_grafico
    }]
  },
  options: {
    scales: {
      xAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return value + "%";
          }
        },
        scaleLabel: {
          display: true,
          labelString: "Porcentaje del ciclo de la marcha"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Ángulo articular cadera izquierda"
        }
      }]
    }
  }
});


var ang_der_cad_grafico = JSON.parse(localStorage.getItem("ang_der_cad_grafico"));

var xValuescd = [];
for (var i = 0; i < ang_der_cad_grafico.length; i++) {
  xValuescd.push((i * 100 / (ang_der_cad_grafico.length - 1)).toFixed(0));
}

new Chart("myChartcd", {
  type: "line",
  data: {
    labels: xValuescd,
    datasets: [{
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "green",
      data: ang_der_cad_grafico
    }]
  },
  options: {
    scales: {
      xAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return value + "%";
          }
        },
        scaleLabel: {
          display: true,
          labelString: "Porcentaje del ciclo de la marcha"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Ángulo articular cadera derecha"
        }
      }]
    }
  }
});



var ang_izq_rod_grafico = JSON.parse(localStorage.getItem("ang_izq_rod_grafico"));

var xValuesri = [];
for (var i = 0; i < ang_izq_rod_grafico.length; i++) {
  xValuesri.push((i * 100 / (ang_izq_rod_grafico.length - 1)).toFixed(0));
}

new Chart("myChartri", {
  type: "line",
  data: {
    labels: xValuesri,
    datasets: [{
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "green",
      data: ang_izq_rod_grafico
    }]
  },
  options: {
    scales: {
      xAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return value + "%";
          }
        },
        scaleLabel: {
          display: true,
          labelString: "Porcentaje del ciclo de la marcha"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Ángulo articular rodilla izquierda"
        }
      }]
    }
  }
});


var ang_der_rod_grafico = JSON.parse(localStorage.getItem("ang_der_rod_grafico"));

var xValuesrd = [];
for (var i = 0; i < ang_der_rod_grafico.length; i++) {
  xValuesrd.push((i * 100 / (ang_der_rod_grafico.length - 1)).toFixed(0));
}

new Chart("myChartrd", {
  type: "line",
  data: {
    labels: xValuesrd,
    datasets: [{
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "green",
      data: ang_der_rod_grafico
    }]
  },
  options: {
    scales: {
      xAxes: [{
        ticks: {
          callback: function(value, index, values) {
            return value + "%";
          }
        },
        scaleLabel: {
          display: true,
          labelString: "Porcentaje del ciclo de la marcha"
        }
      }],
      yAxes: [{
        scaleLabel: {
          display: true,
          labelString: "Ángulo articular rodilla derecha"
        }
      }]
    }
  }
});
