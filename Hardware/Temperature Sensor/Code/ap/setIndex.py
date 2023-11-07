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
        
            .container {
              background: #343639;
              width: 100%ds;
              border-radius: 8px;
              max-width: 500px;
              margin-bottom: 8px;
              padding: 8px;
              box-sizing: border-box;
            }
        
            body {
              background-color: #242424;
              color: #f9fafb;
              font-family: "Open Sans", sans-serif;
              margin-top: 0;
            }
        
            p {
              display: block;
              margin-block-start: 0.5em;
              margin-block-end: 0.5em;
              margin-inline-start: 0px;
              margin-inline-end: 0px;
            }
        
            h2 {
              margin: 0;
            }
        
            h3 {
              margin-top: 0;
              margin-bottom: 8px;
              color: #0088cc;
            }
        
            input {
              border: none;
              padding: 8px;
              border-radius: 8px;
              margin-bottom: 8px;
            }
        
            input:focus {
              border: none;
            }
        
            button {
              min-width: 185px;
              background: #0088cc;
              border: none;
              padding: 8px;
              border-radius: 8px;
              color: white;
              cursor: pointer;
            }
        
            button:hover {
              background: #0073a9;
            }
        
            #header {
              display: flex;
              flex-direction: row;
              margin-bottom: 16px;
              align-items: center;
            }
        
            #logo {
              width: 100%ds;
              max-width: 450px;
            }
        
            .data-container {
              display: flex;
              flex-direction: row;
              width: 100%ds;
            }
        
            .data-title {
              margin-right: 4px;
              flex: 1;
              text-align: end;
            }
        
            .data-value {
              margin-left: 4px;
              flex: 1;
            }
        
            .separator {
              height: 1px;
              width: 100%ds;
              background: white;
              margin: 16px 0 8px 0;
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
          <img id='logo' src='img/pwp_logo.png'>
          <span id='header'>
            <img src='img/ic_flame.svg' width='40'>
            <h2>Thermostat Dashboard</h2>
          </span>
          <div class="flex-box container">
            <h3>Sensors:</h3>
            <div class='data-container'>
              <div class='data-title'>Temperature:</div><div class='data-value'>%s</div>
            </div>
            <div class='data-container'>
              <div class='data-title'>Humidity:</div><div class='data-value'>%s</div>
            </div>
          </div>
          <form class="flex-box container" action="/login" method="get" class="box">
            <h3>WiFi login credentials</h3>
            <input type="text" placeholder="Enter SSID" name="ssid" required />
        
            <input
                type="password"
                placeholder="Enter password"
                name="password"
                required
            />
        
            <button type="submit" class="btn">Save</button>
        
            <div class='separator'></div>
        
            <div class='data-container'>
              <div class='data-title'>Current SSID:</div><div class='data-value'>%s</div>
            </div>
            <div class='data-container'>
              <div class='data-title'>Current password:</div><div class='data-value'>%s</div>
            </div>
          </form>
        </div>
        </body>
        </html>
      """%(self.value1,self.value2,self.ssid,self.pw))
      file.close()



