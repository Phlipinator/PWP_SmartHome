import requests
from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

import numpy as np
import time
import subprocess
import os
import signal
from threading import Thread


class VideoStream:


    def __init__(
        self,
        detect,
        #res = (1280, 720),
        res,
        format,
        lres,
        stream_url,
        video_dir,
        file_prefix
    ):
        """ Starts simple-rtsp-server, rtsp stream to it & motion detectio thread"""
        self.ngrok_process = None
        print("Starting video...", flush=True)
        subprocess.Popen(["/home/pi/rtsp-simple-server", "/home/pi/rtsp-simple-server.yml"])
        self.detect = detect
        self.lres = lres
        self.picam2 = Picamera2()
        self.video_config = self.picam2.create_video_configuration(
            main={"size": res, "format": format},
            lores={"size": self.lres, "format": "YUV420"}
        )
        self.picam2.configure(self.video_config)

        self.encoder = H264Encoder(repeat=True, iperiod=15)
        self.stream = FfmpegOutput("-f rtsp rtsp://" + stream_url)
        self.video_dir = video_dir
        self.file_prefix = file_prefix
        # FfmpegOutput is used for file output instead of default FileOutput, bc we need multiple
        # multiple simultaneous outputs
        self.file_output = FfmpegOutput(f"{video_dir}{file_prefix}{int(time.time())}.mp4")
        self.encoder.output = [self.stream, self.file_output]

        self.picam2.start_encoder(self.encoder)
        self.file_output.stop()
        self.picam2.start()

        self.thread = Thread(target=self.motion_detection, daemon=True)
        self.thread.start()
    
    
    def motion_detection(self):
        w, h = self.lres
        prev = None
        encoding = False
        ltime = 0

        while True:
            if not self.detect:
                if encoding:
                    self.file_output.stop()
                    encoding = False
                continue
            cur = self.picam2.capture_buffer("lores")
            cur = cur[:w * h].reshape(h, w)
            if prev is not None:
                # Measure pixels differences between current and
                # previous frame
                mse = np.square(np.subtract(cur, prev)).mean()
                if mse > 10:
                    if not encoding:
                        self.file_output.output_filename = f"{self.video_dir}{self.file_prefix}{int(time.time())}.mp4"
                        self.file_output.start()
                        encoding = True
                        print("New Motion", mse)
                    ltime = time.time()
                else:
                    if encoding and time.time() - ltime > 10.0:
                        self.file_output.stop()
                        print("recording ended")
                        encoding = False
            prev = cur

    # Function to get ngrok tunnel URL
    def get_ngrok_url(self):
        try:
            response = requests.get("http://localhost:4040/api/tunnels")
            data = response.json()
            print("DATA", flush=True)
            print(data, flush=True)
            return data['tunnels'][0]['public_url']
        except Exception as e:
            print(f"Error getting ngrok URL: {e}")
            return None

    def kill_ngrok_process(self):
        if self.ngrok_process:
            os.killpg(os.getpgid(self.ngrok_process.pid), signal.SIGTERM)
        return

    # Function to start ngrok tunnel for a local server
    def start_ngrok_tunnel(self, local_port):
        print("STARTING NGROK", flush=True)
        try:
            # Start ngrok in the background
            ngrok_cmd = f"/snap/bin/ngrok config add-authtoken 2Xr3WnFEufQkOd2URnsdmZtdoRL_nEn3Gkma5FwzdL1T8kQT ; /snap/bin/ngrok http {local_port} --request-header-add 'ngrok-skip-browser-warning: 1' --log=stdout"
            self.ngrok_process = subprocess.Popen(ngrok_cmd, shell=True, stdout=subprocess.PIPE)

            # Wait for ngrok to start
            self.ngrok_url = self.get_ngrok_url()
            while self.ngrok_url == None:
                time.sleep(5)
                self.ngrok_url = self.get_ngrok_url()
            
            # Get the ngrok tunnel URL
            #self.ngrok_url = self.get_ngrok_url()

            if self.ngrok_url:
                print(f"ngrok tunnel URL: {self.ngrok_url}")
                return self.ngrok_url
            else:
                print("Error getting ngrok tunnel URL.")
                return None

        except Exception as e:
            print(f"Error starting ngrok tunnel: {e}")
            return None
