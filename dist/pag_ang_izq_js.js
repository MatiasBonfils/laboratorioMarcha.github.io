document.addEventListener("DOMContentLoaded", function() {
  var count = localStorage.getItem("saveCount") || 0;
  var displayedFrame = document.getElementById('displayedFrame');
  var currentFrame = 1;

  function displayFrame(index) {
    var dataImage = localStorage.getItem(`imgData${index}`);
    if (!dataImage) return;

    displayedFrame.src = "data:image/png;base64," + dataImage;
    currentFrame = index;
  }

  document.getElementById("previousButton").addEventListener("click", function() {
    displayFrame(currentFrame - 1);
  });

  document.getElementById("nextButton").addEventListener("click", function() {
    displayFrame(currentFrame + 1);
  });

  displayFrame(0);
});



  
const showScreenshotsButton = document.getElementById("show-screenshots-button");
const screenshotContainer = document.querySelector(".screenshot-container");


showScreenshotsButton.addEventListener("click", () => {
  showScreenshotsButton.style.backgroundColor = "#228B22";
  setTimeout(() => {
      showScreenshotsButton.style.backgroundColor = "";
  }, 200);
  screenshotContainer.innerHTML = "";
  const screenshots = JSON.parse(localStorage.getItem("screenshots")) || [];
  for (const screenshot of screenshots) {
      const screenshotElement = document.createElement("div");
      screenshotElement.classList.add("screenshot");
      const screenshotImage = new Image();
      screenshotImage.src = screenshot;
      screenshotElement.appendChild(screenshotImage);
      const deleteButton = document.createElement("div");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "x";
      deleteButton.addEventListener("click", () => {
          const index = screenshots.indexOf(screenshot);
          if (index >= 0) {
              screenshots.splice(index, 1);
          }
          screenshotContainer.removeChild(screenshotElement);
      });
      screenshotElement.appendChild(deleteButton);
      screenshotContainer.appendChild(screenshotElement);
  }
});


const chips = document.querySelectorAll('.chip');
let selectedChip;

chips.forEach(chip => {
  chip.addEventListener('click', event => {
    if (selectedChip) {
      selectedChip.classList.remove('selected');
    }

    selectedChip = event.currentTarget;
    selectedChip.classList.add('selected');

    document.getElementById('selectedTest').innerText = `Selected test: ${selectedChip.id}`;
    if (selectedChip.id === "Análisis de la marcha humana lado izquierdo") {
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
    
        document.getElementById('selectedTest').innerText = `Selected test: ${selectedChip.id}`;
        if (selectedChip.id === "Análisis de la marcha humana lado derecho") {
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
        }
        });
        });

