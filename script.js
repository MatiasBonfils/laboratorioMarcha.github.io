//------------------------------------------------------------------------------------------------------//
//Estas líneas de código definen algunas constantes
//y una opción necesarias para usar la biblioteca MediaPipe Pose en una aplicación web..
const controls = window;
const drawingUtils = window;
const mpPose = window;
//importa la libreria de mediapipe pose
const options = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
    }
};
//------------------------------------------------------------------------------------------------------//
//Boton que al presionarlo se redirije a la proxima página la cual es analizar.html
document.getElementById("myButton").addEventListener("click", function() {
    window.location.href = "analizar.html";
  });
//------------------------------------------------------------------------------------------------------//
// Estas líneas de código definen variables para diferentes elementos del DOM (Modelo de Objetos del Documento)
// que se utilizan para la entrada de video, la salida de video, el contenedor general y los controles de la aplicación.
// Luego, la variable canvasCtx se utiliza para obtener el contexto de representación en 2D del elemento canvasElement.

//Esta línea de código busca en el documento un elemento que tenga la clase CSS input_video y asigna el primer elemento encontrado a la constante videoElement
const videoElement = document.getElementsByClassName('input_video')[0];
//esta línea de código busca un elemento que tenga la clase CSS output_canvas y asigna el primer elemento encontrado a la constante canvasElement.
const canvasElement = document.getElementsByClassName('output_canvas')[0];
//, esta línea de código busca un elemento que tenga la clase CSS container y asigna el primer elemento encontrado a la constante containerElement.
const containerElement = document.getElementsByClassName('container')[0];
//Esta línea de código busca un elemento que tenga la clase CSS control-panel y asigna el primer elemento encontrado a la constante controlsElement.
const controlsElement = document.getElementsByClassName('control-panel')[0];
//sta línea de código obtiene el contexto de representación en 2D del elemento canvasElement y lo asigna a la constante canvasCtx. 
//Esto permitirá el dibujo y la manipulación de los gráficos en el elemento canvasElement usando la API Canvas de HTML5.
const canvasCtx = canvasElement.getContext('2d');
//------------------------------------------------------------------------------------------------------//

//Este bloque de código define variables para el panel de control,
// así como también cambia algunos parámetros de la detección de puntos.
const solutionOptions = {
    selfieMode: false, //Alterna en modo espejo del video
    modelComplexity: 1, 
    smoothLandmarks: true,
    lineasPosturales: false,
    lineaCadera: false,
    lineaHombro: false,
    lineaTronco: false,
    lineaColumna: false,
    rotIntExt: false,
    angulosMarcha: false,
    valgo_varo: false,
    guardar_datos: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
};

//------------------------------------------------------------------------------------------------------//
// Este bloque de codigo realiza las funcionalidades de tomar captura del video
//Define las variables donde se van a guardar las capturas y contador cuenta la cantidad de imagenes guardadas
var imagesCaptured = [];
var contador = 0;
//Define el botón que al presionarlo activa la función de tomar captura
var captureButton = document.getElementById("capture-button");

//Esta función verifica si hay menos de 4 capturas, que es el máximo permitido, y antes de guardarlas reduce su resolución para poder guardar más.
captureButton.addEventListener("click", function() {
  if (contador < 4) {
    var dataURL = canvasElement.toDataURL("image/jpeg", 0.95); // JPEG para ahorrar espacio
    var img = new Image();
    img.onload = function() {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      var resizedDataUrl = canvas.toDataURL("image/jpeg", 0.5); // Escalar la imagen al 50% del tamaño original
      sessionStorage.setItem("imgData" + contador, resizedDataUrl.replace(/^data:image\/(png|jpg);base64,/, ""));
      contador++;
    }
    console.log(dataURL);
    img.src = dataURL;
  }
});

//------------------------------------------------------------------------------------------------------//
// El siguiente bloque de código está diseñado para medir la distancia y 
//guardar los datos localmente en la sessionStorage del navegador.
//Se define variables y botones:
//Muestra en pantalla los datos obtenidos
let screenLog = document.querySelector('#screen-log');
//Define el botón que al presionarlo activa la función de tomar datos
let coordBtn = document.querySelector('#coord-btn');
//Muestra los guardados
let showCoordsBtn = document.querySelector('#show-coords-btn');
//Variable que guarda los puntos tomados en la pantalla
let savedCoords = [];
//Variable que avisa al programa que se esta tomando datos o no
let saveCoordsEnabled = false;
//Variable que guarda los datos tomados que introdujó el usuario
let savedData = [];
let coordsSaved = 0;
//Nombres de variables donde se van a almacenar las coordenadas de los puntos introducidos por el usuario
let punto_x_zancada_inicial;
let punto_x_zancada_final;
let punto_x_referencia_inicial;
let punto_x_referencia_final;


//Función que permite al usuario tomar puntos en la pantalla
coordBtn.addEventListener('click', toggleSaveCoordinates);
function toggleSaveCoordinates() {
    //Cambia el estado de la variable para pasar entre "Midiendo distancia" a "Medir distancia" (estado original)
  saveCoordsEnabled = !saveCoordsEnabled;
  if (saveCoordsEnabled) {
    //Si esta en modo "Midiendo distancia" el botón de "Tomar captura" desaparece y el de "Medir distancia" cambia
    //de color y de texto. El cursor se convierte en una cruz y sale una advertencia para que el usuario seleccione
    //los puntos de la pantalla 
    document.getElementById('capture-button').style.display = 'none';
    savedCoords = [];
    coordsSaved = 0;
    coordBtn.style.backgroundColor = "#0E6655";
    coordBtn.innerText = "Midiendo distancia";
    document.body.style.cursor = "crosshair";
    document.documentElement.style.cursor = "crosshair";
    document.addEventListener('click', saveCoordinates);
    alert("Seleccione los puntos de referencia de la distancia en la pantalla");
  } else {
    //Regresa al estado original una vez presionado los puntos en la pantalla
    coordBtn.innerText = "Medir distancia";
    coordBtn.style.backgroundColor = "rgb(37, 120, 14)";
    document.body.style.cursor = "";
    document.documentElement.style.cursor = "";
    document.removeEventListener('click', saveCoordinates);
    document.getElementById('capture-button').style.display = 'block';
  }
}
//Función que guarda las coordenadas de los distintos puntos en su variables pertinentes 
function saveCoordinates(e) {
  if (saveCoordsEnabled && coordsSaved < 4) {
    if (e.target !== coordBtn && e.target !== showCoordsBtn) {
      savedCoords.push({x: e.screenX, y: e.screenY});
      coordsSaved++;
      if (coordsSaved === 2) {
        punto_x_referencia_inicial = savedCoords[0].x;
        punto_x_referencia_final = savedCoords[1].x;
        alert("Seleccione los puntos de referencia de la zancada en la pantalla");
      } else if (coordsSaved === 4) {
        punto_x_zancada_inicial = savedCoords[2].x;
        punto_x_zancada_final = savedCoords[3].x;
        document.body.style.cursor = "";
        document.documentElement.style.cursor = "";
        showPopup();
      }
    }
  }
}
//Función que pide al usuario que introduzca la distancia en metros, el tiempo en segundos y la cantidad de pasos. 
//También calcula los parámetros espacio-temporales de la marcha con los datos obtenidos y los guarda en sus variables para ser llamados en la próxima página.
function showPopup() {
    let distanceInput = prompt("Inserte la distancia en metros:");
          let timeInput = prompt("Insertar el tiempo en segundos:");
          let stepsInput = prompt("Cantidad de pasos:");
          let savedData = {
            coords: savedCoords,
            distance: distanceInput,
            time: timeInput,
            steps: stepsInput
            };
    //Calculo las variables 
    let distancia_referencia_pixel = Math.abs(punto_x_referencia_final - punto_x_referencia_inicial);
    let distancia_zancada_pixel = Math.abs(punto_x_zancada_final - punto_x_zancada_inicial);
    let distancia_zancada_metros= (savedData.distance*distancia_zancada_pixel)/distancia_referencia_pixel;
    let distanceWalked = ((savedData.distance) * Math.abs(punto_x_zancada_final - punto_x_zancada_inicial)) / Math.abs(punto_x_referencia_final - punto_x_referencia_inicial);
    let stepLength = distanceWalked / savedData.steps;
    let strideLength = stepLength * 2;
    let velocity = distanceWalked / savedData.time;
    let cadencia= (savedData.steps)*60/ savedData.time;
    //Guardo las variables para pasarlas a la siguiente pagina
    sessionStorage.setItem("cantidad_pasos", JSON.stringify(stepsInput));
    sessionStorage.setItem("distancia_caminada", JSON.stringify(distancia_zancada_metros.toFixed(2)));       
    sessionStorage.setItem("velocidad_camina", JSON.stringify(velocity.toFixed(2)));
    sessionStorage.setItem("cadencia_camina", JSON.stringify(cadencia.toFixed(2)));
    sessionStorage.setItem("Longitud_paso", JSON.stringify(stepLength.toFixed(2)));
    sessionStorage.setItem("Longitud_zancada", JSON.stringify(strideLength.toFixed(2)));
    //Aviso al usuario de los valores obtenidos 
    let message = `Distancia caminada: ${distancia_zancada_metros.toFixed(2)} metros\n`;
    message += `Velocidad: ${velocity.toFixed(2)} m/s\n`;
    message += `Cadencia: ${cadencia.toFixed(2)} pasos/minutos\n`;
    message += `Longitud de paso: ${stepLength.toFixed(2)} metros\n`;
    message += `Longitud de zancada: ${strideLength.toFixed(2)} metros\n\n`;
    
    
  alert(message);
  //Cambio de formato del botón de medir y la vuelta del botón de "tomar captura"
  document.getElementById('capture-button').style.display = 'block';
  coordBtn.innerText = "Medir distancia";
  coordBtn.style.backgroundColor = "rgb(37, 120, 14)";
  
  }
  
//------------------------------------------------------------------------------------------------------//
  
//Rectangulos que muestran los datos durante la marcha. 
const rectangulo_lh = document.getElementById("rectangulo_lh"); //Muestra el ángulo de inclinación del hombro derecho en el plano frontal.
const rectangulo_lc = document.getElementById("rectangulo_lc"); // Muestra el ángulo de inclinación de la cadera derecha en el plano frontal.
const rectangulo_arotd = document.getElementById("rectangulo_arotd"); // Muestra el ángulo de rotación de cadera de la pierna derecha.
const rectangulo_aroti = document.getElementById("rectangulo_aroti"); // Muestra el ángulo de rotación de cadera de la pierna izquierda.
const rectangulo_aci = document.getElementById("rectangulo_aci"); // Muestra el ángulo articular de la cadera izquierda durante la marcha.
const rectangulo_ari = document.getElementById("rectangulo_ari"); // Muestra el ángulo articular de la rodilla izquierda durante la marcha.
const rectangulo_acd = document.getElementById("rectangulo_acd"); // Muestra el ángulo articular de la cadera derecha durante la marcha.
const rectangulo_ard = document.getElementById("rectangulo_ard"); // Muestra el ángulo articular de la rodilla derecha durante la marcha.
//------------------------------------------------------------------------------------------------------//

// Muestra los fps en el panel de control
const fpsControl = new controls.FPS();

//------------------------------------------------------------------------------------------------------//
//Bloque para definir variables auxiliares que nos van a servir para las funciones
//Variables que guardan los angulos durante la marcha
let ang_izq_cad_grafico = [];
let ang_der_cad_grafico = [];
let ang_izq_rod_grafico = [];
let ang_der_rod_grafico = [];
let posicion_pie_x_grafico_izq= [];
let posicion_pie_x_grafico_der= [];
let p_p_pie_x= [];
//Variables que guardan los ángulos durante la rotación interna exterma
let angulo_rot_int_cad_izq=[];
let angulo_rot_int_cad_der=[];
let marcador =0; 
// ángulos inciales para la rotación interna exterma  
let max_angulo_rot_int_cad_izq = -200; // 
let min_angulo_rot_int_cad_izq = 200; // 
let max_angulo_rot_int_cad_der = -200; //
let min_angulo_rot_int_cad_der = 200; // 
//Variables que guardan los ángulos de inclinación durante la prueba postural
let  angulo_inclinacion_cadera_let=[];
let  angulo_inclinacion_hombro_let= [];
//------------------------------------------------------------------------------------------------------//
//Dibuja una caja con el modelo en 3D del esqueleto pero no se muestra  y al borrar salta error
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
const grid = new LandmarkGrid(landmarkContainer, {
    connectionColor: 0xCCCCCC,
    definedColors: [{ name: 'LEFT', value: 0xffa500 }, { name: 'RIGHT', value: 0x00ffff }],
    range: 2,
    fitToGrid: true,
    labelSuffix: 'm',
    landmarkSize: 2,
    numCellsPerAxis: 4,
    showHidden: false,
    centered: true,
});
//------------------------------------------------------------------------------------------------------//
//Entramos en las funcionalidades que hace cuando destecta la pose
let activeEffect = 'mask';
function onResults(results) {


    // Actulizamos los fotogramas
    fpsControl.tick();
    // Dibujamos el esqueleto
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.segmentationMask) {
        if (activeEffect === 'mask' || activeEffect === 'both') {
            canvasCtx.globalCompositeOperation = 'source-in';
            canvasCtx.fillStyle = '#00FFF07F';
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        }
        else {
            canvasCtx.globalCompositeOperation = 'source-out';
            canvasCtx.fillStyle = '#0000FF7F';
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        }
        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.globalCompositeOperation = 'source-over';
    }
    else {
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    }
    //------------------------------------------------------------------------------------------------------//
    //Si destecta la pose, guardamos las coordenas de cada punto 
    if (results.poseLandmarks) {
        let mandibula_i_x = canvasElement.width * results.poseLandmarks[7].x;
        let mandibula_i_y = canvasElement.height * results.poseLandmarks[7].y;
        let mandibula_i_z=  results.poseLandmarks[7].z;
        let mandibula_d_x = canvasElement.width * results.poseLandmarks[8].x;
        let mandibula_d_y = canvasElement.height * results.poseLandmarks[8].y;
        let mandibula_d_z= results.poseLandmarks[8].z;
        let hombro_i_x = canvasElement.width * results.poseLandmarks[11].x;
        let hombro_i_y = canvasElement.height * results.poseLandmarks[11].y;
        let hombro_d_x = canvasElement.width * results.poseLandmarks[12].x;
        let hombro_d_y = canvasElement.height * results.poseLandmarks[12].y;
        let cadera_i_x = canvasElement.width * results.poseLandmarks[23].x;
        let cadera_i_y = canvasElement.height * results.poseLandmarks[23].y;
        let cadera_d_x = canvasElement.width * results.poseLandmarks[24].x;
        let cadera_d_y = canvasElement.height * results.poseLandmarks[24].y;
        let rodilla_i_x = canvasElement.width * results.poseLandmarks[25].x;
        let rodilla_i_y = canvasElement.height * results.poseLandmarks[25].y;
        let rodilla_d_x = canvasElement.width * results.poseLandmarks[26].x;
        let rodilla_d_y = canvasElement.height * results.poseLandmarks[26].y;
        let tobillo_i_x = canvasElement.width * results.poseLandmarks[27].x;
        let tobillo_i_y = canvasElement.height * results.poseLandmarks[27].y;
        let tobillo_d_x = canvasElement.width * results.poseLandmarks[28].x;
        let tobillo_d_y = canvasElement.height * results.poseLandmarks[28].y;
        let talon_i_x   = canvasElement.width * results.poseLandmarks[29].x;
        let talon_d_x   = canvasElement.width * results.poseLandmarks[30].x;
        let pie_i_x     = canvasElement.height * results.poseLandmarks[31].x;
         //------------------------------------------------------------------------------------------------------//
        //Mostramos RECTANGULOS
        //Lineas posturales
        //Hombro y cadera
        if (solutionOptions.lineasPosturales) {
            rectangulo_lh.style.display = "block";
            rectangulo_lc.style.display = "block";
        }
        else {
            
            rectangulo_lh.style.display = "none";
            rectangulo_lc.style.display = "none";
        }
        ;
        // Ángulo de rotación de cadera
        if (solutionOptions.rotIntExt) {
            rectangulo_arotd.style.display = "block";
            rectangulo_aroti.style.display = "block";
        }
        else {
            rectangulo_arotd.style.display = "none";
            rectangulo_aroti.style.display = "none";
        }
        ;
        //Ángulos de la marcha
        //lado izquierdo, Si se da que el lado izquiedo esta mas cerca de la pantalla que el lado derecho (coordenada z)
        //Muestra los Ángulos del lado izquierdo.
        if (solutionOptions.angulosMarcha && (mandibula_i_z < mandibula_d_z)) {
            rectangulo_aci.style.display = "block";
            rectangulo_ari.style.display = "block";
        }
        else {
            rectangulo_aci.style.display = "none";
            rectangulo_ari.style.display = "none";
        }
        ;
        //lado derecho
        if (solutionOptions.angulosMarcha && (mandibula_i_z > mandibula_d_z)) {
            rectangulo_acd.style.display = "block";
            rectangulo_ard.style.display = "block";
        }
        else {
            rectangulo_acd.style.display = "none";
            rectangulo_ard.style.display = "none";
        }
        ;
        //------------------------------------------------------------------------------------------------------//
        //Colores para los puntos del esqueleto
        //Se colocan un D verde y una I roja en la esquina superior izquierda
        // para indicar el color de cada punto del esqueleto (D=derecha color verde, I=Izquierda color rojo)
        canvasCtx.fillStyle = '#00cc00';
		canvasCtx.font = 'bold 45px Arial';
		canvasCtx.fillText('D', 45, 70);
        canvasCtx.fillStyle = '#e60000';
        canvasCtx.font = 'bold 45px Arial';
        canvasCtx.fillText('I', 110, 70);
        //DIbuja todos los puntos si no esta activada la funcion de la linea postural en el plano sagital
        if (!solutionOptions.lineaColumna) {
        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.35, color: 'black' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: '#8b2222' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: '#228B22' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: 'white' });
        }
        // En caso de estar activada la función de línea postural en el plano sagital, 
        //lo que se hace es ocultar los puntos del esqueleto que están más alejados de la cámara, 
        //para lograr que no se superpongan los puntos innecesarios.
        else{
            if( mandibula_i_z < mandibula_d_z ){
                drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.35, color: 'black' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: '#8b2222' });
             }
            else{
                drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.35, color: 'black' });
           
                drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
                    .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: '#228B22' });
                }
   
        }

        //------------------------------------------------------------------------------------------------------//
        //Bloque para dibujar lineas auxiliares de la pose frontal.
        //dibujar linea de mandibula
        let mdx = mandibula_d_x;
        let mdy = (mandibula_d_y - mandibula_i_y) / 2 + mandibula_i_y;
        let mix = mandibula_i_x;
        let miy = (mandibula_d_y - mandibula_i_y) / 2 + mandibula_i_y;
        if (solutionOptions.lineasPosturales) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(mdx, mdy);
            canvasCtx.lineTo(mix, miy);
            canvasCtx.strokeStyle = "white";
            canvasCtx.setLineDash([15, 25]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //dibujar linea de cadera
        let cdx = cadera_d_x;
        let cdy = (cadera_d_y - cadera_i_y) / 2 + cadera_i_y;
        let cix = cadera_i_x;
        let ciy = (cadera_d_y - cadera_i_y) / 2 + cadera_i_y;
        if (solutionOptions.lineasPosturales) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(cdx, cdy);
            canvasCtx.lineTo(cix, ciy);
            canvasCtx.strokeStyle = "white";
             canvasCtx.setLineDash([15, 25]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //Ángulo cadera
        let cateto_ad_cadera = Math.sqrt(Math.pow((cadera_i_y-ciy), 2));
        let cateto_co_cadera = Math.sqrt(Math.pow((cadera_i_x-cadera_d_x)/2, 2));
        let angulo_inclinacion_cadera = Math.atan(cateto_co_cadera / cateto_ad_cadera);
        angulo_inclinacion_cadera = (angulo_inclinacion_cadera * (180) / Math.PI)-90;
        if(cadera_i_y< cadera_d_y){
        angulo_inclinacion_cadera = -1*(angulo_inclinacion_cadera.toFixed(0));
        }
        document.getElementById("ang_linea_cadera").innerHTML = angulo_inclinacion_cadera.toFixed(0) + " ° en lado derecho";
        //dibujar linea de hombro
        let hdx = hombro_d_x;
        let hdy = (hombro_d_y - hombro_i_y) / 2 + hombro_i_y;
        let hix = hombro_i_x;
        let hiy = (hombro_d_y - hombro_i_y) / 2 + hombro_i_y;
        if (solutionOptions.lineasPosturales) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(hdx, hdy);
            canvasCtx.lineTo(hix, hiy);
            canvasCtx.strokeStyle = "white";
             canvasCtx.setLineDash([15, 25]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //Ángulo de hombro
        let cateto_ad_hombro = Math.sqrt(Math.pow((hombro_i_y-hiy), 2));
        let cateto_co_hombro = Math.sqrt(Math.pow((hombro_i_x-hombro_d_x)/2, 2));
        let angulo_inclinacion_hombro = Math.atan(cateto_co_hombro / cateto_ad_hombro);
        angulo_inclinacion_hombro = (angulo_inclinacion_hombro * (180) / Math.PI)-90;
        
        if(hombro_i_y < hombro_d_y){
        angulo_inclinacion_hombro = -1* angulo_inclinacion_hombro.toFixed(0);
        }
        document.getElementById("ang_linea_hombro").innerHTML = angulo_inclinacion_hombro.toFixed(0) + " ° en lado derecho";
        
        if(solutionOptions.guardar_datos && solutionOptions.lineasPosturales){
            angulo_inclinacion_hombro_let= angulo_inclinacion_hombro.toFixed(1);
            angulo_inclinacion_cadera_let = angulo_inclinacion_cadera.toFixed(1);
            console.log(angulo_inclinacion_hombro_let);
        }else{
            angulo_inclinacion_hombro_let= angulo_inclinacion_hombro_let;
            angulo_inclinacion_cadera_let= angulo_inclinacion_cadera_let;
        }

        console.log(angulo_inclinacion_hombro_let);
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_linea_frontal_hombro_2", JSON.stringify(angulo_inclinacion_hombro_let));
            sessionStorage.setItem("ang_linea_frontal_cadera_2", JSON.stringify(angulo_inclinacion_cadera_let));  
            window.location.href = "analizar.html";
        });
        //dibujar linea de media frontal que divide el cuerpo en dos
        let linea_media_punto_incial_x = (hombro_d_x - hombro_i_x) / 2 + hombro_i_x;
        let linea_media_punto_incial_y = ((hombro_d_y - hombro_i_y) / 2 + hombro_i_y)-220;
        let linea_media_punto_final_x = (cadera_d_x - cadera_i_x) / 2 + cadera_i_x;
        let linea_media_punto_final_y = (tobillo_d_y - tobillo_i_y) / 2 + tobillo_i_y;
        if (solutionOptions.lineasPosturales) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(linea_media_punto_incial_x, linea_media_punto_incial_y);
            canvasCtx.lineTo(linea_media_punto_final_x, linea_media_punto_final_y);
            canvasCtx.strokeStyle = "white";
            canvasCtx.setLineDash([25, 15]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
           
        }
        //------------------------------------------------------------------------------------------------------//
        //dibujar linea de media sagital que divide el cuerpo en dos
        let linea_sagital_punto_incial_x = mandibula_i_x;
        let linea_sagital_punto_incial_y = mandibula_i_y;
        let linea_sagital_punto_final_x = tobillo_i_x;
        let linea_sagital_punto_final_y  = tobillo_i_y;
        //Chequeo de qué lado se analiza: si el punto izquierdo de la mandíbula está más cerca de la cámara que el punto derecho, 
        //quiere decir que se van a tomar los puntos del lado izquierdo para trazar la línea.
        if( mandibula_i_z < mandibula_d_z ){
        linea_sagital_punto_incial_x = mandibula_i_x;
        linea_sagital_punto_incial_y = mandibula_i_y;
        linea_sagital_punto_final_x = tobillo_i_x;
        linea_sagital_punto_final_y  = tobillo_i_y;
        }else{
        linea_sagital_punto_incial_x = mandibula_d_x;
        linea_sagital_punto_incial_y = mandibula_d_y;
        linea_sagital_punto_final_x = tobillo_d_x;
        linea_sagital_punto_final_y  = tobillo_d_y;
        }

        if (solutionOptions.lineaColumna) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(linea_sagital_punto_incial_x, linea_sagital_punto_incial_y);
            canvasCtx.lineTo(linea_sagital_punto_final_x, linea_sagital_punto_final_y);
            canvasCtx.strokeStyle = "white";
            canvasCtx.setLineDash([15, 25]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //------------------------------------------------------------------------------------------------------//
        //Dibujar linea de valgo y varo
        //Valgo/varo derecho
        let vvdx_pi = cadera_d_x;
        let vvdy_pi = cadera_d_y;
        let vvdx_pf = tobillo_d_x;
        let vvdy_pf = tobillo_d_y;
        if (solutionOptions.valgo_varo) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(vvdx_pi, vvdy_pi);
            canvasCtx.lineTo(vvdx_pf, vvdy_pf);
            canvasCtx.strokeStyle = "white";
            canvasCtx.setLineDash([15, 30]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        let vvix_pi = cadera_i_x;
        let vviy_pi = cadera_i_y;
        let vvix_pf = tobillo_i_x;
        let vviy_pf = tobillo_i_y;
        if (solutionOptions.valgo_varo) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(vvix_pi, vviy_pi);
            canvasCtx.lineTo(vvix_pf, vviy_pf);
            canvasCtx.strokeStyle = "white";
            canvasCtx.setLineDash([15, 30]);
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //------------------------------------------------------------------------------------------------------//
        //dibujar linea de rotación inter/exter
        //Derecha
        //Linea Horizontal
        let punto_inicial_x_d = ((rodilla_d_x + (rodilla_i_y - tobillo_d_y) * 0.80));
        let punto_inicial_y_d = (rodilla_d_y);
        let punto_final_x_d = ((rodilla_d_x - (rodilla_i_y - tobillo_d_y) * 0.80));
        let punto_final_y_d = (rodilla_d_y);
        if (solutionOptions.rotIntExt) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(punto_inicial_x_d, punto_inicial_y_d);
            canvasCtx.lineTo(punto_final_x_d, punto_final_y_d);
            canvasCtx.setLineDash([5, 5]);
            canvasCtx.strokeStyle = "white";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //Linea Vertical
        let punto_inicial_x_d_v = (rodilla_d_x);
        let punto_inicial_y_d_v = (rodilla_d_y);
        let punto_final_x_d_v = (rodilla_d_x);
        let punto_final_y_d_v = (tobillo_d_y);
        if (solutionOptions.rotIntExt) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(punto_inicial_x_d_v, punto_inicial_y_d_v);
            canvasCtx.lineTo(punto_final_x_d_v, punto_final_y_d_v);
            canvasCtx.setLineDash([5, 5]);
            canvasCtx.strokeStyle = "white";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //Izquierda
        //Linea Horizontal
        // Linea Horizontal
        let punto_inicial_x_i = ((rodilla_i_x + (rodilla_d_y - tobillo_i_y) * 0.80));
        let punto_inicial_y_i = (rodilla_i_y);
        let punto_final_x_i = ((rodilla_i_x - (rodilla_d_y - tobillo_i_y) * 0.80));
        let punto_final_y_i = (rodilla_i_y);
        if (solutionOptions.rotIntExt) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(punto_inicial_x_i, punto_inicial_y_i);
            canvasCtx.lineTo(punto_final_x_i, punto_final_y_i);
            canvasCtx.setLineDash([5, 5]);
            canvasCtx.strokeStyle = "white";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        // Linea Vertical
        let punto_inicial_x_i_v = (rodilla_i_x);
        let punto_inicial_y_i_v = (rodilla_i_y);
        let punto_final_x_i_v = (rodilla_i_x);
        let punto_final_y_i_v = (tobillo_i_y);
        if (solutionOptions.rotIntExt) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(punto_inicial_x_i_v, punto_inicial_y_i_v);
            canvasCtx.lineTo(punto_final_x_i_v, punto_final_y_i_v);
            canvasCtx.setLineDash([5, 5]);
            canvasCtx.strokeStyle = "white";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //Ángulos
        //Ángulos de rotación interna y externa de cadera
         angulo_rot_int_cad_izq = (180 * Math.acos((tobillo_i_x - rodilla_i_x) / (Math.sqrt(Math.pow((tobillo_i_x - rodilla_i_x), 2) + Math.pow((tobillo_i_y - rodilla_i_y), 2)))) / Math.PI) - 90;
        angulo_rot_int_cad_izq = angulo_rot_int_cad_izq.toFixed(0) * -1;
        document.getElementById("ang_rot_cad_izq").innerHTML = angulo_rot_int_cad_izq  + " °";
         angulo_rot_int_cad_der = (180 * Math.acos((tobillo_d_x - rodilla_d_x) / (Math.sqrt(Math.pow((tobillo_d_x - rodilla_d_x), 2) + Math.pow((tobillo_d_y - rodilla_d_y), 2)))) / Math.PI) - 90;
        angulo_rot_int_cad_der = angulo_rot_int_cad_der.toFixed(0)* 1;
        document.getElementById("ang_rot_cad_der").innerHTML = angulo_rot_int_cad_der + " °";
        
      
        //Guarda los valores maximos y minimos de la rotación int/ext del lado izq y derecho
        if (solutionOptions.guardar_datos && solutionOptions.rotIntExt) {
            
            console.log(marcador);
            if(marcador == 0){
                min_angulo_rot_int_cad_izq = 200;
                max_angulo_rot_int_cad_izq =-200;
            }

            //Revisa si hay algun valor menor del lado izq al anterioremente guardado
            if (angulo_rot_int_cad_izq < min_angulo_rot_int_cad_izq) {
                // Actualiza el valor valor minimo si es necesario
                min_angulo_rot_int_cad_izq = angulo_rot_int_cad_izq;
              }
            //Revisa si hay algun valor mayor del lado izq al anterioremente guardado
            if (angulo_rot_int_cad_izq > max_angulo_rot_int_cad_izq) {
                 // Actualiza el valor valor maximo si es necesario
                max_angulo_rot_int_cad_izq = angulo_rot_int_cad_izq;
              }
              document.getElementById("myButton").addEventListener("click", function() {
                sessionStorage.setItem("rot_int_cad_izq_min", JSON.stringify(min_angulo_rot_int_cad_izq.toFixed(1)));
                sessionStorage.setItem("rot_int_cad_izq_max", JSON.stringify(max_angulo_rot_int_cad_izq.toFixed(1)));  
                window.location.href = "analizar.html";
            });
           
           marcador=1;
           console.log(max_angulo_rot_int_cad_izq);
       
        }else{
            min_angulo_rot_int_cad_izq= min_angulo_rot_int_cad_izq;
            max_angulo_rot_int_cad_izq= max_angulo_rot_int_cad_izq;
            marcador =0; 
            console.log(max_angulo_rot_int_cad_izq);
            document.getElementById("myButton").addEventListener("click", function() {
                sessionStorage.setItem("rot_int_cad_izq_min", JSON.stringify(min_angulo_rot_int_cad_izq.toFixed(1)));
                sessionStorage.setItem("rot_int_cad_izq_max", JSON.stringify(max_angulo_rot_int_cad_izq.toFixed(1)));  
                window.location.href = "analizar.html";
            });
        }   
        if (solutionOptions.guardar_datos && solutionOptions.rotIntExt) {
            if (angulo_rot_int_cad_der < min_angulo_rot_int_cad_der) {
                // Actualiza el valor valor minimo si es necesario
                min_angulo_rot_int_cad_der = angulo_rot_int_cad_der;
            }
            //Revisa si hay algun valor mayor del lado der al anterioremente guardado
            if (angulo_rot_int_cad_der > max_angulo_rot_int_cad_der) {
                // Actualiza el valor valor maximo si es necesario
                max_angulo_rot_int_cad_der = angulo_rot_int_cad_der;
            }  
             //b
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("rot_int_cad_der_min", JSON.stringify(min_angulo_rot_int_cad_der.toFixed(1)));
            sessionStorage.setItem("rot_int_cad_der_max", JSON.stringify(max_angulo_rot_int_cad_der.toFixed(1)));
            window.location.href = "analizar.html";
        });
      
        }else{
            min_angulo_rot_int_cad_der= 200;
            max_angulo_rot_int_cad_der= -200;
            document.getElementById("myButton").addEventListener("click", function() {
                sessionStorage.setItem("rot_int_cad_der_min", JSON.stringify(min_angulo_rot_int_cad_der.toFixed(1)));
                sessionStorage.setItem("rot_int_cad_der_max", JSON.stringify(max_angulo_rot_int_cad_der.toFixed(1)));
                window.location.href = "analizar.html";
            });
            
        }           
        //------------------------------------------------------------------------------------------------------//        
        // Ángulos de la marcha
        //Ángulos de cadera
        //IZQ
        var angulo_cadera_i = Math.acos((rodilla_i_y - cadera_i_y) / (Math.sqrt(Math.pow(cadera_i_x - rodilla_i_x, 2) + Math.pow(cadera_i_y - rodilla_i_y, 2))));
        angulo_cadera_i = angulo_cadera_i * (180) / Math.PI;
        //Chequea si la rodilla esta atras o adelante de la cadera en el eje x y en funcion a eso cambia de signo
        if (cadera_i_x > rodilla_i_x) {
            if(solutionOptions.selfieMode){
            angulo_cadera_i = angulo_cadera_i.toFixed(0);
            }
            else{
                angulo_cadera_i =-1* angulo_cadera_i.toFixed(0); 
            }
        }
        else {
            if(solutionOptions.selfieMode){
                angulo_cadera_i = -1*angulo_cadera_i.toFixed(0);
                }
            else{
                angulo_cadera_i = angulo_cadera_i.toFixed(0); 
            }
        }
        // Si el interruptor de "Guardar datos" está activado, se van a guardar los valores de los ángulos. 
        //De caso contrario, borra los datos anteriores.
        if (solutionOptions.guardar_datos) {
            ang_izq_cad_grafico.push(angulo_cadera_i);
            posicion_pie_x_grafico_izq.push(talon_i_x);
            p_p_pie_x.push(pie_i_x);
            document.getElementById("ang_cad_iz").innerHTML = angulo_cadera_i + " ° " + "(" + ang_izq_cad_grafico.length + ")";
            
        }
        else {
            ang_izq_cad_grafico = [];
            posicion_pie_x_grafico_izq= [];
            p_p_pie_x= [];
            document.getElementById("ang_cad_iz").innerHTML = angulo_cadera_i + " ° " + "(" + ang_izq_cad_grafico.length + ")";
        }
        // Vincula el botón que lleva al usuario a la próxima página con los datos guardados.
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_izq_cad_grafico", JSON.stringify(ang_izq_cad_grafico));
            sessionStorage.setItem("posicion_pie_x_grafico_izq", JSON.stringify(posicion_pie_x_grafico_izq));
            window.location.href = "analizar.html";
        });
         
        //DER
        var angulo_cadera_d = Math.acos((rodilla_d_y - cadera_d_y) / (Math.sqrt(Math.pow(cadera_d_x - rodilla_d_x, 2) + Math.pow(cadera_d_y - rodilla_d_y, 2))));
        angulo_cadera_d = angulo_cadera_d * (180) / Math.PI;
        angulo_cadera_d.toFixed(0); 
        if (cadera_d_x < rodilla_d_x) {
            if(solutionOptions.selfieMode){
                angulo_cadera_d = -1*angulo_cadera_d.toFixed(0);
                }
                else{
                    angulo_cadera_d = angulo_cadera_d.toFixed(0); 
                }
        }
        else {

            if(solutionOptions.selfieMode){
                angulo_cadera_d = angulo_cadera_d.toFixed(0);
                }
            else{
                angulo_cadera_d = -1*angulo_cadera_d.toFixed(0); 
            }
        }   
        // Si el interruptor de "Guardar datos" está activado, se van a guardar los valores de los ángulos.
        //De caso contrario, borra los datos anteriores.
        if (solutionOptions.guardar_datos) {
            ang_der_cad_grafico.push(angulo_cadera_d);
            posicion_pie_x_grafico_der.push(talon_d_x)
            document.getElementById("ang_cad_de").innerHTML = angulo_cadera_d + " ° " + "(" + ang_der_cad_grafico.length + ")";
        }
        else {
            ang_der_cad_grafico = [];
            posicion_pie_x_grafico_der = [];
            document.getElementById("ang_cad_de").innerHTML = angulo_cadera_d + " ° " + "(" + ang_der_cad_grafico.length + ")";
        }
        // Vincula el botón que lleva al usuario a la próxima página con los datos guardados.
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_der_cad_grafico", JSON.stringify(ang_der_cad_grafico));
            sessionStorage.setItem("posicion_pie_x_grafico_der", JSON.stringify(posicion_pie_x_grafico_der));
            window.location.href = "analizar.html";
        });
       
        //Ángulos de rodilla
        //Izq
        var femur_iz = Math.sqrt(Math.pow(cadera_i_x - rodilla_i_x, 2) + Math.pow(cadera_i_y - rodilla_i_y, 2));
        var tibia_iz = Math.sqrt(Math.pow(rodilla_i_x - tobillo_i_x, 2) + Math.pow(rodilla_i_y - tobillo_i_y, 2));
        var fem_tob_iz = Math.sqrt(Math.pow(cadera_i_x - tobillo_i_x, 2) + Math.pow(cadera_i_y - tobillo_i_y, 2));
        var sigma_rod_iz = Math.acos((-Math.pow(femur_iz, 2) - Math.pow(tibia_iz, 2) + Math.pow(fem_tob_iz, 2)) / (-2 * femur_iz * tibia_iz)) * (180) / Math.PI;
        var angulo_rodilla_iz = sigma_rod_iz;
        angulo_rodilla_iz = 180 - angulo_rodilla_iz.toFixed(0);
        // Si el interruptor de "Guardar datos" está activado, se van a guardar los valores de los ángulos.
        //De caso contrario, borra los datos anteriores.
        if (solutionOptions.guardar_datos) {
            ang_izq_rod_grafico.push(angulo_rodilla_iz);
            document.getElementById("ang_rod_iz").innerHTML = angulo_rodilla_iz + " ° " + "(" + ang_izq_rod_grafico.length + ")";
        }
        else {
            ang_izq_rod_grafico = [];
            document.getElementById("ang_rod_iz").innerHTML = angulo_rodilla_iz + " ° " + "(" + ang_izq_rod_grafico.length + ")";
        }
        // Vincula el botón que lleva al usuario a la próxima página con los datos guardados.
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_izq_rod_grafico", JSON.stringify(ang_izq_rod_grafico));
            window.location.href = "analizar.html";   
        });
 


        //Rodilla Derecha
        var femur_de = Math.sqrt(Math.pow(cadera_d_x - rodilla_d_x, 2) + Math.pow(cadera_d_y - rodilla_d_y, 2));
        var tibia_de = Math.sqrt(Math.pow(rodilla_d_x - tobillo_d_x, 2) + Math.pow(rodilla_d_y - tobillo_d_y, 2));
        var fem_tob_de = Math.sqrt(Math.pow(cadera_d_x - tobillo_d_x, 2) + Math.pow(cadera_d_y - tobillo_d_y, 2));
        var sigma_rod_de = Math.acos((-Math.pow(femur_de, 2) - Math.pow(tibia_de, 2) + Math.pow(fem_tob_de, 2)) / (-2 * femur_de * tibia_de)) * (180) / Math.PI;
        var angulo_rodilla_de = sigma_rod_de;
        angulo_rodilla_de = 180-angulo_rodilla_de.toFixed(0);
         // Si el interruptor de "Guardar datos" está activado, se van a guardar los valores de los ángulos.
        //De caso contrario, borra los datos anteriores.
        if (solutionOptions.guardar_datos) {
            ang_der_rod_grafico.push(angulo_rodilla_de);
            document.getElementById("ang_rod_de").innerHTML = angulo_rodilla_de + " ° " + "(" + ang_der_rod_grafico.length + ")";
        }
        else {
            ang_der_rod_grafico = [];
            document.getElementById("ang_rod_de").innerHTML = angulo_rodilla_de + " ° " + "(" + ang_der_rod_grafico.length + ")";
           
        }
        // Vincula el botón que lleva al usuario a la próxima página con los datos guardados.
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_der_rod_grafico", JSON.stringify(ang_der_rod_grafico));
            window.location.href = "analizar.html";
        });
       
    }
    canvasCtx.restore();
    if (results.poseWorldLandmarks) {
        grid.updateLandmarks(results.poseWorldLandmarks, mpPose.POSE_CONNECTIONS, [
            { list: Object.values(mpPose.POSE_LANDMARKS_LEFT), color: 'LEFT' },
            { list: Object.values(mpPose.POSE_LANDMARKS_RIGHT), color: 'RIGHT' },
        ]);
    }
    else {
        grid.updateLandmarks([]);
    }
}

const pose = new mpPose.Pose(options);
pose.setOptions(solutionOptions);
pose.onResults(onResults);
// Panel de control que permite mostrar, modificar y guardar parametros del exoesqueleto.
new controls
    .ControlPanel(controlsElement, solutionOptions)
    .add([
    new controls.StaticText({ title: 'CONTROLES' }),
    fpsControl,
    new controls.Toggle({ title: 'Modo Selfie', field: 'selfieMode' }),
    //Permite elegir que fuente de video tomar (webcam o video guardado)
    new controls.SourcePicker({
        onSourceChanged: () => {
            // Se resetea asi anda mejor el codigo
            pose.reset();
        },
        onFrame: async (input, size) => {
            const aspect = size.height / size.width;
            let width, height;
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
            }
            else {
                width = window.innerWidth;
                height = width * aspect;
            }
            canvasElement.width = width;
            canvasElement.height = height;
            await pose.send({ image: input });
        },
    }),
    // Cambia la complejidad del modelo y, con eso, la precisión en la detección de los puntos (más complejidad, más precisión pero más lento).
    new controls.Slider({
        title: 'Complejidad del Modelo',
        field: 'modelComplexity',
        discrete: ['Light', ' Medium', 'Heavy'],
    }),
    //Genera distintos switchs con distintas funciones 
    new controls.Toggle({ title: 'Línea de Valgo/Varo', field: 'valgo_varo' }),
    new controls.Toggle({ title: 'Postura Frontal', field: 'lineasPosturales' }),
    new controls.Toggle({ title: 'Línea Media Sagital', field: 'lineaColumna' }),
    new controls.Toggle({ title: 'Rotación Interna/Externa', field: 'rotIntExt' }),
    new controls.Toggle({ title: 'Ángulos de la Marcha', field: 'angulosMarcha' }),
    new controls.Toggle({ title: 'Guardar Datos', field: 'guardar_datos' }),
   
])
    .on(x => {
    const options = x;
    videoElement.classList.toggle('selfie', options.selfieMode);
    activeEffect = x['effect'];
    pose.setOptions(options);
});

capture