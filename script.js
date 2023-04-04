const controls = window;
const drawingUtils = window;
const mpPose = window;
const options = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
    }
};

document.getElementById("myButton").addEventListener("click", function() {
    window.location.href = "analizar.html";
  });
// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const containerElement = document.getElementsByClassName('container')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');


function resizeCanvas() {
  if (videoElement.videoWidth > videoElement.videoHeight) {
    canvasElement.style.width="90px";
    containerElement.left= "90%";
  } else {
    canvasElement.width = window.innerHeight * (videoElement.videoWidth / videoElement.videoHeight);
    canvasElement.height = window.innerHeight;
  }
}

videoElement.addEventListener('loadedmetadata', resizeCanvas);
window.addEventListener('resize', resizeCanvas);



 
let max_angulo_rot_int_cad_izq = -200; // 
let min_angulo_rot_int_cad_izq = 200; // 
let max_angulo_rot_int_cad_der = -200; //
let min_angulo_rot_int_cad_der = 200; // 




//solution options
const solutionOptions = {
    selfieMode: false,
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

//
var imagesCaptured = [];
var captureButton = document.getElementById("capture-button");

var contador = 0;

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




//distancias:
let screenLog = document.querySelector('#screen-log');
let coordBtn = document.querySelector('#coord-btn');
let showCoordsBtn = document.querySelector('#show-coords-btn');
let savedCoords = [];
let saveCoordsEnabled = false;
let savedData = [];
let coordsSaved = 0;
let punto_x_zancada_inicial;
let punto_x_zancada_final;
let punto_x_referencia_inicial;
let punto_x_referencia_final;



coordBtn.addEventListener('click', toggleSaveCoordinates);

function toggleSaveCoordinates() {
  saveCoordsEnabled = !saveCoordsEnabled;
  if (saveCoordsEnabled) {
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
    coordBtn.innerText = "Medir distancia";
    coordBtn.style.backgroundColor = "rgb(37, 120, 14)";
    document.body.style.cursor = "";
    document.documentElement.style.cursor = "";
    document.removeEventListener('click', saveCoordinates);
    document.getElementById('capture-button').style.display = 'block';
  }
}

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
    
    let message = `Distancia caminada: ${distancia_zancada_metros.toFixed(2)} metros\n`;
    message += `Velocidad: ${velocity.toFixed(2)} m/s\n`;
    message += `Cadencia: ${cadencia.toFixed(2)} pasos/minutos\n`;
    message += `Longitud de paso: ${stepLength.toFixed(2)} metros\n`;
    message += `Longitud de zancada: ${strideLength.toFixed(2)} metros\n\n`;
    
    
  alert(message);
  document.getElementById('capture-button').style.display = 'block';
  coordBtn.innerText = "Medir distancia";
  coordBtn.style.backgroundColor = "rgb(37, 120, 14)";
  
  }
  

  
//Rectangulos que muestran los datos
const rectangulo_lm = document.getElementById("rectangulo_lm");
const rectangulo_lh = document.getElementById("rectangulo_lh");
const rectangulo_lc = document.getElementById("rectangulo_lc");
const rectangulo_arotd = document.getElementById("rectangulo_arotd");
const rectangulo_aroti = document.getElementById("rectangulo_aroti");
const rectangulo_aci = document.getElementById("rectangulo_aci");
const rectangulo_ari = document.getElementById("rectangulo_ari");
const rectangulo_acd = document.getElementById("rectangulo_acd");
const rectangulo_ard = document.getElementById("rectangulo_ard");
// We'll add this to our control panel later, but we'll save it here so we can
// call tick() each time the graph runs.
const fpsControl = new controls.FPS();

//Variables que guardan los angulos durante la marcha
let ang_izq_cad_grafico = [];
let ang_der_cad_grafico = [];
let ang_izq_rod_grafico = [];
let ang_der_rod_grafico = [];

let posicion_pie_x_grafico_izq= [];
let posicion_pie_x_grafico_der= [];
let p_p_pie_x= [];
//Variables que guardan los angulos durante la rotacion interna exterma
let angulo_rot_int_cad_izq=[];
let angulo_rot_int_cad_der=[];

// Optimization: Turn off animated spinner after its hiding animation is done.
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
//
let activeEffect = 'mask';
function onResults(results) {
    let angulo_inclinacion_hombro_let=[];
    let angulo_inclinacion_cadera_let=[];
   
    // Update the frame rate.
    fpsControl.tick();
    // Draw the overlays.
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.segmentationMask) {
        // Only overwrite existing pixels.
        if (activeEffect === 'mask' || activeEffect === 'both') {
            canvasCtx.globalCompositeOperation = 'source-in';
            // This can be a color or a texture or whatever...
            canvasCtx.fillStyle = '#00FF007F';
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
        let pie_i_x     = canvasElement.height * results.poseLandmarks[31].x;
        //DIBUJAR RECTANGULOS
        //Lineas posturales
        //Mandibula
        if (solutionOptions.lineasPosturales) {
            rectangulo_lm.style.display = "block";
            rectangulo_lh.style.display = "block";
            rectangulo_lc.style.display = "block";
        }
        else {
            rectangulo_lm.style.display = "none";
            rectangulo_lh.style.display = "none";
            rectangulo_lc.style.display = "none";
        }
        ;
        // Angulo de rotacion
        if (solutionOptions.rotIntExt) {
            rectangulo_arotd.style.display = "block";
            rectangulo_aroti.style.display = "block";
        }
        else {
            rectangulo_arotd.style.display = "none";
            rectangulo_aroti.style.display = "none";
        }
        ;
        //Angulos de la marcha
        //lado izquierd, Si se da que el lado izquiedo esta mas cerca de la pantalla que el lado derecho (coordenada z)
        //Muestra los angulos del lado izquierdo.
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
       
        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.35, color: 'black' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: '#8b2222' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: '#228B22' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.45, color: 'black', fillColor: 'white' });
        
        
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
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //angulo cadera
        let cateto_ad_cadera = Math.sqrt(Math.pow((cadera_i_y-ciy), 2));
        let cateto_co_cadera = Math.sqrt(Math.pow((cadera_i_x-cadera_d_x)/2, 2));
        let angulo_inclinacion_cadera = Math.atan(cateto_co_cadera / cateto_ad_cadera);
        angulo_inclinacion_cadera = (angulo_inclinacion_cadera * (180) / Math.PI)-90;
        angulo_inclinacion_cadera = -1*(angulo_inclinacion_cadera.toFixed(0));
        document.getElementById("ang_linea_cadera").innerHTML = angulo_inclinacion_cadera + " °";
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
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //angulo de hombro
        let cateto_ad_hombro = Math.sqrt(Math.pow((hombro_i_y-hiy), 2));
        let cateto_co_hombro = Math.sqrt(Math.pow((hombro_i_x-hombro_d_x)/2, 2));
        let angulo_inclinacion_hombro = Math.atan(cateto_co_hombro / cateto_ad_hombro);
        angulo_inclinacion_hombro = (angulo_inclinacion_hombro * (180) / Math.PI)-90;
        angulo_inclinacion_hombro = -1* angulo_inclinacion_hombro.toFixed(0);
        
        document.getElementById("ang_linea_hombro").innerHTML = angulo_inclinacion_hombro + " °";
        
        if(solutionOptions.guardar_datos){
            angulo_inclinacion_hombro_let= angulo_inclinacion_hombro.toFixed(1);
            angulo_inclinacion_cadera_let = angulo_inclinacion_cadera.toFixed(1);
        }else{
            angulo_inclinacion_hombro_let= [];
            angulo_inclinacion_cadera_let = [];
            
        }


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
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //dibujar linea de media sagital que divide el cuerpo en dos
        let linea_sagital_punto_incial_x = mandibula_i_x;
        let linea_sagital_punto_incial_y = mandibula_i_y;
        let linea_sagital_punto_final_x = tobillo_i_x;
        let linea_sagital_punto_final_y  = tobillo_i_y;
        //chequeo de que lado se analiza, si el punto izquierdo de la mandibula esta mas cerca de la camara
        // que el punto derecho, quiere decir que se va a tomar los puntos del lado izquierdo para trazar la
        // linea
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
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        
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
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //dibujar linea de rotacion inter/exter
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
        //Angulos
        //Angulos de rotacion interna y externa de cadera
         angulo_rot_int_cad_izq = (180 * Math.acos((tobillo_i_x - rodilla_i_x) / (Math.sqrt(Math.pow((tobillo_i_x - rodilla_i_x), 2) + Math.pow((tobillo_i_y - rodilla_i_y), 2)))) / Math.PI) - 90;
        angulo_rot_int_cad_izq = angulo_rot_int_cad_izq.toFixed(0) * -1;
        document.getElementById("ang_rot_cad_izq").innerHTML = angulo_rot_int_cad_izq  + " °";
         angulo_rot_int_cad_der = (180 * Math.acos((tobillo_d_x - rodilla_d_x) / (Math.sqrt(Math.pow((tobillo_d_x - rodilla_d_x), 2) + Math.pow((tobillo_d_y - rodilla_d_y), 2)))) / Math.PI) - 90;
        angulo_rot_int_cad_der = angulo_rot_int_cad_der.toFixed(0)* 1;
        document.getElementById("ang_rot_cad_der").innerHTML = angulo_rot_int_cad_der + " °";
        
        //Guarda los valores maximos y minimos de la rotacion int/ext del lado izq y derecho
        if (solutionOptions.guardar_datos) {
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
           
            console.log(min_angulo_rot_int_cad_izq);
        }else{
            min_angulo_rot_int_cad_izq= 200;
            max_angulo_rot_int_cad_izq= -200;
            console.log(min_angulo_rot_int_cad_izq);
            document.getElementById("myButton").addEventListener("click", function() {
                sessionStorage.setItem("rot_int_cad_izq_min", JSON.stringify(min_angulo_rot_int_cad_izq.toFixed(1)));
                sessionStorage.setItem("rot_int_cad_izq_max", JSON.stringify(max_angulo_rot_int_cad_izq.toFixed(1)));  
                window.location.href = "analizar.html";
            });
        }   
        if (solutionOptions.guardar_datos) {
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

        
        

        //Angulo cadera
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
        
        if (solutionOptions.guardar_datos) {
            ang_izq_cad_grafico.push(angulo_cadera_i);
            posicion_pie_x_grafico_izq.push(tobillo_i_x);
            p_p_pie_x.push(pie_i_x);
            document.getElementById("ang_cad_iz").innerHTML = angulo_cadera_i + " ° " + "(" + ang_izq_cad_grafico.length + ")";
            
        }
        else {
            ang_izq_cad_grafico = [];
            posicion_pie_x_grafico_izq= [];
            p_p_pie_x= [];
            document.getElementById("ang_cad_iz").innerHTML = angulo_cadera_i + " ° " + "(" + ang_izq_cad_grafico.length + ")";
        }
        //b
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
        if (solutionOptions.guardar_datos) {
            ang_der_cad_grafico.push(angulo_cadera_d);
            posicion_pie_x_grafico_der.push(tobillo_d_x)
            document.getElementById("ang_cad_de").innerHTML = angulo_cadera_d + " ° " + "(" + ang_der_cad_grafico.length + ")";
        }
        else {
            ang_der_cad_grafico = [];
            posicion_pie_x_grafico_der = [];
            document.getElementById("ang_cad_de").innerHTML = angulo_cadera_d + " ° " + "(" + ang_der_cad_grafico.length + ")";
        }
        //b
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_der_cad_grafico", JSON.stringify(ang_der_cad_grafico));
            sessionStorage.setItem("posicion_pie_x_grafico_der", JSON.stringify(posicion_pie_x_grafico_der));
            window.location.href = "analizar.html";
        });
       
        //Angulo rodilla
        //Izq
        var femur_iz = Math.sqrt(Math.pow(cadera_i_x - rodilla_i_x, 2) + Math.pow(cadera_i_y - rodilla_i_y, 2));
        var tibia_iz = Math.sqrt(Math.pow(rodilla_i_x - tobillo_i_x, 2) + Math.pow(rodilla_i_y - tobillo_i_y, 2));
        var fem_tob_iz = Math.sqrt(Math.pow(cadera_i_x - tobillo_i_x, 2) + Math.pow(cadera_i_y - tobillo_i_y, 2));
        var sigma_rod_iz = Math.acos((-Math.pow(femur_iz, 2) - Math.pow(tibia_iz, 2) + Math.pow(fem_tob_iz, 2)) / (-2 * femur_iz * tibia_iz)) * (180) / Math.PI;
        var angulo_rodilla_iz = sigma_rod_iz;
        angulo_rodilla_iz = 180 - angulo_rodilla_iz.toFixed(0);
       
        if (solutionOptions.guardar_datos) {
            ang_izq_rod_grafico.push(angulo_rodilla_iz);
            document.getElementById("ang_rod_iz").innerHTML = angulo_rodilla_iz + " ° " + "(" + ang_izq_rod_grafico.length + ")";
        }
        else {
            ang_izq_rod_grafico = [];
            document.getElementById("ang_rod_iz").innerHTML = angulo_rodilla_iz + " ° " + "(" + ang_izq_rod_grafico.length + ")";
        }
        //b
        document.getElementById("myButton").addEventListener("click", function() {
            sessionStorage.setItem("ang_izq_rod_grafico", JSON.stringify(ang_izq_rod_grafico));
            window.location.href = "analizar.html";   
        });
 


        //Der
        var femur_de = Math.sqrt(Math.pow(cadera_d_x - rodilla_d_x, 2) + Math.pow(cadera_d_y - rodilla_d_y, 2));
        var tibia_de = Math.sqrt(Math.pow(rodilla_d_x - tobillo_d_x, 2) + Math.pow(rodilla_d_y - tobillo_d_y, 2));
        var fem_tob_de = Math.sqrt(Math.pow(cadera_d_x - tobillo_d_x, 2) + Math.pow(cadera_d_y - tobillo_d_y, 2));
        var sigma_rod_de = Math.acos((-Math.pow(femur_de, 2) - Math.pow(tibia_de, 2) + Math.pow(fem_tob_de, 2)) / (-2 * femur_de * tibia_de)) * (180) / Math.PI;
        var angulo_rodilla_de = sigma_rod_de;
        angulo_rodilla_de = 180-angulo_rodilla_de.toFixed(0);
        
        if (solutionOptions.guardar_datos) {
            ang_der_rod_grafico.push(angulo_rodilla_de);
            document.getElementById("ang_rod_de").innerHTML = angulo_rodilla_de + " ° " + "(" + ang_der_rod_grafico.length + ")";
        }
        else {
            ang_der_rod_grafico = [];
            document.getElementById("ang_rod_de").innerHTML = angulo_rodilla_de + " ° " + "(" + ang_der_rod_grafico.length + ")";
           
        }
        //b
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
    new controls.Slider({
        title: 'Complejidad del Modelo',
        field: 'modelComplexity',
        discrete: ['Lite', 'Full', 'Heavy'],
    }),
    new controls.Toggle({ title: 'Linea de Valgo/Varo', field: 'valgo_varo' }),
    new controls.Toggle({ title: 'Postura Frontal', field: 'lineasPosturales' }),
    new controls.Toggle({ title: 'Linea Media Sagital', field: 'lineaColumna' }),
    new controls.Toggle({ title: 'Rotacion Interna/Externa', field: 'rotIntExt' }),
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