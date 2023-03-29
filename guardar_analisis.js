var dataImage2 = localStorage.getItem('imgData');
var bannerImg = document.getElementById('displayedFrame2');
bannerImg.src = "data:image/png;base64," + dataImage2;

function printPage() {
  window.print();
}
var prueba = JSON.parse(localStorage.getItem("prueba_realizada"));

		var velocidad = JSON.parse(localStorage.getItem("velocidad_camina"));
		var cadencia = JSON.parse(localStorage.getItem("cadencia_camina"));
		var longitudPaso = JSON.parse(localStorage.getItem("Longitud_paso"));
		var longitudZancada = JSON.parse(localStorage.getItem("Longitud_zancada"));
    
		// Display results if prueba is "Análisis de la marcha humana lado izquierdo" or "Análisis de la marcha humana lado derecho"
		if (prueba === "Análisis de la marcha humana lado izquierdo" || prueba === "Análisis de la marcha humana lado derecho") {
      document.getElementById("resultados_rotacion").style.display = "none";
      document.getElementById("resultados_frontales").style.display = "none";
      document.getElementById("results").style.display = "block";
      document.getElementById("prueba").value = prueba;
			document.getElementById("velocidad").innerHTML = velocidad + " m/s";
			document.getElementById("cadencia").innerHTML = cadencia + " pasos/minuto";
			document.getElementById("longitud_paso").innerHTML = longitudPaso + " metros";
			document.getElementById("longitud_zancada").innerHTML = longitudZancada + " metros";
      
		}
    else{
      document.getElementById("prueba").value = prueba;
      document.getElementById("results").style.display = "none";
      
     
      
    }
    var rot_int_cad_izq_min = JSON.parse(localStorage.getItem("rot_int_cad_izq_min"));
    var rot_int_cad_izq_max = JSON.parse(localStorage.getItem("rot_int_cad_izq_max"));
    var rot_int_cad_der_min = JSON.parse(localStorage.getItem("rot_int_cad_der_min"));
    var rot_int_cad_der_max = JSON.parse(localStorage.getItem("rot_int_cad_der_max"));



    if (prueba === "Rotación interna/externa") {
			document.getElementById("resultados_rotacion").style.display = "block";
      document.getElementById("results").style.display = "none";
      document.getElementById("resultados_frontales").style.display = "none";
      document.getElementById("prueba").value = prueba;
			document.getElementById("rot_ext_max_izq").innerHTML = rot_int_cad_izq_min + "°";
			document.getElementById("rot_int_max_izq").innerHTML = rot_int_cad_izq_max + "°";
			document.getElementById("rot_ext_max_der").innerHTML = rot_int_cad_der_min + "°";
			document.getElementById("rot_int_max_der").innerHTML = rot_int_cad_der_max + "°";
      
		}
    if(prueba === "Postural"){
      document.getElementById("resultados_frontales").style.display = "block";

      
      var ang_inclinacion_hombro_frontal= JSON.parse(localStorage.getItem("ang_inclinacion_hombro_frontal"))
      var ang_inclinacion_cadera_frontal= JSON.parse(localStorage.getItem("ang_inclinacion_cadera_frontal"))
      document.getElementById("ang_incl_hombro_frontal_ficha_tecnica").innerHTML = ang_inclinacion_hombro_frontal + "°";
			document.getElementById("ang_incl_cadera_frontal_ficha_tecnica").innerHTML = ang_inclinacion_cadera_frontal + "°";
      
      document.getElementById("results").style.display = "none";
      document.getElementById("resultados_rotacion").style.display = "none";
    }


if (prueba === "Análisis de la marcha humana lado izquierdo") {
  var ang_izq_cad_grafico = JSON.parse(localStorage.getItem("ang_izq_cad_grafico"));
  var ang_izq_rod_grafico = JSON.parse(localStorage.getItem("ang_izq_rod_grafico"));

  var xValues = [];
  for (var i = 0; i < ang_izq_cad_grafico.length; i++) {
    xValues.push((i * 100 / (ang_izq_cad_grafico.length - 1)).toFixed(0));
  }

  var xValuesri = [];
  for (var i = 0; i < ang_izq_rod_grafico.length; i++) {
    xValuesri.push((i * 100 / (ang_izq_rod_grafico.length - 1)).toFixed(0));
  }

  var container = document.querySelector(".container");
  var header = container.querySelector(".graph-header");
  var canvas = container.querySelector("#myChart");
  container.style.display ="block";
  header.style.display = "block";
  canvas.style.display = "block";
  document.getElementById("cont-der").style.display = "none";



  var ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: xValues,
      datasets: [{
        label: 'Ángulo articular cadera izquierda',
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
  new Chart("myChartri", {
    type: "line",
    data: {
      labels: xValuesri,
      datasets: [{
        label: 'Ángulo articular rodilla izquierda',
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
}
else{
  document.getElementById("cont-izq").style.display = "none";

}

if (prueba === "Análisis de la marcha humana lado derecho"){

  var ang_der_cad_grafico = JSON.parse(localStorage.getItem("ang_der_cad_grafico"));
  var ang_der_rod_grafico = JSON.parse(localStorage.getItem("ang_der_rod_grafico"));

  var xValuescd = [];
  for (var i = 0; i < ang_der_cad_grafico.length; i++) {
    xValuescd.push((i * 100 / (ang_der_cad_grafico.length - 1)).toFixed(0));
  }

  var xValuesrd = [];
  for (var i = 0; i < ang_der_rod_grafico.length; i++) {
    xValuesrd.push((i * 100 / (ang_der_rod_grafico.length - 1)).toFixed(0));
  }

  var container2 = document.querySelector(".container2");
  document.getElementById("cont-der").style.display = "block"
  var canvas2 = container2.querySelector("#myChartcd");
  container2.style.display ="block";
 
  canvas2.style.display = "block";

  var ctx = canvas2.getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: xValuescd,
      datasets: [{
        label: 'Ángulo articular cadera derecha',
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
  new Chart("myChartrd", {
    type: "line",
    data: {
      labels: xValuesrd,
      datasets: [{
        label: 'Ángulo articular rodilla derecha',
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
}
else{
  document.getElementById("cont-der").style.display = "none";

}