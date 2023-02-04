var counter1 = 0;
var counter2 = 0;

document.getElementById("incrementButton1").addEventListener("click", function() {
  counter1++;
  document.getElementById("counter1").innerHTML = counter1;
});

document.getElementById("incrementButton2").addEventListener("click", function() {
  counter2++;
  document.getElementById("counter2").innerHTML = counter2;
});