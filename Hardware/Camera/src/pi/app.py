from flask import Flask, render_template, request
from application import Application
from state import State

            
app = Flask(__name__)
application = Application("config.cfg")


# Web server routes
@app.route("/")
@app.route("/status")
def status():
    return render_template('status.html', mode=application.network.state)

@app.route("/wifi", methods=["GET"])
def get_wifi():
    signals = application.network.scan_wifi()
    return render_template('network.html', signals=signals)

@app.route("/cam", methods=["GET"])
def get_cam():
    return render_template('cam.html')


# REST api
@app.route("/api/cam", methods=["POST"])
def set_motion():
    motion = request.args.get('motion')
    application.video.detect = bool(motion)
    return motion

@app.route("/api/wifi", methods=["POST"])
def add_wifi():
    if request.is_json:
        json = request.json
        application.network.set_wifi(json['ssid'], json['psk'])
        application.queue.put(State.LAN)
        return ("") 

@app.route("/api/network", methods=["GET"])
def get_mode():
    return "Mode: " + str(application.network.state)

@app.route("/api/network", methods=["POST"])
def set_mode():
    newMode = request.args.get('mode')
    application.queue.put(int(newMode))
    return "Mode: " + str(application.network.state)
