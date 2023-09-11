package com.pwp.backend.backend.controller;

import com.pwp.backend.backend.model.Device;
import com.pwp.backend.backend.model.DeviceType;
import com.pwp.backend.backend.model.Network;
import com.pwp.backend.backend.model.User;
import com.pwp.backend.backend.model.devicedata.CameraData;
import com.pwp.backend.backend.model.devicedata.ConnectionMode;
import com.pwp.backend.backend.model.devicedata.DeviceData;
import com.pwp.backend.backend.model.devicedata.ThermostatData;
import com.pwp.backend.backend.repository.DataRepository;
import com.pwp.backend.backend.repository.NetworkRepository;
import com.pwp.backend.backend.repository.UserRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import static com.pwp.backend.backend.controller.APIController.getUserID;
// for the creating a timestamp when it is not given by the middleware
import java.sql.Timestamp;

/*
        Fetches Data from the Interface (right now only simulated), combines it into one big json file and forwards it to the Frontend
 */
@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*")
public class DataController {
    @Autowired
    private DataRepository dataRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NetworkRepository networkRepository;

    //get the data for one device using it's id. Returns a JSON of all attributes merged into one (Currently ID, Temperature & Humidity)
    @GetMapping("/getDataDevice")
    public String getInterfaceDataDevice(@RequestParam String deviceID, @RequestHeader("authorization") String authorization){

        String responseText = "";
        // Response to request
        JSONObject response = new JSONObject();

        // get User ID to look up associated Server URL
        String id = getUserID(authorization);
        User user = userRepository.findUserByID(id);
        String targetURL = getNetworkURL(user.getNetworkID());

        //System.out.println("test 1");
        //responseText = makeDataRequest(deviceID);
        response = makeDataRequest(deviceID, targetURL,authorization);
        return response.toString();
    }

    /**
     * makes a data request to the middleware interface(currently simulated)
     @param deviceID - the ID of the device as String
     @return JSON object containing device id, timestamp and relevant data, e.g. temperature
     example return JSON for a thermostat:
     {
     "device-id": fs7f89sdg7sdfpdfs7g57ds0fd3214123jk12nj ,            // -> this is the device id
     "temperature-history":  [19.2, 22.3, 33.4 , 38.4 , 36.2]          // -> temperature history. First value is the current temperature
     "humidity-history":  [1.2, 2.3, 99.4 , 89.4 , 12.2]               // -> humidity history. ditto
     "timestamp-history":  [2023-01-26T16:44:13.410Z, ... ]            // -> timestamp history. ditto
     }
     */
    private JSONObject makeDataRequest(String deviceID, String targetURL, String authorization){
        DeviceType deviceType;
        //parse the response JSON into a map source: http://www.masterspringboot.com/web/rest-services/parsing-json-in-spring-boot-using-jsonparser/
        JsonParser springParser = JsonParserFactory.getJsonParser();
        //String response = "";
        JSONObject response = new JSONObject();
        DeviceData deviceData  = dataRepository.findDeviceByID(deviceID);
        System.out.println("deviceData: \n" + deviceData + "\n");
        if(deviceData == null){
            response.put("Message", "Error: device couldn't be found. Has it been registered ?");
            return response;
        }

        switch (deviceData.getDeviceType()) {
            case CAMERA -> {
                //request current data
//                String reqCameraData = makeRequest(( targetURL + "/h-a/deviceInfo?deviceId=" + deviceID), authorization);
                String reqCameraData = makeRequest(( targetURL + "/devices/camera/details?deviceId=" + deviceID), authorization);
                JSONObject deviceDataObject = new JSONObject((reqCameraData));

                int deviceMode = 0;
                if(!deviceDataObject.isNull("mode")){
                    deviceMode = deviceDataObject.getInt("mode");
                }

                if(deviceMode != 3){ // response if mode doesn't allow access, i.e. the device isn't online
                    response.put("status", "OFFLINE");
//                    response.put("Message", "Error: Device is offline");
                    //update device to be offline
                    CameraData cameraData = (CameraData) deviceData;
                    cameraData.setStatus(ConnectionMode.OFFLINE);
                    deviceData = cameraData;
                    dataRepository.save(deviceData); //save the new value to the database to update the history
                    return response;
                }

                JSONObject cameraData = deviceDataObject.getJSONObject("data");
                String timestamp = cameraData.getString("timestamp");
                String streamURL = cameraData.getString("streamUrl");

                CameraData cameraData1 = (CameraData) deviceData;
                ConnectionMode status;
                switch(deviceMode){
                    case 1:
                        status = ConnectionMode.AP_MODE;
                        break;
                    case 2:
                        status = ConnectionMode.LOCAL;
                        break;
                    case 3:
                        status = ConnectionMode.ONLINE;
                        break;
                    default:
                        status = ConnectionMode.ONLINE; //if we can get values it should be online
                        break;
                }
                //float targetTemperature = thermodata.getTemperatureTarget();
                cameraData1.setCurrentValues(streamURL, status);

                dataRepository.save(cameraData1); //save the new value to the database to update the history

                response = cameraData1.getCurrentValues();
                return response;
            }
            //break;
            case THERMOSTAT -> {
                //Make the requests for each attribute
                //String reqHumidity = makeRequest((targetURL + "/humidity/" + deviceID));
                //String reqTemperature = makeRequest(( targetURL +"/temperature/" + deviceID));
                // --> now there is only one endpoint for everything !
                System.out.println("------------- URL: " + targetURL);
                System.out.println("------------- DEVICE ID: " + deviceID);
//                String reqThermoData = makeRequest((targetURL + "/h-a/deviceInfo?deviceId=" + deviceID),authorization);
                String reqThermoData = makeRequest((targetURL + "/devices/thermostat/details?deviceId=" + deviceID),authorization);
                System.out.println("reqThermoData.toString():");
                System.out.println(reqThermoData);
                JSONObject deviceDataObject = new JSONObject((reqThermoData));
                System.out.println("DEVICE DATA OBJECT:");
                System.out.println(deviceDataObject);

                //transform request results into strings
                Map<String, Object> mapReqThermoData= springParser.parseMap(reqThermoData);
                //Map<String, Object> mapReqHumidity = springParser.parseMap(reqHumidity);
                //Map<String, Object> mapReqTemperature = springParser.parseMap(reqTemperature);

//              int deviceMode = mapReqThermoData.get("mode");
                int deviceMode = 0;
                if(!deviceDataObject.isNull("mode")){
                    deviceMode = deviceDataObject.getInt("mode");
                }

                if(deviceMode != 3){ // response if mode doesn't allow access, i.e. the device isn't online
                    response.put("status", "OFFLINE");
//                    response.put("Message", "Error: Device is offline");
                    //update device to be offline
                    ThermostatData thermodata = (ThermostatData) deviceData;
                    thermodata.setStatus(ConnectionMode.OFFLINE);
                    deviceData = thermodata;
                    dataRepository.save(deviceData); //save the new value to the database to update the history
                    return response;
                }

                JSONObject thermostatData = deviceDataObject.getJSONObject("data");

                String timestamp = thermostatData.getString("timestamp");

                JSONObject temperatureData = thermostatData.getJSONObject("temperature");
                float temperature = temperatureData.getFloat("value");
                String uomTemp = temperatureData.getString("unit");

                JSONObject humidityData = thermostatData.getJSONObject("humidity");
                float humidity = humidityData.getFloat("value");
                String uomHum = humidityData.getString("unit");

                JSONObject pressureData = thermostatData.getJSONObject("pressure");
                float pressure = pressureData.getFloat("value");
                String uomPress = pressureData.getString("unit");

                //update device with new value
                ThermostatData thermodata = (ThermostatData) deviceData;
                ConnectionMode status;
                switch(deviceMode){
                    case 1:
                        status = ConnectionMode.AP_MODE;
                        break;
                    case 2:
                        status = ConnectionMode.LOCAL;
                        break;
                    case 3:
                        status = ConnectionMode.ONLINE;
                        break;
                    default:
                        status = ConnectionMode.ONLINE; //if we can get values it should be online
                        break;
                }
                System.out.println("\n Current Values: \ntemperature: " + temperature +"\n humidity: " + humidity +"\n pressure: " + pressure +"\n timestamp: " + timestamp +"\n uomTemp: " + uomTemp +"\n uomHum: " + uomHum +"\n uomPress: " + uomPress +"\n status: " + status );
                //float targetTemperature = thermodata.getTemperatureTarget();
                thermodata.setCurrentValues(temperature, humidity, pressure, timestamp, uomTemp, uomHum, uomPress , status);
                /*
                float[] tempHistory = thermodata.getTemperatureHistory();
                float[] humidityHistory = thermodata.getHumidityHistory();
                float[] pressureHistory = thermodata.getPressureHistory();
                String[] uomTempHistory = thermodata.getUomTempHistory();
                String[] uomHumHistory = thermodata.getUomHumHistory();
                String[] uomPressHistory = thermodata.getUomPressHistory();
                String[] tempTimestamps = thermodata.getTimestamps();
                */

                //device.setDeviceData(thermodata);
                System.out.println("thermodata: \n" + thermodata.getCurrentValues());
                deviceData = thermodata;
                dataRepository.save(deviceData); //save the new value to the database to update the history

                response = thermodata.getCurrentValues();
                return response;
            }
            default -> {
                response.put("Message", "Error: Unknown Device Type");
                return response;
            }
        }
    }

    /**
     * DEPRECATED !!!
     * POST endpoint for changing the thermostat's temperature
     * @param body containing the device id and the new temperature
     * @return String describing Success/Failure
     */
    @Deprecated
    @PostMapping("/postDataThermostat")
    public String postThermostatData(@RequestBody String body){//(@RequestParam("deviceID") int deviceID , @RequestParam("temperature") float temperature){
        //The Request being forwarded to the Middleware and our response to the request
        JSONObject forwardedJSON = new JSONObject();
        String response= "";
        int deviceID;
        float temperature;

        // Request body
        JSONObject jsonBody = new JSONObject(body);


        // Check if JSON is valid
        try {
            deviceID = jsonBody.getInt("id");
            temperature = jsonBody.getFloat("temperature");
        } catch(JSONException e){
            return "Error: Invalid Request: key \"temperature\" or \"id\" not found";
        }


        //only allow increments of 0.5. This is a constraint given to us by the middleware team (pwp test backnode 79d98b704f57c1d8640c92378d42f4536a8d3be1)
        if( ((temperature * 10) %5) != 0){
            return "Error: Invalid Increment. Only Increments of 0.5 are accepted";
        }

        // create an instance of RestTemplate : Source : https://attacomsian.com/blog/spring-boot-resttemplate-post-request-json-headers
        RestTemplate restTemplate = new RestTemplate();

        // create headers
                HttpHeaders headers = new HttpHeaders();
        // set `content-type` header
                headers.setContentType(MediaType.APPLICATION_JSON);
        // set `accept` header
                headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        // request body parameters
                Map<String, Object> map = new HashMap<>();
                map.put("temperature", temperature);

        // build the request
                HttpEntity<Map<String, Object>> entity = new HttpEntity<>(map, headers);

        // send POST request
                ResponseEntity<String> postResponse = restTemplate.postForEntity(("http://localhost:3001/thermostat/"+deviceID), entity, String.class);

        HttpStatusCode statusCode = postResponse.getStatusCode();
        System.out.println("\"" + statusCode.toString() + "\"");

        if(statusCode == HttpStatus.OK){
            return "Temperature changed to "+temperature;
        }
        else{
            return "Error: Couldn't change Temperature";
        }
    }

    /*
        Makes a request to an API and returns the result //source https://reflectoring.io/spring-webclient/
    */
    private String makeRequest( String address, String authorization){

        //create the webclient which will send our requests
        WebClient client = WebClient.create();

        //Send a GET request to the URL specified by the address param
        WebClient.ResponseSpec responseSpec = client.get()
                .uri(address)
                .header("Authorization", authorization)
                .retrieve();


        //convert response to String
        String responseBody = responseSpec.bodyToMono(String.class).block();

        return responseBody;
    }

    /**
     * Returns the url of a network identified by the ID
     * @param networkID
     * @return
     */
    String getNetworkURL(String networkID){
        String networkURL = null;

        Network network = networkRepository.findNetworkByID(networkID);

        if(network != null){
            networkURL = network.getUrl();
        }

        return networkURL;
    }
}



