console.log("Hello World")

let slider = document.getElementById("mode")
slider.addEventListener("change", function() {
    console.log(slider.value)
    fetch("api/network?" + new URLSearchParams({mode: slider.value}).toString(), {
        method: "POST",
    })
    .then((response) => response.text())
    .then((text) => console.log(text));
}, false);