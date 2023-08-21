def setDashboard(value1,value2,ssid="wifiname", password="example123"):
    file = open ("index.html", "w")
    #print(type(file))

    file.write("""<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        .flex-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        body {
            background-color: #1e212a;
            color: #f9fafb;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        p {
            display: block;
            margin-block-start: 0.5em;
            margin-block-end: 0.5em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
        }

        h3 {
            color: #8686e1;
        }
        #frame {
            border-radius: 2px;
            background-color: #8686e1;
        }

        #input-wrapper {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
        .input-button {
            border-radius: 16px;
            border-width: 0px;
            margin-top: 20px;
            padding: 10px;
            cursor: pointer;
        }
        </style>
    </head>
    <body>
        <body>
        <div class="flex-box">
            <h2>Access Point Dashboard</h2>
            <div class="flex-box">
            <h3>Sensors:</h3>
            <p>Temperature: %s</p>
            <p>Humidity: %s</p>
            </div>
            <form action="/login" method="get" class="box">
      <h1>WiFi login credentials</h1>
      <input type="text" placeholder="My WiFi SSID" name="ssid" required />

      <br />

      <input
        type="password"
        placeholder="WiFi Password"
        name="password"
        required
      />

      <br />

      <button type="submit" class="btn">Connect</button>
    </form>
    <h1>%s</h1>
    <h1>%s</h1>
        </body>
    </body>
    </html>
    """%(value1,value2,ssid,password))
    file.close()


class HtmlBuilder:
  value1 = 0
  value2 = 0
  ssid="init ssid"
  pw="init pw"

  def writeToIndex(self):
      file = open ("index.html", "w")
      #print(type(file))

      file.write("""<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
        .flex-box {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        body {
            background-color: #1e212a;
            color: #f9fafb;
            font-family: Verdana, Geneva, Tahoma, sans-serif;
        }

        p {
            display: block;
            margin-block-start: 0.5em;
            margin-block-end: 0.5em;
            margin-inline-start: 0px;
            margin-inline-end: 0px;
        }

        h3 {
            color: #8686e1;
        }
        #frame {
            border-radius: 2px;
            background-color: #8686e1;
        }

        #input-wrapper {
            margin-top: 10px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
        }
        .input-button {
            border-radius: 16px;
            border-width: 0px;
            margin-top: 20px;
            padding: 10px;
            cursor: pointer;
        }
        </style>
    </head>
    <body>
        <div class="flex-box">
            <h2>Access Point Dashboard</h2>
            <div class="flex-box">
              <h3>Sensors:</h3>
              <p>Temperature: %s</p>
              <p>Humidity: %s</p>
            </div>
            <form class="flex-box" action="/login" method="get" class="box">
            <h3>WiFi login credentials</h3>
            <input type="text" placeholder="Enter SSID" name="ssid" required />

            <br />

      <input
        type="password"
        placeholder="Enter password"
        name="password"
        required
      />

      <br />

      <button type="submit" class="btn">Save</button>
    </form>
    <p>Current SSID: %s</p>
    <p>Current password: %s</p>
    </div>
    </body>
    </html>
      """%(self.value1,self.value2,self.ssid,self.pw))
      file.close()



