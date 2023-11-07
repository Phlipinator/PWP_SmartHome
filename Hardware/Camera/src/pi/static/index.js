let btnOffline = document.getElementById("btn-offline");
let btnAp = document.getElementById("btn-ap");
let btnLocal = document.getElementById("btn-local");
let btnOnline = document.getElementById("btn-online");

const colorOffline = "#ff5050";
const colorAp = "#ffcc66";
const colorLocal = "#2c93b0";
const colorOnline = "#339966";

btnOffline.addEventListener("click", () => {
  fetch("api/network?" + new URLSearchParams({ mode: "0" }).toString(), {
    method: "POST",
  })
    .then((response) => response.text())
    .then((text) => console.log(text));
  resetAllButtons();
  btnOffline.style.color = colorOffline;
});

btnAp.addEventListener("click", () => {
  fetch("api/network?" + new URLSearchParams({ mode: "1" }).toString(), {
    method: "POST",
  })
    .then((response) => response.text())
    .then((text) => console.log(text));
  resetAllButtons();
  btnAp.style.color = colorAp;
});

btnLocal.addEventListener("click", () => {
  fetch("api/network?" + new URLSearchParams({ mode: "2" }).toString(), {
    method: "POST",
  })
    .then((response) => response.text())
    .then((text) => console.log(text));
  resetAllButtons();
  btnLocal.style.color = colorLocal;
});

btnOnline.addEventListener("click", () => {
  fetch("api/network?" + new URLSearchParams({ mode: "3" }).toString(), {
    method: "POST",
  })
    .then((response) => response.text())
    .then((text) => console.log(text));
  resetAllButtons();
  btnOnline.style.color = colorOnline;
});

const resetAllButtons = () => {
  btnOffline.style.color = "white";
  btnAp.style.color = "white";
  btnLocal.style.color = "white";
  btnOnline.style.color = "white";
};

// slider.addEventListener("change", function() {
//     console.log(slider.value)
//     fetch("api/network?" + new URLSearchParams({mode: slider.value}).toString(), {
//         method: "POST",
//     })
//     .then((response) => response.text())
//     .then((text) => console.log(text));
// }, false);
