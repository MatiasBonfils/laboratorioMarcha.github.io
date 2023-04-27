//------------------------------------------------------------------------------------------------------//
//Esta parte del código arma las funciones necesarias para elaborar la página de guardar análisis, 
//la cual permite al usuario completar los datos finales del usuario y armar una ficha técnica.
//------------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------------//
//En esta parte se muestra en pantalla las capturas tomadas en la primera página .

var capturasContainer = document.getElementById('capturas-container');
var dataImage;
var imgElement, deleteBtnElement, imgContainer;

for (var i = 0; i < 4; i++) {
  dataImage = sessionStorage.getItem('imgData' + i);
  if (dataImage) {
    imgElement = document.createElement('img');
    imgElement.src = dataImage;

    imgContainer = document.createElement('div');
    imgContainer.className = 'imagePreview';
    imgContainer.appendChild(imgElement);

    deleteBtnElement = document.createElement('span');
    deleteBtnElement.className = 'deleteButton';
    deleteBtnElement.textContent = 'X';
    deleteBtnElement.addEventListener('click', createDeleteHandler(i));

    imgContainer.appendChild(deleteBtnElement);

    capturasContainer.appendChild(createCapturaElement(imgContainer));
  }
}

function createCapturaElement(imgContainer) {
  var capturaElement = document.createElement('div');
  capturaElement.className = 'captura';
  capturaElement.appendChild(imgContainer);

  capturaElement.addEventListener('mouseenter', function() {
    deleteBtnElement.style.display = 'block';
  });

  capturaElement.addEventListener('mouseleave', function() {
    deleteBtnElement.style.display = 'none';
  });

  return capturaElement;
}

function createDeleteHandler(index) {
  return function() {
    var confirmDelete = confirm('¿Quieres eliminar esta imagen?');
    if (confirmDelete) {
      localStorage.removeItem('imgData' + index);
      var capturas = document.getElementsByClassName('captura');
      capturasContainer.removeChild(capturas[index]);
    }
  }
}
//------------------------------------------------------------------------------------------------------//
// Esta función permite al usuario generar el PDF con los datos.

function printPage() {
  window.print();
}
//------------------------------------------------------------------------------------------------------//
// En esta parte del código se configura la página para mostrar los datos según la prueba que haya seleccionado
// el usuario en la página anterior.
    document.getElementById("container-izq").style.display = "none";
    document.getElementById("container-der").style.display = "none";
//------------------------------------------------------------------------------------------------------//
// Llama a la variable en donde está guardada la prueba que eligió el usuario en la página anterior.
    var prueba = JSON.parse(sessionStorage.getItem("prueba_realizada"));
// Llama a los parametros espacio-temporales guardados en el navegador.
		var velocidad = JSON.parse(sessionStorage.getItem("velocidad_camina"));
		var cadencia = JSON.parse(sessionStorage.getItem("cadencia_camina"));
		var longitudPaso = JSON.parse(sessionStorage.getItem("Longitud_paso"));
		var longitudZancada = JSON.parse(sessionStorage.getItem("Longitud_zancada"));
    var fase_de_apoyo = JSON.parse(sessionStorage.getItem("fase_apoyo_der"));
		// Muestra los results (que son los datos guardados sobre la marcha) si prueba es igual 
    //a "Análisis de la marcha humana lado izquierdo" o a "Análisis de la marcha humana lado derecho"
		if (prueba === "Análisis de la marcha humana lado izquierdo" || prueba === "Análisis de la marcha humana lado derecho") {
      document.getElementById("resultados_rotacion").style.display = "none";
      document.getElementById("resultados_frontales").style.display = "none";
      document.getElementById("results").style.display = "block";
      document.getElementById("prueba").value = prueba;
			document.getElementById("velocidad").innerHTML = velocidad + " m/s";
			document.getElementById("cadencia").innerHTML = cadencia + " pasos/minuto";
			document.getElementById("longitud_paso").innerHTML = longitudPaso + " metros";
			document.getElementById("longitud_zancada").innerHTML = longitudZancada + " metros";
      document.getElementById("fase_apoyo_der").innerHTML = fase_de_apoyo + " %";
      
		}
    else{
      document.getElementById("prueba").value = prueba;
      document.getElementById("results").style.display = "none";  
    }
    //------------------------------------------------------------------------------------------------------//
    // Parte del código para configurar la muestra de los datos de la prueba de rotación y postural.
    var rot_int_cad_izq_min = JSON.parse(sessionStorage.getItem("rot_int_cad_izq_min"));
    var rot_int_cad_izq_max = JSON.parse(sessionStorage.getItem("rot_int_cad_izq_max"));
    var rot_int_cad_der_min = JSON.parse(sessionStorage.getItem("rot_int_cad_der_min"));
    var rot_int_cad_der_max = JSON.parse(sessionStorage.getItem("rot_int_cad_der_max"));

    if (prueba === "Rotación interna/externa") {
      document.getElementById("results").style.display = "none";
      document.getElementById("resultados_frontales").style.display = "none";
      
		}
    if(prueba === "Postural y rotación interna/externa"){
      document.getElementById("resultados_frontales").style.display = "block";
      document.getElementById("resultados_rotacion").style.display = "block";
      document.getElementById("prueba").value = "Postural";

			
      var ang_inclinacion_hombro_frontal = JSON.parse(sessionStorage.getItem("ang_linea_frontal_hombro_2"));
      var ang_inclinacion_cadera_frontal = JSON.parse(sessionStorage.getItem("ang_linea_frontal_cadera_2"));
      document.getElementById("ang_incl_hombro_frontal_ficha_tecnica").innerHTML = ang_inclinacion_hombro_frontal + "°";
			document.getElementById("ang_incl_cadera_frontal_ficha_tecnica").innerHTML = ang_inclinacion_cadera_frontal + "°";
      document.getElementById("prueba2").value = "Rotación interna/externa";
      document.getElementById("rot_ext_max_izq").innerHTML = rot_int_cad_izq_min + "°";
			document.getElementById("rot_int_max_izq").innerHTML = rot_int_cad_izq_max + "°";
			document.getElementById("rot_ext_max_der").innerHTML = rot_int_cad_der_min + "°";
			document.getElementById("rot_int_max_der").innerHTML = rot_int_cad_der_max + "°";
      
      document.getElementById("results").style.display = "none";
    
    }

//------------------------------------------------------------------------------------------------------//
//Pregunta si la prueba fue análisis de la marcha humana lado izquierdo y de esa manera coloca sus graficas
if (prueba === "Análisis de la marcha humana lado izquierdo") {
  document.getElementById("capturas-container").style.marginTop = "-30rem";
 
  document.getElementById("container-izq").style.display = "block";
 

  const porcentajes = [  0, 9, 18, 27, 36, 45, 55, 64, 73, 82, 91, 100];
 
    
  var datasets_ci = JSON.parse(sessionStorage.getItem("datasets_ci"));
  var datasets_ri = JSON.parse(sessionStorage.getItem("datasets_ri"));
  console.log(datasets_ri)

  let ctx = document.getElementById("myChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: porcentajes,
      datasets: datasets_ci,
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
            labelString: "Ángulo articular en flexión y extensión de cadera izquierda"
          }
        }]
      }
    }
  });
  
  document.getElementById("myChart").style.display = "block";
  let ctx_ri = document.getElementById("myChartri").getContext("2d");

  new Chart(ctx_ri, {
    type: "line",
    data: {
      labels: porcentajes,
      datasets: datasets_ri,
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
            labelString: "Ángulo articular en flexión y extensión de rodilla izquierda"
          }
        }]
      }
    }
  });
}
else{
  document.getElementById("container-izq").style.display = "none";

}
//------------------------------------------------------------------------------------------------------//
//Pregunta si la prueba fue análisis de la marcha humana lado derecho y de esa manera coloca sus graficas
if (prueba === "Análisis de la marcha humana lado derecho"){
  document.getElementById("capturas-container").style.marginTop = "-25rem";
 
  document.getElementById("container-der").style.display = "block";
 

  const porcentajes = [  0, 9, 18, 27, 36, 45, 55, 64, 73, 82, 91, 100];
 
    
  var datasets_cd = JSON.parse(sessionStorage.getItem("datasets_cd"));
  var datasets_rd = JSON.parse(sessionStorage.getItem("datasets_rd"));
  

  let ctx_cd = document.getElementById("myChartcd").getContext("2d");
  new Chart(ctx_cd, {
    type: "line",
    data: {
      labels: porcentajes,
      datasets: datasets_cd,
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
            labelString: "Ángulo articular en flexión y extensión de cadera derecha"
          }
        }]
      }
    }
  });
  
  document.getElementById("myChartcd").style.display = "block";
  let ctx_rd = document.getElementById("myChartrd").getContext("2d");

  new Chart(ctx_rd, {
    type: "line",
    data: {
      labels: porcentajes,
      datasets: datasets_rd,
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
            labelString: "Ángulo articular en flexión y extensión de rodilla derecha"
          }
        }]
      }
    }
  });
}
else{
  document.getElementById("container-der").style.display = "none";

}