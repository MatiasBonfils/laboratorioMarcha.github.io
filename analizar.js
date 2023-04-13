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
      sessionStorage.removeItem('imgData' + index);
      var capturas = document.getElementsByClassName('captura');
      capturasContainer.removeChild(capturas[index]);
    }
  }
}




  document.getElementById("container-izq").style.display = "none";
  document.getElementById("container-der").style.display = "none";
  document.getElementById("marcha-humana-wrapper").style.display = "none";
  document.getElementById("rotacion-int-ext-wrapper").style.display = "none";
  document.getElementById("postura-frontal-wrapper").style.display = "none";
  document.getElementById("capturas-container").style.height = "95vh";


const chips = document.querySelectorAll('.chip');
let selectedChip;

chips.forEach(chip => {
  chip.addEventListener('click', event => {
    if (selectedChip) {
      selectedChip.classList.remove('selected');
    }

    selectedChip = event.currentTarget;
    selectedChip.classList.add('selected');
    sessionStorage.setItem("prueba_realizada", JSON.stringify(selectedChip.id));

    if (selectedChip.id === "Postural") {
      document.getElementById("postura-frontal-wrapper").style.display = "block";
      var ang_inclinacion_hombro_frontal = JSON.parse(sessionStorage.getItem("ang_linea_frontal_hombro_2"));
      var ang_inclinacion_cadera_frontal = JSON.parse(sessionStorage.getItem("ang_linea_frontal_cadera_2"));
      document.getElementById("capturas-container").style.marginTop = "-30rem";
      document.getElementById("capturas-container").style.marginLeft = "16rem";
      console.log(ang_inclinacion_hombro_frontal);
      if (ang_inclinacion_hombro_frontal.length !== 0 && ang_inclinacion_cadera_frontal.length !== 0) {
          document.getElementById("ang_lin_fro_hom").innerHTML = "Ángulo de inclinación de hombro: " + ang_inclinacion_hombro_frontal + "°";
          document.getElementById("ang_lin_fro_cad").innerHTML = "Ángulo de inclinación de cadera: " + ang_inclinacion_cadera_frontal + "°";
      } else {
          document.getElementById("ang_lin_fro_hom").innerHTML = "Debe guardar los datos para poder observar los ángulos";
          document.getElementById("ang_lin_fro_cad").innerHTML = "";
      }
  } else {
      document.getElementById("postura-frontal-wrapper").style.display = "none";
  }
  
  
  

  if (selectedChip.id === "Rotación interna/externa") {
    document.getElementById("rotacion-int-ext-wrapper").style.display = "block";
    document.getElementById("capturas-container").style.marginTop = "-20rem";
    document.getElementById("capturas-container").style.marginLeft = "16rem";
    
    var rot_int_cad_izq_min = JSON.parse(sessionStorage.getItem("rot_int_cad_izq_min"));
    var rot_int_cad_izq_max = JSON.parse(sessionStorage.getItem("rot_int_cad_izq_max"));
    var rot_int_cad_der_min = JSON.parse(sessionStorage.getItem("rot_int_cad_der_min"));
    var rot_int_cad_der_max = JSON.parse(sessionStorage.getItem("rot_int_cad_der_max"));
  
    if (rot_int_cad_izq_max== "-200.0") {
      
      document.getElementById("rot_int_cad_izq_max").innerHTML = "Debe guardar los datos para poder observar el valor de los ángulos";
      document.getElementById("rot_ext_cad_izq_max").innerHTML ="";
      document.getElementById("rot_int_cad_der_max").innerHTML ="";
      document.getElementById("rot_ext_cad_der_max").innerHTML ="";
    
    } else {
      document.getElementById("rot_int_cad_izq_max").innerHTML ="Ángulo externo máximo izquierdo: " +  rot_int_cad_izq_min + "°";
      document.getElementById("rot_ext_cad_izq_max").innerHTML ="Ángulo interno máximo izquierdo: "+ rot_int_cad_izq_max + "°";
      document.getElementById("rot_int_cad_der_max").innerHTML ="Ángulo externo máximo derecho: " + rot_int_cad_der_min + "°";
      document.getElementById("rot_ext_cad_der_max").innerHTML ="Ángulo interno máximo derecho: " + rot_int_cad_der_max + "°";
    }
  } else {
    document.getElementById("rotacion-int-ext-wrapper").style.display = "none";
  }
  
    
    if (selectedChip.id === "Análisis de la marcha humana lado izquierdo") {

      //Mostrar y acomodar los elementos que se van a mostrar
  document.getElementById("capturas-container").style.marginTop = " -60rem";
  document.getElementById("container-izq").style.display = "block";
  document.getElementById("marcha-humana-wrapper").style.display = "block";

  //Importo los datos para mostrar las variables de la marcha
  // Primero con respecto a los parametros espacio-temporales
  
  var velocidad = JSON.parse(sessionStorage.getItem("velocidad_camina"));
  var cadencia = JSON.parse(sessionStorage.getItem("cadencia_camina"));
  var longitudPaso = JSON.parse(sessionStorage.getItem("Longitud_paso"));
  var longitudZancada = JSON.parse(sessionStorage.getItem("Longitud_zancada"));

  
      //Segundo para los parametros angulares
      var ang_izq_cad_grafico = JSON.parse(sessionStorage.getItem("ang_izq_cad_grafico"));
      var ang_izq_rod_grafico = JSON.parse(sessionStorage.getItem("ang_izq_rod_grafico"));
      var posicion_pie_x_grafico_izq = JSON.parse(sessionStorage.getItem("posicion_pie_x_grafico_izq"));
      
      
      //Esta funcion lo que hace es devolver varios subarreglos con dos valores cada uno
      //El primero representa en que momento el pie empieza a moverse en el eje x
      // y el segundo en que momento deja de moverse
      function indicesPie(posicion_pie) {
        let positiveChangeRateIndexes = [];
          
        for (let i = 1; i < posicion_pie.length; i++) {
          const change_rate_i = Math.abs(posicion_pie[i] - posicion_pie[i - 1]) / posicion_pie[i - 1];
          if (change_rate_i > 0.01) {
            positiveChangeRateIndexes.push(i);
          }
        }
      
        function divideArray(array) {
          let result = [];
          let subarray = [array[0]];
          for (let i = 1; i < array.length; i++) {
            if (array[i] - array[i - 1] > 1) {
              subarray.push(array[i - 1]);
              result.push(subarray);
              subarray = [array[i]];
            }
          }
          subarray.push(array[array.length - 1]);
          result.push(subarray);
          return result;
        }
        
        let subarrays = divideArray(positiveChangeRateIndexes);
      
        // Filter out subarrays with a difference smaller than 2
        subarrays = subarrays.filter(subarray => (subarray[subarray.length-1] - subarray[0]) >= 2);
        
        return subarrays;
      }
      
      //Esta funcion devuelve el arreglo con los angulos en distintos subarreglo tomando en cuenta los valores
      // de los subarreglos de la funcion indicesPie. De esa manera queda separado en subarreglos que representa
      //una zancada cada uno
      function divideGraph(ang_grafico, subarrays) {
        let result = [];
        let lastEnd = 0;
      
        for (let i = 0; i < subarrays.length; i++) {
          let subarray = ang_grafico.slice(lastEnd, subarrays[i][subarrays[i].length-1]);
          if (i === subarrays.length - 1) {
            subarray.push(ang_grafico[ang_grafico.length - 1]);
          }
          result.push(subarray);
          lastEnd = subarrays[i][subarrays[i].length-1];
        }
      
        return result;
      }
      
      //Obtenemos los indice en los cuales hay zancadas
      let subarreglos_indices_pie_izq = indicesPie(posicion_pie_x_grafico_izq);
      //Dividimos el arreglo de angulos en base a eso indices
      let ang_izq_cad_grafico_divido = divideGraph(ang_izq_cad_grafico,subarreglos_indices_pie_izq);
      let ang_izq_rod_grafico_divido = divideGraph(ang_izq_rod_grafico,subarreglos_indices_pie_izq);
      //Le quitamos las comas a los valores (sino no los grafica)
      const ang_izq_cad_grafico_divido_sc = ang_izq_cad_grafico_divido.map(subarreglo => {
        return subarreglo.map(elemento => parseInt(elemento));
      });
      const ang_izq_rod_grafico_divido_sc = ang_izq_rod_grafico_divido.map(subarreglo => {
        return subarreglo.map(elemento => parseInt(elemento));
      });
      console.log(posicion_pie_x_grafico_izq);
      console.log(subarreglos_indices_pie_izq);
      console.log(ang_izq_cad_grafico_divido);
      function fase_de_apoyo(arr) {
        let resultado = [];
        let div = arr[0][0] / arr[0][1];
        resultado.push(div);
      
        for (let i = 1; i < arr.length; i++) {
          let num1 = arr[i][0] - arr[i - 1][1];
          let num2 = arr[i][1] - arr[i - 1][1];
          div = num1 / num2;
          resultado.push(div);
        }
      
        let sumatoria = resultado.reduce((acumulado, actual) => acumulado + actual);
        let promedio = (sumatoria / resultado.length)*100;
      
        return promedio;
      }

      let fase_apoyo_izq= fase_de_apoyo(subarreglos_indices_pie_izq).toFixed(2);
      console.log(fase_apoyo_izq);
      sessionStorage.setItem("fase_apoyo_der", JSON.stringify(fase_apoyo_izq));


      if (velocidad === null) {
        document.getElementById("velocidad").innerHTML = "Debe medir distancia para poder observar los parametros espacio-temporales y guardar datos para los ángulos ";
        document.getElementById("cadencia").innerHTML = "";
        document.getElementById("longitud_paso").innerHTML = "";
        document.getElementById("longitud_zancada").innerHTML = "";
        document.getElementById("fase_de_apoyo").innerHTML = "";
        document.getElementById("grafico_titulo_ci").style.display = "none";
        document.getElementById("grafico_titulo_ri").style.display = "none";
        document.getElementById("container-izq").style.display = "none";
        document.getElementById("capturas-container").style.marginTop = " -20rem";
    
      } else {
        document.getElementById("velocidad").innerHTML ="Velocidad de caminata: " + velocidad + " m/s";
        document.getElementById("cadencia").innerHTML = "Cadencia de caminata: "  + cadencia + " pasos/minuto";
        document.getElementById("longitud_paso").innerHTML ="Longitud de paso: "  + longitudPaso + " metros";
        document.getElementById("longitud_zancada").innerHTML ="Longitud de zancada: " + longitudZancada + " metros";
        document.getElementById("fase_de_apoyo").innerHTML = "Fase de apoyo: " + fase_apoyo_izq + " %" ;
      }
      //Como los distintos subarreglos que conforman el arreglo de los angulos tienen distintas longitudes
      //va a necesitar que queden homogenizados para poder graficarlos (poner en intervalos y promediarlos)
      //De esa manera devuelve el arreglo con todos los subarreglos del mismo tamano
      function HomogenizarDatos(arreglo) {
        const n = arreglo.length;
        let subarreglo = [];
        let subarregloPorcentaje = [];
        
     
        for (let i = 0; i < n; i++) {
          subarregloPorcentaje.push(((i / (n - 1)) * 100).toFixed(2));
          subarreglo.push(arreglo[i]);
        }
       
        let temporal = [];
        let datos_grafico = [];
        datos_grafico[0] = arreglo[0];
      
        for (let i = 0; i < 10; i++) {
          for (let j = 1; j < n; j++) {
            if (
              subarregloPorcentaje[j] >= 10 * i &&
              subarregloPorcentaje[j] <= 9.999 * (i + 1)
            ) {
              temporal.push(subarreglo[j]);
            }
          }
      
          let suma = temporal.reduce(
            (acumulador, valorActual) => acumulador + valorActual,
            0
          );
          let promedio = suma / temporal.length;
          datos_grafico.push(promedio);
          temporal = [];
        }
        datos_grafico.push(arreglo[n - 1]);
      
        for (let k = 0; k < 11; k++) {
          if (isNaN(datos_grafico[k])) {
            datos_grafico[k] = (datos_grafico[k - 1] + datos_grafico[k + 1]) / 2;
          }
        }
        return datos_grafico;
      }

      //Arma una matriz con los datos homogenizados para que despues sea mas facil calcular el promedio general
      function armarMatriz(arreglo) {
        const n = arreglo.length;
        let subarregloPorcentaje = [];
      
        for (let i = 0; i < n; i++) {
          subarregloPorcentaje.push(((i / (n - 1)) * 100).toFixed(2));
        }
      
        let matriz = [];
      
        for (let i = 0; i < n; i++) {
          matriz.push([arreglo[i], subarregloPorcentaje[i]]);
        }
        
        return matriz;
      }
      
      
      
      
      datos_grafico_cad_izq= ang_izq_cad_grafico_divido_sc.map(HomogenizarDatos);
      datos_grafico_cad_izq_matriz= ang_izq_cad_grafico_divido_sc.map(armarMatriz);
      datos_grafico_rod_izq= ang_izq_rod_grafico_divido_sc.map(HomogenizarDatos);
      datos_grafico_rod_izq_matriz= ang_izq_rod_grafico_divido_sc.map(armarMatriz);
      //datos_grafico_rod_izq= ang_izq_rod_grafico_divido_sc.map(HomogenizarDatos);
    
      
      
      
      const promedio_todos_angulos_cadera_izq= [];
      
      // Promedio del primer valor
      const temporal_primero_ci = datos_grafico_cad_izq_matriz.map((fila) => fila[0][0]);
      const suma_primer_ci = temporal_primero_ci.reduce((acum, valor) => acum + valor, 0);
      const promedio_primer_ci = suma_primer_ci / temporal_primero_ci.length;
      promedio_todos_angulos_cadera_izq.push(parseFloat(promedio_primer_ci.toFixed(2)));
      
      // Promedios de los valores del segundo al penúltimo
      for (let i = 0; i < 10; i++) {
        const temporal_ci = [];
        datos_grafico_cad_izq_matriz.forEach((fila) => {
          fila.slice(1, -1).forEach((valor) => {
            if (valor[1] >= 10 * i && valor[1] <= 9.999 * (i + 1)) {
              temporal_ci.push(valor[0]);
            }
          });
          if (!temporal_ci.length) {
            const lar = fila.length;
            temporal_ci.push((fila[lar - 2][0] + fila[lar - 1][0]) / 2);
          }
        });
        const suma_ci = temporal_ci.reduce((acum, valor) => acum + valor, 0);
        const promedio_ci = suma_ci / temporal_ci.length;
        promedio_todos_angulos_cadera_izq.push(parseFloat(promedio_ci.toFixed(2)));
      }
      
      // Promedio del último valor
      const temporal_ultimo_ci = datos_grafico_cad_izq_matriz.map((fila) => fila[fila.length - 1][0]);
      const suma_ultimo_ci = temporal_ultimo_ci.reduce((acum, valor) => acum + valor, 0);
      const promedio_ultimo_ci = suma_ultimo_ci / temporal_ultimo_ci.length;
      promedio_todos_angulos_cadera_izq.push(parseFloat(promedio_ultimo_ci.toFixed(2)));
      
    
      
      const promedio_todos_angulos_rodilla_izq = [];

      // Promedio del primer valor
      const temporal_primero_ri = datos_grafico_rod_izq_matriz.map((fila) => fila[0][0]);
      const suma_primer_ri = temporal_primero_ri.reduce((acum, valor) => acum + valor, 0);
      const promedio_primer_ri = suma_primer_ri / temporal_primero_ri.length;
      promedio_todos_angulos_rodilla_izq.push(parseFloat(promedio_primer_ri.toFixed(2)));

      // Promedios de los valores del segundo al penúltimo
      for (let i = 0; i < 10; i++) {
        const temporal_ri = [];
        datos_grafico_rod_izq_matriz.forEach((fila) => {
          fila.slice(1, -1).forEach((valor) => {
            if (valor[1] >= 10 * i && valor[1] <= 9.999 * (i + 1)) {
              temporal_ri.push(valor[0]);
            }
          });
          if (!temporal_ri.length) {
            const lar = fila.length;
            temporal_ri.push((fila[lar - 2][0] + fila[lar - 1][0]) / 2);
          }
        });
        const suma_ri = temporal_ri.reduce((acum, valor) => acum + valor, 0);
        const promedio_ri = suma_ri / temporal_ri.length;
        promedio_todos_angulos_rodilla_izq.push(parseFloat(promedio_ri.toFixed(2)));
      }

      // Promedio del último valor
      const temporal_ultimo_ri = datos_grafico_rod_izq_matriz.map((fila) => fila[fila.length - 1][0]);
      const suma_ultimo_ri = temporal_ultimo_ri.reduce((acum, valor) => acum + valor, 0);
      const promedio_ultimo_ri = suma_ultimo_ri / temporal_ultimo_ri.length;
      promedio_todos_angulos_rodilla_izq.push(parseFloat(promedio_ultimo_ri.toFixed(2)));

     


      const porcentajes = [  0, 9, 18, 27, 36, 45, 55, 64, 73, 82, 91, 100];



      
        let ctx = document.getElementById("myChart").getContext("2d");

        let datasets_ci = ang_izq_cad_grafico_divido_sc.map((_, i) => {
          return {
            label: `Zancada ${i + 1}`,
            data: datos_grafico_cad_izq[i],
            borderColor: `rgb(${i * 20}, ${255 - i * 90}, ${i * 20})`,
            fill: false,
          };
        });
        
        if (ang_izq_cad_grafico_divido_sc.length > 1) {
          datasets_ci.push({
            label: "Promedio",
            data: promedio_todos_angulos_cadera_izq,
            borderColor: "black",
            borderWidth: 10,
            pointRadius: 2,
            fill: false,
          });
        }
        
        sessionStorage.setItem("datasets_ci", JSON.stringify(datasets_ci));

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
      
      
    


      //Medir manual: labels: xValuesri, datasets: datasetsri;
      //Medir automatico sin homogenizar: labels: percentages_max, datasets: datasets_divido_manual;
      let ctx_ri = document.getElementById("myChartri").getContext("2d");

      let datasets_ri = ang_izq_rod_grafico_divido_sc.map((_, i) => {
        return {
          label: `Zancada ${i + 1}`,
          data: datos_grafico_rod_izq[i],
          borderColor: `rgb(${i * 20}, ${255 - i * 90}, ${i * 20})`,
          fill: false,
        };
      });
      
      if (ang_izq_rod_grafico_divido_sc.length > 1) {
        datasets_ri.push({
          label: "Promedio",
          data: promedio_todos_angulos_rodilla_izq,
          borderColor: "black",
          borderWidth: 10,
          pointRadius: 2,
          fill: false,
        });
      }
      sessionStorage.setItem("datasets_ri", JSON.stringify(datasets_ri));
     
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
      document.getElementById("myChartri").style.display = "block";
     
    } else {
      document.getElementById("myChart").style.display = "none";
      document.getElementById("myChartri").style.display = "none";
      document.getElementById("marcha-humana-wrapper").style.display = "none";
      document.getElementById("container-izq").style.display = "none";
      document.getElementById("capturas-container").style.height = "90vh";
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
          
          document.getElementById("capturas-container").style.marginTop = " -100rem";
          document.getElementById("capturas-container").style.height = "8vh";
          document.getElementById("marcha-humana-wrapper").style.display = "block";
          document.getElementById("container-der").style.display = "block";

          //Importo los datos para mostrar las variables de la marcha
          // Primero con respecto a los parametros espacio-temporales
          
          var velocidad = JSON.parse(sessionStorage.getItem("velocidad_camina"));
          var cadencia = JSON.parse(sessionStorage.getItem("cadencia_camina"));
          var longitudPaso = JSON.parse(sessionStorage.getItem("Longitud_paso"));
          var longitudZancada = JSON.parse(sessionStorage.getItem("Longitud_zancada"));
         
          //Segundo para los parametros angulares
          var ang_der_cad_grafico = JSON.parse(sessionStorage.getItem("ang_der_cad_grafico"));
          var ang_der_rod_grafico = JSON.parse(sessionStorage.getItem("ang_der_rod_grafico"));
          var posicion_pie_x_grafico_der = JSON.parse(sessionStorage.getItem("posicion_pie_x_grafico_der"));
          
          //Esta funcion lo que hace es devolver varios subarreglos con dos valores cada uno
          //El primero representa en que momento el pie empieza a moverse en el eje x
          // y el segundo en que momento deja de moverse
          function indicesPie(posicion_pie) {
            let positiveChangeRateIndexes = [];
              
            for (let i = 1; i < posicion_pie.length; i++) {
              const change_rate_i = Math.abs(posicion_pie[i] - posicion_pie[i - 1]) / posicion_pie[i - 1];
              if (change_rate_i > 0.01) {
                positiveChangeRateIndexes.push(i);
              }
            }
          
            function divideArray(array) {
              let result = [];
              let subarray = [array[0]];
              for (let i = 1; i < array.length; i++) {
                if (array[i] - array[i - 1] > 1) {
                  subarray.push(array[i - 1]);
                  result.push(subarray);
                  subarray = [array[i]];
                }
              }
              subarray.push(array[array.length - 1]);
              result.push(subarray);
              return result;
            }
            
            let subarrays = divideArray(positiveChangeRateIndexes);
          
            // Filter out subarrays with a difference smaller than 2
            subarrays = subarrays.filter(subarray => (subarray[subarray.length-1] - subarray[0]) >= 2);
            
            return subarrays;
          }
          
          //Esta funcion devuelve el arreglo con los angulos en distintos subarreglo tomando en cuenta los valores
          // de los subarreglos de la funcion indicesPie. De esa manera queda separado en subarreglos que representa
          //una zancada cada uno
          function divideGraph(ang_grafico, subarrays) {
            let result = [];
            let lastEnd = 0;
          
            for (let i = 0; i < subarrays.length; i++) {
              let subarray = ang_grafico.slice(lastEnd, subarrays[i][subarrays[i].length-1]);
              if (i === subarrays.length - 1) {
                subarray.push(ang_grafico[ang_grafico.length - 1]);
              }
              result.push(subarray);
              lastEnd = subarrays[i][subarrays[i].length-1];
            }
          
            return result;
          }
          
          //Obtenemos los indice en los cuales hay zancadas
          let subarreglos_indices_pie_der = indicesPie(posicion_pie_x_grafico_der);
          console.log(posicion_pie_x_grafico_der);
          console.log(subarreglos_indices_pie_der);
          //Dividimos el arreglo de angulos en base a eso indices
          let ang_der_cad_grafico_divido = divideGraph(ang_der_cad_grafico,subarreglos_indices_pie_der);
          let ang_der_rod_grafico_divido = divideGraph(ang_der_rod_grafico,subarreglos_indices_pie_der);
          //Le quitamos las comas a los valores (sino no los grafica)
          const ang_der_cad_grafico_divido_sc = ang_der_cad_grafico_divido.map(subarreglo => {
            return subarreglo.map(elemento => parseInt(elemento));
          });
          const ang_der_rod_grafico_divido_sc = ang_der_rod_grafico_divido.map(subarreglo => {
            return subarreglo.map(elemento => parseInt(elemento));
          });


          //Calcula el promedio de la fase de apoyo
          function fase_de_apoyo(arr) {
            let resultado = [];
            let div = arr[0][0] / arr[0][1];
            resultado.push(div);
          
            for (let i = 1; i < arr.length; i++) {
              let num1 = arr[i][0] - arr[i - 1][1];
              let num2 = arr[i][1] - arr[i - 1][1];
              div = num1 / num2;
              resultado.push(div);
            }
          
            let sumatoria = resultado.reduce((acumulado, actual) => acumulado + actual);
            let promedio = (sumatoria / resultado.length)*100;
          
            return promedio;
          }
          
     
          let fase_apoyo_der= fase_de_apoyo(subarreglos_indices_pie_der).toFixed(2);
          sessionStorage.setItem("fase_apoyo_der", JSON.stringify(fase_apoyo_der));
          if (velocidad === null) {
            document.getElementById("velocidad").innerHTML = "Debe medir distancia para poder observar los parametros espacio-temporales y guardar datos para los ángulos ";
            document.getElementById("cadencia").innerHTML = "";
            document.getElementById("longitud_paso").innerHTML = "";
            document.getElementById("longitud_zancada").innerHTML = "";
            document.getElementById("fase_de_apoyo").innerHTML = "";
            document.getElementById("grafico_titulo_cd").style.display = "none";
            document.getElementById("grafico_titulo_rd").style.display = "none";
            document.getElementById("container-der").style.display = "none";
            document.getElementById("capturas-container").style.marginTop = " -20rem";
        
          } else {
            document.getElementById("velocidad").innerHTML ="Velocidad de caminata: " + velocidad + " m/s";
            document.getElementById("cadencia").innerHTML = "Cadencia de caminata: "  + cadencia + " pasos/minuto";
            document.getElementById("longitud_paso").innerHTML ="Longitud de paso: "  + longitudPaso + " metros";
            document.getElementById("longitud_zancada").innerHTML ="Longitud de zancada: " + longitudZancada + " metros";
            document.getElementById("fase_de_apoyo").innerHTML = "Fase de apoyo: "+ fase_apoyo_der + " %";
          }

          //Como los distintos subarreglos que conforman el arreglo de los angulos tienen distintas longitudes
          //va a necesitar que queden homogenizados para poder graficarlos (poner en intervalos y promediarlos)
          //De esa manera devuelve el arreglo con todos los subarreglos del mismo tamano
          function HomogenizarDatos(arreglo) {
            const n = arreglo.length;
            let subarreglo = [];
            let subarregloPorcentaje = [];
            
        
            for (let i = 0; i < n; i++) {
              subarregloPorcentaje.push(((i / (n - 1)) * 100).toFixed(2));
              subarreglo.push(arreglo[i]);
            }
          
            let temporal = [];
            let datos_grafico = [];
            datos_grafico[0] = arreglo[0];
          
            for (let i = 0; i < 10; i++) {
              for (let j = 1; j < n; j++) {
                if (
                  subarregloPorcentaje[j] >= 10 * i &&
                  subarregloPorcentaje[j] <= 9.999 * (i + 1)
                ) {
                  temporal.push(subarreglo[j]);
                }
              }
          
              let suma = temporal.reduce(
                (acumulador, valorActual) => acumulador + valorActual,
                0
              );
              let promedio = suma / temporal.length;
              datos_grafico.push(promedio);
              temporal = [];
            }
            datos_grafico.push(arreglo[n - 1]);
          
            for (let k = 0; k < 11; k++) {
              if (isNaN(datos_grafico[k])) {
                datos_grafico[k] = (datos_grafico[k - 1] + datos_grafico[k + 1]) / 2;
              }
            }
            return datos_grafico;
          }

          //Arma una matriz con los datos homogenizados para que despues sea mas facil calcular el promedio general
          function armarMatriz(arreglo) {
            const n = arreglo.length;
            let subarregloPorcentaje = [];
          
            for (let i = 0; i < n; i++) {
              subarregloPorcentaje.push(((i / (n - 1)) * 100).toFixed(2));
            }
          
            let matriz = [];
          
            for (let i = 0; i < n; i++) {
              matriz.push([arreglo[i], subarregloPorcentaje[i]]);
            }
            
            return matriz;
          }
          
          datos_grafico_cad_der= ang_der_cad_grafico_divido_sc.map(HomogenizarDatos);
          console.log(datos_grafico_cad_der);
          datos_grafico_cad_der_matriz= datos_grafico_cad_der.map(armarMatriz);
          console.log(datos_grafico_cad_der_matriz);
          datos_grafico_rod_der= ang_der_rod_grafico_divido_sc.map(HomogenizarDatos);
          datos_grafico_rod_der_matriz= ang_der_rod_grafico_divido_sc.map(armarMatriz);





          const promedio_todos_angulos_cadera_der= [];
      
          // Promedio del primer valor
          const temporal_primero_cd = datos_grafico_cad_der_matriz.map((fila) => fila[0][0]);
          const suma_primer_cd = temporal_primero_cd.reduce((acum, valor) => acum + valor, 0);
          const promedio_primer_cd = suma_primer_cd / temporal_primero_cd.length;
          promedio_todos_angulos_cadera_der.push(parseFloat(promedio_primer_cd.toFixed(2)));
          
          // Promedios de los valores del segundo al penúltimo
          for (let i = 0; i < 10; i++) {
            const temporal_cd = [];
            datos_grafico_cad_der_matriz.forEach((fila) => {
              fila.slice(1, -1).forEach((valor) => {
                if (valor[1] >= 10 * i && valor[1] <= 9.999 * (i + 1)) {
                  temporal_cd.push(valor[0]);
                }
              });
              if (!temporal_cd.length) {
                const lar = fila.length;
                temporal_cd.push((fila[lar - 2][0] + fila[lar - 1][0]) / 2);
              }
            });
            const suma_cd = temporal_cd.reduce((acum, valor) => acum + valor, 0);
            const promedio_cd = suma_cd / temporal_cd.length;
            promedio_todos_angulos_cadera_der.push(parseFloat(promedio_cd.toFixed(2)));
          }
          
          // Promedio del último valor
          const temporal_ultimo_cd = datos_grafico_cad_der_matriz.map((fila) => fila[fila.length - 1][0]);
          const suma_ultimo_cd = temporal_ultimo_cd.reduce((acum, valor) => acum + valor, 0);
          const promedio_ultimo_cd = suma_ultimo_cd / temporal_ultimo_cd.length;
          promedio_todos_angulos_cadera_der.push(parseFloat(promedio_ultimo_cd.toFixed(2)));
          
         
          
          const promedio_todos_angulos_rodilla_der = [];
    
          // Promedio del primer valor
          const temporal_primero_rd = datos_grafico_rod_der_matriz.map((fila) => fila[0][0]);
          const suma_primer_rd = temporal_primero_rd.reduce((acum, valor) => acum + valor, 0);
          const promedio_primer_rd = suma_primer_rd / temporal_primero_rd.length;
          promedio_todos_angulos_rodilla_der.push(parseFloat(promedio_primer_rd.toFixed(2)));
    
          // Promedios de los valores del segundo al penúltimo
          for (let i = 0; i < 10; i++) {
            const temporal_rd = [];
            datos_grafico_rod_der_matriz.forEach((fila) => {
              fila.slice(1, -1).forEach((valor) => {
                if (valor[1] >= 10 * i && valor[1] <= 9.999 * (i + 1)) {
                  temporal_rd.push(valor[0]);
                }
              });
              if (!temporal_rd.length) {
                const lar = fila.length;
                temporal_rd.push((fila[lar - 2][0] + fila[lar - 1][0]) / 2);
              }
            });
            const suma_rd = temporal_rd.reduce((acum, valor) => acum + valor, 0);
            const promedio_rd = suma_rd / temporal_rd.length;
            promedio_todos_angulos_rodilla_der.push(parseFloat(promedio_rd.toFixed(2)));
          }
    
          // Promedio del último valor
          const temporal_ultimo_rd = datos_grafico_rod_der_matriz.map((fila) => fila[fila.length - 1][0]);
          const suma_ultimo_rd = temporal_ultimo_rd.reduce((acum, valor) => acum + valor, 0);
          const promedio_ultimo_rd = suma_ultimo_rd / temporal_ultimo_rd.length;
          promedio_todos_angulos_rodilla_der.push(parseFloat(promedio_ultimo_rd.toFixed(2)));
    
         
    
    
          const porcentajes = [  0, 9, 18, 27, 36, 45, 55, 64, 73, 82, 91, 100];
    
          let ctxcd = document.getElementById("myChartcd").getContext("2d");
    
          let datasets_cd = ang_der_cad_grafico_divido_sc.map((_, i) => {
            return {
              label: `Zancada ${i + 1}`,
              data: datos_grafico_cad_der[i],
              borderColor: `rgb(${i * 20}, ${255 - i * 90}, ${i * 20})`,
              fill: false,
            };
          });
          
          if (ang_der_cad_grafico_divido_sc.length > 1) {
            datasets_cd.push({
              label: "Promedio",
              data: promedio_todos_angulos_cadera_der,
              borderColor: "black",
              borderWidth: 10,
              pointRadius: 2,
              fill: false,
            });
          }
          sessionStorage.setItem("datasets_cd", JSON.stringify(datasets_cd));
          new Chart(ctxcd, {
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

          let datasets_rd = ang_der_rod_grafico_divido_sc.map((_, i) => {
            return {
              label: `Zancada ${i + 1}`,
              data: datos_grafico_rod_der[i],
              borderColor: `rgb(${i * 20}, ${255 - i * 90}, ${i * 20})`,
              fill: false,
            };
          });
          
          if (ang_der_rod_grafico_divido_sc.length > 1) {
            datasets_rd.push({
              label: "Promedio",
              data: promedio_todos_angulos_rodilla_der,
              borderColor: "black",
              borderWidth: 10,
              pointRadius: 2,
              fill: false,
            });
          }
          sessionStorage.setItem("datasets_rd", JSON.stringify(datasets_rd));
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
          document.getElementById("myChartrd").style.display = "block";
         
        } else {
          document.getElementById("myChartcd").style.display = "none";
          document.getElementById("myChartrd").style.display = "none";
          document.getElementById("container-der").style.display = "none";
         
        }
        });
        });

