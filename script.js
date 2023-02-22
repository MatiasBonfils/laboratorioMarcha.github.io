//import ldb from './localdata.min.js'


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
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');
//solution options
const solutionOptions = {
    selfieMode: true,
    modelComplexity: 1,
    smoothLandmarks: true,
    lineaMandibula: false,
    lineaCadera: false,
    lineaHombro: false,
    rotIntExt: false,
    angulosIzquierdos: false,
    angulosDerechos: false,
    valgo_varo: false,
    guardar_datos: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
};

//
document.getElementById("capture-button").addEventListener("click", function() {
    var dataURL = canvasElement.toDataURL("image/png");
    console.log(dataURL)
    localStorage.setItem("imgData", dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      
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

document.addEventListener('mousemove', logMousePosition);

function logMousePosition(e) {
  screenLog.innerText = `
    Screen X/Y: ${e.screenX}, ${e.screenY}`;
}

coordBtn.addEventListener('click', toggleSaveCoordinates);

function toggleSaveCoordinates() {
  saveCoordsEnabled = !saveCoordsEnabled;
  if (saveCoordsEnabled) {
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
    coordBtn.style.backgroundColor = "#228B22";
    document.body.style.cursor = "";
    document.documentElement.style.cursor = "";
    document.removeEventListener('click', saveCoordinates);
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
  //Guardo las variables para pasarla a la siguiente pagina
  localStorage.setItem("distancia_caminada", JSON.stringify(distancia_zancada_metros.toFixed(2)));       
  localStorage.setItem("velocidad_camina", JSON.stringify(velocity.toFixed(2)));
  localStorage.setItem("cadencia_camina", JSON.stringify(cadencia.toFixed(2)));
  localStorage.setItem("Longitud_paso", JSON.stringify(stepLength.toFixed(2)));
  localStorage.setItem("Longitud_zancada", JSON.stringify(strideLength.toFixed(2)));
  
  let message = `Distancia caminada: ${distancia_zancada_metros.toFixed(2)} metros\n`;
  message += `Velocidad: ${velocity.toFixed(2)} m/s\n`;
  message += `Cadencia: ${cadencia.toFixed(2)} pasos/minutos\n`;
  message += `Longitud de paso: ${stepLength.toFixed(2)} metros\n`;
  message += `Longitud de zancada: ${strideLength.toFixed(2)} metros\n\n`;
  
  
alert(message);
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
        //DIBUJAR RECTANGULOS
        //Lineas
        //Mandibula
        if (solutionOptions.lineaMandibula) {
            rectangulo_lm.style.display = "block";
        }
        else {
            rectangulo_lm.style.display = "none";
        }
        ;
        //Hombro
        if (solutionOptions.lineaHombro) {
            rectangulo_lh.style.display = "block";
        }
        else {
            rectangulo_lh.style.display = "none";
        }
        ;
        //Cadera
        if (solutionOptions.lineaCadera) {
            rectangulo_lc.style.display = "block";
        }
        else {
            rectangulo_lc.style.display = "none";
        }
        ;
        //
        if (solutionOptions.rotIntExt) {
            rectangulo_arotd.style.display = "block";
            rectangulo_aroti.style.display = "block";
        }
        else {
            rectangulo_arotd.style.display = "none";
            rectangulo_aroti.style.display = "none";
        }
        ;
        if (solutionOptions.angulosIzquierdos) {
            rectangulo_aci.style.display = "block";
            rectangulo_ari.style.display = "block";
        }
        else {
            rectangulo_aci.style.display = "none";
            rectangulo_ari.style.display = "none";
        }
        ;
        if (solutionOptions.angulosDerechos) {
            rectangulo_acd.style.display = "block";
            rectangulo_ard.style.display = "block";
        }
        else {
            rectangulo_acd.style.display = "none";
            rectangulo_ard.style.display = "none";
        }
        ;
        if (solutionOptions.rotIntExt) {
            rectangulo_arotd.style.display = "block";
        }
        else {
            rectangulo_arotd.style.display = "none";
        }
        ;
        drawingUtils.drawConnectors(canvasCtx, results.poseLandmarks, mpPose.POSE_CONNECTIONS, { visibilityMin: 0.65, color: 'white' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_LEFT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(255,138,0)' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_RIGHT)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'rgb(0,217,231)' });
        drawingUtils.drawLandmarks(canvasCtx, Object.values(mpPose.POSE_LANDMARKS_NEUTRAL)
            .map(index => results.poseLandmarks[index]), { visibilityMin: 0.65, color: 'white', fillColor: 'white' });
        let mandibula_i_x = canvasElement.width * results.poseLandmarks[7].x;
        let mandibula_i_y = canvasElement.height * results.poseLandmarks[7].y;
        let mandibula_d_x = canvasElement.width * results.poseLandmarks[8].x;
        let mandibula_d_y = canvasElement.height * results.poseLandmarks[8].y;
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
        let talon_i_x =  results.poseLandmarks[29].x;
        let talon_i_y = canvasElement.height * results.poseLandmarks[29].y;
        let talon_d_x = canvasElement.width * results.poseLandmarks[30].x;
        let talon_d_y = canvasElement.height * results.poseLandmarks[30].y;
        
        //dibujar linea de mandibula
        let mdx = mandibula_d_x;
        let mdy = (mandibula_d_y - mandibula_i_y) / 2 + mandibula_i_y;
        let mix = mandibula_i_x;
        let miy = (mandibula_d_y - mandibula_i_y) / 2 + mandibula_i_y;
        if (solutionOptions.lineaMandibula) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(mdx, mdy);
            canvasCtx.lineTo(mix, miy);
            canvasCtx.strokeStyle = "red";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //dibujar linea de cadera
        let cdx = cadera_d_x;
        let cdy = (cadera_d_y - cadera_i_y) / 2 + cadera_i_y;
        let cix = cadera_i_x;
        let ciy = (cadera_d_y - cadera_i_y) / 2 + cadera_i_y;
        if (solutionOptions.lineaCadera) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(cdx, cdy);
            canvasCtx.lineTo(cix, ciy);
            canvasCtx.strokeStyle = "red";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //angulo cadera
        var hipotenusa_cadera = Math.sqrt(Math.pow(cadera_d_x - (cadera_d_x - cadera_i_x) / 2, 2) + Math.pow(cadera_d_y - ((cadera_d_y - cadera_i_y) / 2 + cadera_i_y), 2));
        var cateto_ad_cadera = Math.sqrt(Math.pow(cadera_d_x - (cadera_d_x - cadera_i_x) / 2, 2));
        var angulo_inclinacion_cadera = Math.acos(cateto_ad_cadera / hipotenusa_cadera);
        angulo_inclinacion_cadera = angulo_inclinacion_cadera * (180) / Math.PI;
        angulo_inclinacion_cadera = angulo_inclinacion_cadera.toFixed(0);
        document.getElementById("ang_linea_cadera").innerHTML = angulo_inclinacion_cadera + " °";
        //dibujar linea de hombro
        let hdx = hombro_d_x;
        let hdy = (hombro_d_y - hombro_i_y) / 2 + hombro_i_y;
        let hix = hombro_i_x;
        let hiy = (hombro_d_y - hombro_i_y) / 2 + hombro_i_y;
        if (solutionOptions.lineaHombro) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(hdx, hdy);
            canvasCtx.lineTo(hix, hiy);
            canvasCtx.strokeStyle = "red";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //angulo de hombro
        var hipotenusa_hombro = Math.sqrt(Math.pow(hombro_d_x - (hombro_d_x - hombro_i_x) / 2, 2) + Math.pow(hombro_d_y - ((hombro_d_y - hombro_i_y) / 2 + hombro_i_y), 2));
        var cateto_ad_hombro = Math.sqrt(Math.pow(hombro_d_x - (hombro_d_x - hombro_i_x) / 2, 2));
        var angulo_inclinacion_hombro = Math.acos(cateto_ad_hombro / hipotenusa_hombro);
        angulo_inclinacion_hombro = angulo_inclinacion_hombro * (180) / Math.PI;
        angulo_inclinacion_hombro = angulo_inclinacion_hombro.toFixed(0);
        document.getElementById("ang_linea_hombro").innerHTML = angulo_inclinacion_hombro + " °";
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
            canvasCtx.strokeStyle = "gray";
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
            canvasCtx.strokeStyle = "gray";
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
            canvasCtx.strokeStyle = "#000000";
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
            canvasCtx.strokeStyle = "#000000";
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
            canvasCtx.strokeStyle = "#000000";
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
            canvasCtx.strokeStyle = "#000000";
            canvasCtx.lineWidth = 4;
            canvasCtx.stroke();
        }
        //Angulos
        //Angulos de rotacion interna y externa de cadera
        let angulo_rot_int_cad_izq = (180 * Math.acos((tobillo_i_x - rodilla_i_x) / (Math.sqrt(Math.pow((tobillo_i_x - rodilla_i_x), 2) + Math.pow((tobillo_i_y - rodilla_i_y), 2)))) / Math.PI) - 90;
        angulo_rot_int_cad_izq = angulo_rot_int_cad_izq.toFixed(0) * -1;
        document.getElementById("ang_rot_cad_izq").innerHTML = angulo_rot_int_cad_izq  + " °";
        let angulo_rot_int_cad_der = (180 * Math.acos((tobillo_d_x - rodilla_d_x) / (Math.sqrt(Math.pow((tobillo_d_x - rodilla_d_x), 2) + Math.pow((tobillo_d_y - rodilla_d_y), 2)))) / Math.PI) - 90;
        angulo_rot_int_cad_der = angulo_rot_int_cad_der.toFixed(0);
        document.getElementById("ang_rot_cad_der").innerHTML = angulo_rot_int_cad_der + " °";
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
            document.getElementById("ang_cad_iz").innerHTML = angulo_cadera_i + " ° " + "(" + ang_izq_cad_grafico.length + ")";
        }
        else {
            ang_izq_cad_grafico = [];
            document.getElementById("ang_cad_iz").innerHTML = angulo_cadera_i + " ° " + "(" + ang_izq_cad_grafico.length + ")";
        }
        //b
        document.getElementById("myButton").addEventListener("click", function() {
            localStorage.setItem("ang_izq_cad_grafico", JSON.stringify(ang_izq_cad_grafico));
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
            document.getElementById("ang_cad_de").innerHTML = angulo_cadera_d + " ° " + "(" + ang_der_cad_grafico.length + ")";
        }
        else {
            ang_der_cad_grafico = [];
            document.getElementById("ang_cad_de").innerHTML = angulo_cadera_d + " ° " + "(" + ang_der_cad_grafico.length + ")";
        }
        //b
        document.getElementById("myButton").addEventListener("click", function() {
            localStorage.setItem("ang_der_cad_grafico", JSON.stringify(ang_der_cad_grafico));
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
            localStorage.setItem("ang_izq_rod_grafico", JSON.stringify(ang_izq_rod_grafico));
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
            localStorage.setItem("ang_der_rod_grafico", JSON.stringify(ang_der_rod_grafico));
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



//document.getElementById("saveButton").addEventListener("click", function() {
  //  var dataURL = canvasElement.toDataURL("image/png");
    //console.log(dataURL)
    //localStorage.setItem("imgData", dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
      //});

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
    new controls.Toggle({ title: 'Linea de Mandibula', field: 'lineaMandibula' }),
    new controls.Toggle({ title: 'Linea de Hombro', field: 'lineaHombro' }),
    new controls.Toggle({ title: 'Linea de Cadera', field: 'lineaCadera' }),
    new controls.Toggle({ title: 'Rotacion Interna/Externa', field: 'rotIntExt' }),
    new controls.Toggle({ title: 'Mostrar Ángulos Izquierdos de la Marcha', field: 'angulosIzquierdos' }),
    new controls.Toggle({ title: 'Mostrar Ángulos Derechos de la Marcha', field: 'angulosDerechos' }),
    new controls.Toggle({ title: 'Guardar Datos', field: 'guardar_datos' }),
   
])
    .on(x => {
    const options = x;
    videoElement.classList.toggle('selfie', options.selfieMode);
    activeEffect = x['effect'];
    pose.setOptions(options);
});


