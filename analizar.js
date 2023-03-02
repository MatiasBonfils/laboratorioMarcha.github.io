// get initial displayed frame from local storage
var dataImage = localStorage.getItem('imgData');
var bannerImg = document.getElementById('displayedFrame');
localStorage.setItem("imgData2", dataImage);
bannerImg.src = "data:image/png;base64," + dataImage;

// add event listener to delete button
var deleteBtn = document.getElementById('deleteButton');
deleteBtn.addEventListener('click', function() {
  var confirmDelete = confirm('¿Quieres eliminar esta imagen?');
  if (confirmDelete) {
    localStorage.removeItem('imgData');
    bannerImg.src = "";
    deleteBtn.style.display = 'none';
  }
});

  document.getElementById("container-izq").style.display = "none";
  document.getElementById("container-der").style.display = "none";
  document.getElementById("marcha-humana-wrapper").style.display = "none";
  document.getElementById("rotacion-int-ext-wrapper").style.display = "none";
  document.getElementById("displayContainer").style.height = "90vh";


const chips = document.querySelectorAll('.chip');
let selectedChip;

chips.forEach(chip => {
  chip.addEventListener('click', event => {
    if (selectedChip) {
      selectedChip.classList.remove('selected');
    }

    selectedChip = event.currentTarget;
    selectedChip.classList.add('selected');
    localStorage.setItem("prueba_realizada", JSON.stringify(selectedChip.id));
    
    if (selectedChip.id === "Rotación interna/externa") {
      document.getElementById("rotacion-int-ext-wrapper").style.display = "block";
      var rot_int_cad_izq_min = JSON.parse(localStorage.getItem("rot_int_cad_izq_min"));
      var rot_int_cad_izq_max = JSON.parse(localStorage.getItem("rot_int_cad_izq_max"));
      var rot_int_cad_der_min = JSON.parse(localStorage.getItem("rot_int_cad_der_min"));
      var rot_int_cad_der_max = JSON.parse(localStorage.getItem("rot_int_cad_der_max"));

      document.getElementById("rot_int_cad_izq_max").innerHTML = rot_int_cad_izq_min + "°";
      document.getElementById("rot_ext_cad_izq_max").innerHTML = rot_int_cad_izq_max + "°";
      document.getElementById("rot_int_cad_der_max").innerHTML = rot_int_cad_der_min + "°";
      document.getElementById("rot_ext_cad_der_max").innerHTML = rot_int_cad_der_max + "°";
    }else{
      document.getElementById("rotacion-int-ext-wrapper").style.display = "none";
    }
    
    if (selectedChip.id === "Análisis de la marcha humana lado izquierdo") {

      document.getElementById("displayContainer").style.height = "8vh";

      document.getElementById("container-izq").style.display = "block";
      document.getElementById("marcha-humana-wrapper").style.display = "block";
      

      var velocidad = JSON.parse(localStorage.getItem("velocidad_camina"));
      var cadencia = JSON.parse(localStorage.getItem("cadencia_camina"));
      var longitudPaso = JSON.parse(localStorage.getItem("Longitud_paso"));
      var longitudZancada = JSON.parse(localStorage.getItem("Longitud_zancada"));

      document.getElementById("velocidad").innerHTML = velocidad + " m/s";
      document.getElementById("cadencia").innerHTML = cadencia + " pasos/minuto";
      document.getElementById("longitud_paso").innerHTML = longitudPaso + " metros";
      document.getElementById("longitud_zancada").innerHTML = longitudZancada + " metros";



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
      var ctx = document.getElementById("myChart").getContext("2d");
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
      document.getElementById("myChart").style.display = "block";

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
      document.getElementById("myChartri").style.display = "block";
    } else {
      document.getElementById("myChart").style.display = "none";
      document.getElementById("myChartri").style.display = "none";
      document.getElementById("marcha-humana-wrapper").style.display = "none";
      document.getElementById("container-izq").style.display = "none";
      document.getElementById("displayContainer").style.height = "90vh";
    }
    });
    });
    

    chips.forEach(chip => {
      chip.addEventListener('click', event => {
        if (selectedChip) {
          selectedChip.classList.remove('selected');
        }
    
        selectedChip = event.currentTarget;
        selectedChip.classList.add('selected');
    
        
        if (selectedChip.id === "Análisis de la marcha humana lado derecho") {
          
          
          document.getElementById("displayContainer").style.height = "8vh";
          document.getElementById("marcha-humana-wrapper").style.display = "block";
          document.getElementById("container-der").style.display = "block";

          var velocidad = JSON.parse(localStorage.getItem("velocidad_camina"));
          var cadencia = JSON.parse(localStorage.getItem("cadencia_camina"));
          var longitudPaso = JSON.parse(localStorage.getItem("Longitud_paso"));
          var longitudZancada = JSON.parse(localStorage.getItem("Longitud_zancada"));
          
          document.getElementById("velocidad").innerHTML = velocidad + " m/s";
          document.getElementById("cadencia").innerHTML = cadencia + " pasos/minuto";
          document.getElementById("longitud_paso").innerHTML = longitudPaso + " metros";
          document.getElementById("longitud_zancada").innerHTML = longitudZancada + " metros";
          
          
          
          
          
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
          var ctx = document.getElementById("myChartcd").getContext("2d");
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
          document.getElementById("myChartcd").style.display = "block";
    
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
          document.getElementById("myChartrd").style.display = "block";
        } else {
          document.getElementById("myChartcd").style.display = "none";
          document.getElementById("myChartrd").style.display = "none";
          document.getElementById("container-der").style.display = "none";
         
        }
        });
        });

