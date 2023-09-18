console.log("hello wifi")

const setWifiOnClick = () => {
    let items = document.getElementsByClassName('list-group-item')
    Array.from(items).forEach(item => {
        item.addEventListener("click", () => {
            setModal(item.getAttribute("value"))
            $("#exampleModal").modal('show')
        })
    })
}

const setModal = (ssid) => {
    $('#inputSsid:text').val(ssid)
}

const setConnectOnClick = () => {
    let btn = document.getElementById('btnConn')
    btn.addEventListener("click", () => {
        const ssid = $("#inputSsid:text").val()
        const psk = $("#inputPassword:password").val()
        $("#exampleModal").modal('hide')
        setAlert(ssid)
        fetch('api/wifi', { method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ssid: ssid, psk: psk})
        })
    })
}

const setAlert = (ssid) => {
    $('#connAlert').removeClass('d-none')
    $('#connAlert').html(
        `<h5 class="alert-heading">Connecting to ${ssid}...</h5>
        <span>Please wait a moment and switch your wifi to ${ssid}. Afterwards try to connect to <a href="http://picam.local:5000" class="alert-link">picam.local</a></span>
        <hr>
        <p class="mb-0">If connection can't be established, the cam switches into access point mode.</p>`
    )

}

setWifiOnClick()
setConnectOnClick()