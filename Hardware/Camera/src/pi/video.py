from picamera2 import Picamera2
from picamera2.encoders import H264Encoder
from picamera2.outputs import FfmpegOutput

import numpy as np
import time
import subprocess
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
        print("Starting video...")
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
