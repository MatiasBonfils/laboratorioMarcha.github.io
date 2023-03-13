// get initial displayed frame from local storage
var dataImage = localStorage.getItem('imgData');
var bannerImg = document.getElementById('displayedFrame');
localStorage.setItem("imgData", dataImage);
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
  document.getElementById("postura-frontal-wrapper").style.display = "none";
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

    if (selectedChip.id === "Postural") {
      document.getElementById("postura-frontal-wrapper").style.display = "block";
      var ang_inclinacion_hombro_frontal = JSON.parse(localStorage.getItem("ang_linea_frontal_hombro_2"));
      var ang_inclinacion_cadera_frontal = JSON.parse(localStorage.getItem("ang_linea_frontal_cadera_2"));
     

      document.getElementById("ang_lin_fro_hom").innerHTML = ang_inclinacion_hombro_frontal + "°";
      document.getElementById("ang_lin_fro_cad").innerHTML = ang_inclinacion_cadera_frontal + "°";
    }else{
      document.getElementById("postura-frontal-wrapper").style.display = "none";
    }

    if (selectedChip.id === "Rotación interna/externa") {
      document.getElementById("rotacion-int-ext-wrapper").style.display = "block";
      document.getElementById("displayContainer").style.marginTop = "-10rem";
      document.getElementById("displayContainer").style.marginLeft = "0rem";
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
      document.getElementById("displayContainer").style.marginTop = "-5rem";
      document.getElementById("displayContainer").style.marginLeft = "0rem";
    }
    
    if (selectedChip.id === "Análisis de la marcha humana lado izquierdo") {

      document.getElementById("displayContainer").style.height = "8vh";

      document.getElementById("container-izq").style.display = "block";
      document.getElementById("marcha-humana-wrapper").style.display = "block";
      
      var zancada = JSON.parse(localStorage.getItem("zancada_cantidad"));
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
       
      let subarrays = [];
      let subarrays_rod_izq= [];

      let startIndex = 0;
      for (let i = 0; i < zancada.length; i++) {
        let endIndex = zancada[i];
        let subarray = ang_izq_cad_grafico.slice(startIndex, endIndex);
        let subarray_rod= ang_izq_rod_grafico.slice(startIndex, endIndex);
        subarrays_rod_izq.push(subarray_rod);
        subarrays.push(subarray);
        startIndex = endIndex;
      }
      
      // Add last subarray after the last zancada index
      if (startIndex < ang_izq_cad_grafico.length) {
        let subarray = ang_izq_cad_grafico.slice(startIndex);
        subarrays.push(subarray);
        let  subarray_rod = ang_izq_rod_grafico.slice(startIndex);
        subarrays_rod_izq.push(subarray_rod);
      }
      
      let colors = ['green', 'blue', 'red', 'purple', 'orange', 'pink', 'brown', 'gray', 'black'];
      let datasets = [];
      for (let i = 0; i < subarrays.length; i++) {
        datasets.push({
          label: `Zancada ${i+1}`,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: colors[i % colors.length],
          data: subarrays[i]
        });
      }
      let datasets_rod_izq = [];
      for (let i = 0; i < subarrays_rod_izq.length; i++) {
        datasets_rod_izq.push({
          label: `Zancada ${i+1}`,
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: colors[i % colors.length],
          data: subarrays_rod_izq[i]
        });
      }
      
      let largestSubarrayLength = Math.max(...subarrays.map(subarray => subarray.length));
      let xValues = [];
      for (let i = 0; i < largestSubarrayLength; i++) {
        xValues.push((i * 100 / (largestSubarrayLength - 1)).toFixed(0));
      }
      let ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: xValues,
          datasets: datasets
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
      let subarray_mas_largo = Math.max(...subarrays_rod_izq.map(subarray_rod => subarray_rod.length));
      let xValuesri = [];
      for (let i = 0; i < subarray_mas_largo; i++) {
        xValuesri.push((i * 100 / (subarray_mas_largo - 1)).toFixed(0));
      }
      new Chart("myChartri", {
        type: "line",
        data: {
          labels: xValuesri,
          datasets: datasets_rod_izq
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

          var zancada = JSON.parse(localStorage.getItem("zancada_cantidad"));
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
           
          let subarrays_cad_der = [];
          let subarrays_rod_der= [];
    
          let startIndex_der = 0;
          for (let i = 0; i < zancada.length; i++) {
            let endIndex = zancada[i];
            let subarray_cd = ang_der_cad_grafico.slice(startIndex_der, endIndex);
            let subarray_rod_der= ang_der_rod_grafico.slice(startIndex_der, endIndex);
            subarrays_rod_der.push(subarray_rod_der);
            subarrays_cad_der.push(subarray_cd);
            startIndex_der = endIndex;
          }
          
          // Add last subarray after the last zancada index
          if (startIndex_der < ang_der_cad_grafico.length) {
            let subarray_der = ang_der_cad_grafico.slice(startIndex_der);
            subarrays_cad_der.push(subarray_der);
            let  subarray_rod = ang_der_rod_grafico.slice(startIndex_der);
            subarrays_rod_der.push(subarray_rod);
          }
          
          let colors = ['green', 'blue', 'red', 'purple', 'orange', 'pink', 'brown', 'gray', 'black'];
          let datasetscd = [];
          for (let i = 0; i < subarrays_cad_der.length; i++) {
            datasetscd.push({
              label: `Zancada ${i+1}`,
              backgroundColor: "rgba(0,0,0,0)",
              borderColor: colors[i % colors.length],
              data: subarrays_cad_der[i]
            });
          }
          let datasets_rod_der = [];
          for (let i = 0; i < subarrays_rod_der.length; i++) {
            datasets_rod_der.push({
              label: `Zancada ${i+1}`,
              backgroundColor: "rgba(0,0,0,0)",
              borderColor: colors[i % colors.length],
              data: subarrays_rod_der[i]
            });
          }
          
          let subarray_mas_largo_cd = Math.max(...subarrays_cad_der.map(subarray_der => subarray_der.length));
          let xValuescd= [];
          for (let i = 0; i < subarray_mas_largo_cd; i++) {
            xValuescd.push((i * 100 / (subarray_mas_largo_cd - 1)).toFixed(0));
          }
          let ctxcd = document.getElementById("myChartcd").getContext("2d");
          new Chart(ctxcd, {
            type: "line",
            data: {
              labels: xValuescd,
              datasets: datasetscd
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
          let subarray_mas_largo_rd = Math.max(...subarrays_rod_der.map(subarray_rod => subarray_rod.length));
          let xValuesrd = [];
          for (let i = 0; i < subarray_mas_largo_rd; i++) {
            xValuesrd.push((i * 100 / (subarray_mas_largo_rd - 1)).toFixed(0));
          }
          new Chart("myChartrd", {
            type: "line",
            data: {
              labels: xValuesrd,
              datasets: datasets_rod_der
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
      
          document.getElementById("myChartrd").style.display = "block";
        } else {
          document.getElementById("myChartcd").style.display = "none";
          document.getElementById("myChartrd").style.display = "none";
          document.getElementById("container-der").style.display = "none";
         
        }
        });
        });

