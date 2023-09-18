package com.pwp.backend.backend.controller;

import com.pwp.backend.backend.model.*;
import com.pwp.backend.backend.model.devicedata.CameraData;
import com.pwp.backend.backend.model.devicedata.ConnectionMode;
import com.pwp.backend.backend.model.devicedata.DeviceData;
import com.pwp.backend.backend.model.devicedata.ThermostatData;
import com.pwp.backend.backend.repository.DataRepository;
import com.pwp.backend.backend.repository.DeviceRepository;
import com.pwp.backend.backend.repository.NetworkRepository;
import com.pwp.backend.backend.repository.UserRepository;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.jwt.JwtHelper;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * APIController handles the APIs used by the frontend application
 */
@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*")
public class APIController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DataRepository dataRepository;
    @Autowired
    private DeviceRepository deviceRepository;
    @Autowired
    private NetworkRepository networkRepository;

    /**
     * When a user logs in the server checks if they already have a user document, if not a new document will be created and stored on the database
     * e.g. http://localhost:8080/api/login?userID=432d8700ns432afl532412ak344329
     * @return response JSON
     */
    @PostMapping("/login")
    public String login(@RequestParam String userID, @RequestHeader("authorization") String authorization){

        // User ID
        String id = getUserID(authorization);

        // Response
        JSONObject response = new JSONObject();

        // Check if username exists on MongoDB
        User user = userRepository.findUserByID(id);

        // Create user document if user doesn't exist
        if(user == null){
            User newUser = new User(id);
            userRepository.save(newUser);
            response.put("Message", "New User created. Login successful.");
        }else{
            response.put("Message", "Login successful.");
        }

        return response.toString();
    }

    /**
     * --DEPRECATED--
     * Adds a device to a users deviceList, when the deviceId already exists the request is ignored
     * e.g. http://localhost:8080/api/addDevice?userID=432d8700ns432afl532412ak344329
     * @param userID
     * @param body
     * e.g.
     * {
     *     "deviceID" : "fs7f89sdg7sdfpdfs7g57ds0fd3214123jk12nj",
     *     "deviceType" : 0
     * }
     * @return
     */

    @Deprecated
    @PostMapping("/addDevice")
    public String addDevice(@RequestParam String userID, @RequestBody String body, @RequestHeader("authorization") String authorization){
        // User ID
        String id = getUserID(authorization);

        // Response
        JSONObject response = new JSONObject();

        // Request body
        JSONObject jsonBody = new JSONObject(body);
        String deviceID;

        // Check if JSON is valid
        try {
            deviceID = jsonBody.getString("deviceId");
        } catch(JSONException e){
            response.put("Message","Invalid JSON body");
            return response.toString();
        }

        // Check if user exists on MongoDB
        User user = userRepository.findUserByID(id);

        // Check if user exists
        if(user != null){

            // Check if device already exists
            if(!user.deviceExists(deviceID)){
                // Get deviceType from database
                Device device = deviceRepository.findDeviceByID(deviceID);

                // Check if deviceID exists
                if(device != null){
                    user.addDevice(deviceID);

                    response.put("Message", "Device (" + deviceID +") successfully added to User (" + userID + ")");
                    userRepository.save(user);

                    // Check if Device already exists in the global device list
                    DeviceData deviceData = dataRepository.findDeviceByID(deviceID);

                    // Save the device if it is new
                    if(deviceData == null){

                        DeviceData newDevice;
                        switch(device.getDeviceType()){
                            case THERMOSTAT:
                                newDevice = new ThermostatData(deviceID, ConnectionMode.ONLINE);
                                dataRepository.save(newDevice);
                                break;
                            case CAMERA:
                                newDevice = new CameraData(deviceID, ConnectionMode.ONLINE);
                                dataRepository.save(newDevice);
                                break;
                            default:
                                response.put("Message", "Devicetype not supported");
                                return response.toString();
                        }
                    }

                } else{
                    response.put("Message", "Unknown device.");
                }
            } else{
                response.put("Message", "Device already exists.");
            }
        } else{
            response.put("Message", "Unknown user id.");
        }

        return response.toString();
    }

    /**
     * --DEPRECATED--
     * Removes a device from a users deviceList, when the deviceId doesn't exist the request is ignored
     * e.g. http://localhost:8080/api/removeDevice?userID=432d8700ns432afl532412ak344329
     * @param userID
     * @param body
     * e.g.
     * {
     *     "deviceID" : "fs7f89sdg7sdfpdfs7g57ds0fd3214123jk12nj",
     * }
     * @return
     */
    @Deprecated
    @DeleteMapping("/removeDevice")
    public String removeDevice(@RequestParam String userID, @RequestBody String body, @RequestHeader("authorization") String authorization){
        // User ID
        String id = getUserID(authorization);

        // Response
        JSONObject response = new JSONObject();

        // Request body
        JSONObject jsonBody = new JSONObject(body);
        String deviceID;

        // Check if JSON is valid
        try {
            deviceID = jsonBody.getString("deviceId");
        } catch(JSONException e){
            response.put("Message","Invalid JSON body");
            return response.toString();
        }

        // Check if user exists on MongoDB
        User user = userRepository.findUserByID(id);

        // Create user document if user doesn't exist
        if(user != null){
            // TODO: Send request to API Server to remove a device with given ID
            user.removeDevice(deviceID);
            userRepository.save(user);
            response.put("Message", "Device (" + deviceID +") successfully removed from User (" + userID + ")");
        }else{
            response.put("Message", "Unknown user id.");
        }

        return response.toString();
    }

    /**
     * Return the users list of devices with data needed to display them in the frontend
     * @param userID
     * @return response list of devices as JSON
     */
    @GetMapping("/getUserDevices")
    public String getUserDevices(@RequestParam String userID, @RequestHeader("authorization") String authorization) throws IOException, InterruptedException {
        // User ID
        String id = getUserID(authorization);

        // User ID
        User user = userRepository.findUserByID(id);

        // Response
        JSONObject response = new JSONObject();

        if(user != null){
            
            // When the user hasn't added a network to their account
            if( getNetworkURL(user.getNetworkID()) == null){
                response.put("Message", "Please add a hub.");
                return response.toString();
            }

            // Send request to local server asking for a list of connected devices
            // Tutorial from: https://www.baeldung.com/java-httpclient-post
            HttpClient client = HttpClient.newBuilder().build();
            HttpRequest req = HttpRequest.newBuilder()
//                        .uri(URI.create(getNetworkURL(user.getNetworkID()) +  "/h-a/deviceList"))
                        .uri(URI.create(getNetworkURL(user.getNetworkID()) +  "/devices"))
                        .headers("authorization", authorization)
                        .GET()
                        .build();

            HttpResponse res = client.send(req, HttpResponse.BodyHandlers.ofString());
            System.out.println("RESPONSE: " + res.body().toString());
            JSONObject body = new JSONObject(res.body().toString());

            // Format JSON
            JSONArray deviceArray = body.getJSONArray("devices");
            JSONArray devices = new JSONArray();

            for (int i = 0; i< deviceArray.length(); i++){
                JSONObject currentDevice = deviceArray.getJSONObject(i);

                String currentDeviceId = currentDevice.getString("id");
                DeviceType currentDeviceType = getDeviceType(currentDeviceId);

                ConnectionMode currentMode = null;

                // Detect type and convert to enum
                Object connectionModeType = currentDevice.get("mode");

                if(connectionModeType instanceof Integer){
                    currentMode = ConnectionMode.values()[currentDevice.getInt("mode")];
                }else if(connectionModeType instanceof String){
                    currentMode = ConnectionMode.OFFLINE;
                }

                String currentDeviceName = currentDevice.getString("name");

                // Create data document on database, if device don't exist yet
                DeviceData currentDeviceData = dataRepository.findDeviceByID(currentDeviceId);

                if(currentDeviceData == null){
                    switch (currentDeviceType){
                        case CAMERA -> currentDeviceData = new CameraData(currentDeviceId,currentMode);
                        case THERMOSTAT -> currentDeviceData = new ThermostatData(currentDeviceId,currentMode);
                    }

                    dataRepository.save(currentDeviceData); // Will never be null
                }

                // Device JSON
                JSONObject deviceJSON = new JSONObject();
                deviceJSON.put("deviceId", currentDeviceId);
                deviceJSON.put("mode", currentMode);
                deviceJSON.put("deviceType", currentDeviceType);
                deviceJSON.put("name", currentDeviceName);

                devices.put(deviceJSON);
            }

            response.put("devices", devices);

        } else{
            response.put("Message", "Unknown user id.");
        }


        return response.toString();
    }

    /**
     * Requests a connectionMode change of a device to the local server
     * @param body
     * e.g.
     * {
     *     "connectionMode" : 0
     * }
     * @return
     */
    @PostMapping("/setConnectionMode")
    public String setConnectionMode(@RequestBody String body, @RequestHeader("authorization") String authorization) throws IOException, InterruptedException {
        // User ID
        String id = getUserID(authorization);
        User user = userRepository.findUserByID(id);

        // Response
        JSONObject response = new JSONObject();

        // Request body
        JSONObject jsonBody = new JSONObject(body);
        String deviceID;
        int connectionMode;

        // Check if JSON is valid
        try {
            deviceID = jsonBody.getString("deviceId");
            connectionMode = jsonBody.getInt("connectionMode");
        } catch(JSONException e){
            response.put("Message","Invalid JSON body");
            return response.toString();
        }

        if(user != null){
            // Check if connectionMode is valid
            if(connectionMode >= 0 && connectionMode < ConnectionMode.values().length){

                // Send request to local server to change a devices mode
                // Tutorial from: https://www.baeldung.com/java-httpclient-post
                HttpClient client = HttpClient.newBuilder().build();
                HttpRequest req = HttpRequest.newBuilder()
                        .uri(URI.create(getNetworkURL(user.getNetworkID()) +  "/devices/setConnectionMode?deviceId=" + deviceID))
                        .header ("authorization", authorization)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString("{\"connectionMode\": "+ connectionMode + "}"))
                        .build();

                HttpResponse res = client.send(req, HttpResponse.BodyHandlers.ofString());

                response.put("Message", "Device(" + deviceID + ") set to ConnectionMode("+ ConnectionMode.values()[connectionMode] +")");
            } else{
                response.put("Message", "Invalid ConnectionMode.");
            }
        } else{
            response.put("Message", "Unknown user id.");
        }
        return response.toString();
    }

    /**
     * Registers a network with its URL and ID to the network database which a user can add to their account
     * @param body
     * e.g.
     * {
     *     "networkId" : "12345"
     *     "url" : "http://xyz"
     * }
     * @return
     */
    @PostMapping("/registerNetwork")
    public String registerNetwork(@RequestBody String body){

        // Response
        JSONObject response = new JSONObject();

        // Request body
        JSONObject jsonBody = new JSONObject(body);
        String url;
        String networkId;

        // Check if JSON is valid
        try {
            url = jsonBody.getString("url");
            networkId = jsonBody.getString("networkId");
        } catch(JSONException e){
            response.put("Message","Invalid JSON body");
            return response.toString();
        }

        Network network = networkRepository.findNetworkByID(networkId);

        // Check if network already exists
        if(network == null){
            network = new Network(networkId, url);
            networkRepository.save(network);
        } else{
            // Override network url if ID already exists
            network.setUrl(url);
            networkRepository.save(network);
            response.put("Message","Network already exists. URL updated.");
        }

        return response.toString();
    }

    /**
     * Adds a network to a user from which requests are sent to using a 5 digit networkID
     * @param body
     * e.g.
     * {
     *     "networkId" : "12345"
     * }
     * @param authorization
     * @return
     */
    @PostMapping("/addNetwork")
    public String addNetwork(@RequestBody String body, @RequestHeader("authorization") String authorization){

        // User ID
        String id = getUserID(authorization);
        User user = userRepository.findUserByID(id);

        // Response
        JSONObject response = new JSONObject();

        // Request body
        JSONObject jsonBody = new JSONObject(body);
        String networkID;

        // Check if JSON is valid
        try {
            networkID = jsonBody.getString("networkId");
        } catch(JSONException e){
            response.put("Message","Invalid JSON body");
            return response.toString();
        }

        if(user != null){
                // Check if network is registered
                Network network = networkRepository.findNetworkByID(networkID);

                if(network != null){
                    String networkURL = network.getUrl();
                    user.setNetworkID(networkID);
                    userRepository.save(user);
                } else{
                    response.put("Message", "Unknown network id.");
                }
        } else{
            response.put("Message", "Unknown user id.");
        }
        return response.toString();
    }

    /**
     * Removes a network from a users account
     * @param authorization
     * @return
     */
    @PostMapping("/removeNetwork")
    public String removeNetwork(@RequestHeader("authorization") String authorization){

        // User ID
        String id = getUserID(authorization);
        User user = userRepository.findUserByID(id);

        // Response
        JSONObject response = new JSONObject();

        if(user != null){
                user.setNetworkID(null);
                userRepository.save(user);

            response.put("Message", "Network removed from user(" + id + ")");
        } else{
            response.put("Message", "Unknown user id.");
        }
        return response.toString();
    }

    /**
     * Extract the userID generated by the used OID Provider from the Authorization Header
     * @param authHeader
     * @return
     */
    public static String getUserID(String authHeader){
        // access user id
        String accessToken = authHeader.substring(authHeader.indexOf(" ")+1);
        String claims = JwtHelper.decode(accessToken).getClaims();
        JSONObject userInfoJson = new JSONObject(claims);
        String id = (String) userInfoJson.get("sub");
        return id;
    }

    /**
     * Returns the deviceType of a given deviceId
     * @param deviceId
     * @return
     */
    DeviceType getDeviceType(String deviceId){
        Device device = deviceRepository.findDeviceByID(deviceId);
        DeviceType deviceType = device.getDeviceType();

        return deviceType;
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


    /*======================================================================================
     * TEST ENDPOINTS
     * ======================================================================================*/

    /**
     * (TEST API) Public endpoint that can be accessed without authentication
     */
    @GetMapping("/public")
    public String publicEndpoint() {
        return "Public API Test";
    }

    /**
     * (TEST API) Private endpoint that is only accessible for authenticated users
     */
    @GetMapping("/private")
    public String privateEndpoint() {
        return "Private API Test";
    }


    /**
     * (TEST API) Mock endpoint to simulate responses from the local server "/deviceList"
     * */
    @GetMapping("/h-a/deviceList")
    public String deviceList() {
        return "{\n" +
                "    \"devices\": [\n" +
                "        {\n" +
                "            \"id\": \"temperatur_data_1\",\n" +
                "            \"mode\": \"3\",\n" +
                "            \"name\": \"Temperature Sensor\"\n" +
                "        },\n" +
                "        {\n" +
                "            \"id\": \"camera_stream_1\",\n" +
                "            \"mode\": \"3\",           \n" +
                "            \"name\": \"Camera\"\n" +
                "        }\n" +
                "    ]\n" +
                "}";
    }

    /**
     * (TEST API) Mock endpoint to simulate responses from the local server "/deviceInfo"
     * */
    @GetMapping("/h-a/deviceInfo")
    public String deviceInfo(@RequestParam String deviceId) {
        String response = null;

        if(deviceId.equals("temperatur_data_1")){
            response = "{\n" +
                    "    \"id\": \"temperatur_data_1\",\n" +
                    "    \"name\": \"Temperature Sensor\",\n" +
                    "    \"mode\": 3,\n" +
                    "    \"deviceData\": [\n" +
                    "        {\n" +
                    "            \"state\": \"25.71\",\n" +
                    "            \"mode\": \"3\",\n" +
                    "            \"timestamp\": \"2023-02-21T20:38:31.047762+00:00\",\n" +
                    "            \"unit_of_measurement\": \"°C\",\n" +
                    "            \"name\": \"MQTT Temperature\"\n" +
                    "        },\n" +
                    "        {\n" +
                    "            \"state\": \"36.79\",\n" +
                    "            \"mode\": \"3\",\n" +
                    "            \"timestamp\": \"2023-02-21T20:38:31.047014+00:00\",\n" +
                    "            \"unit_of_measurement\": \"%\",\n" +
                    "            \"name\": \"MQTT Humidity\"\n" +
                    "        },\n" +
                    "        {\n" +
                    "            \"state\": \"951.15\",\n" +
                    "            \"mode\": \"3\",\n" +
                    "            \"timestamp\": \"2023-02-21T20:38:31.046009+00:00\",\n" +
                    "            \"unit_of_measurement\": \"hPa\",\n" +
                    "            \"name\": \"MQTT Pressure\"\n" +
                    "        }\n" +
                    "    ]\n" +
                    "}";

        } else if(deviceId.equals("camera_stream_1")){
            response = "{\n" +
                    "    \"state\": \"http://webprogramming.dynv6.net:8889/mystream/\",\n" +
                    "    \"unit_of_measurement\": \"webrtc\",\n" +
                    "    \"mode\": 3,\n" +
                    "    \"timestamp\": \"2023-02-06T16:20:21.597387+00:00\",\n" +
                    "    \"name\": \"Camera Stream\"\n" +
                    "}";
        }
        return response;
    }
}
