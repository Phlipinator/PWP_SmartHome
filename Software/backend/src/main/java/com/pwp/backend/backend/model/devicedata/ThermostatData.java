package com.pwp.backend.backend.model.devicedata;

import com.pwp.backend.backend.model.DeviceType;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * ThermostatConfig represents the configuration/setting of a thermostat
 */
@Document("data")
public class ThermostatData extends DeviceData {
    //private int currentTemperature;
    static int HISTORY_SIZE = 5; //this constant determines how many temp data points are saved, i.e. 5 = the last five points
    private float[] temperatureHistory = new float[HISTORY_SIZE];

    private float[] humidityHistory = new float[HISTORY_SIZE];

    private float[] pressureHistory = new float[HISTORY_SIZE];

    private String[] temperatureTimestamps = new String[HISTORY_SIZE];

    //private float temperatureTarget;

    //Units of Measurement
    private String uomTemp;
    private String uomHum;
    private String uomPress;

    public ThermostatData(String id, ConnectionMode status){
        super(id, status);
        //this.temperatureTarget = 0;
        for(int i = 0; i<HISTORY_SIZE;i++){
            this.temperatureHistory[i] = -9999;  //intialize array with a default value of -9999. -9999 has been agreed upon as a defualt value as it is too extreme to occur naturally
            this.humidityHistory[i] = -9999;
            this.pressureHistory[i] = -9999;
            this.temperatureTimestamps[i] = "N/A";
        }
        this.uomTemp = "°C";
        this.uomHum = "%";
        this.uomPress = "hPa";

    }
    public float getCurrentTemperature() {
        return temperatureHistory[0];
    }
    public float getCurrentHumidity() {
        return humidityHistory[0];
    }
    public float getCurrentPressure() {
        return pressureHistory[0];
    }
    public String getCurrentTimestamp() {
        return temperatureTimestamps[0];
    }

    public float[] getTemperatureHistory(){
        return  temperatureHistory;
    }
    public float[] getHumidityHistory(){
        return  humidityHistory;
    }
    public float[] getPressureHistory(){
        return  pressureHistory;
    }
    public String getUomTemp(){
        return  uomTemp;
    }
    public String getUomHum(){
        return  uomHum;
    }
    public String getUomPress(){
        return  uomPress;
    }
    public String[] getTimestamps(){
        return  temperatureTimestamps;
    }
    //public float getTemperatureTarget(){return this.temperatureTarget;}
    public ConnectionMode getStatus(){return this.status;}
    public void setStatus(ConnectionMode status){this.status = status;}
    public void setCurrentValues(float currentTemperature,float currentHumidity, float currentPressure, String timestamp, String uomTemp, String uomHum, String uomPress, ConnectionMode status) {
        for(int i = HISTORY_SIZE-1; i > 0 ; i--){
            this.temperatureHistory[i] = this.temperatureHistory[i-1];
            this.humidityHistory[i] = this.humidityHistory[i-1];
            this.pressureHistory[i] = this.pressureHistory[i-1];
            this.temperatureTimestamps[i] = this.temperatureTimestamps[i-1];
        }
        this.temperatureHistory[0] = currentTemperature;
        this.humidityHistory[0] = currentHumidity;
        this.pressureHistory[0] = currentPressure;
        this.temperatureTimestamps[0] = timestamp;
        this.uomTemp = uomTemp;
        this.uomHum = uomHum;
        this.uomPress = uomPress;
        //this.temperatureTarget = temperatureTarget;
        this.setStatus(status);

    }
    public JSONObject getCurrentValues(){
        JSONObject returnJSON = new JSONObject();
        returnJSON.put("device-id",super.id );
        returnJSON.put("temperature-history",this.temperatureHistory);
        returnJSON.put("humidity-history",this.humidityHistory);
        returnJSON.put("pressure-history", this.pressureHistory);
        returnJSON.put("timestamp-history", this.temperatureTimestamps);
        returnJSON.put("uomTemp", this.uomTemp);
        returnJSON.put("uomHum", this.uomHum);
        returnJSON.put("uomPress", this.uomPress);
       //returnJSON.put("target-temperature", this.temperatureTarget);
        if (super.status == ConnectionMode.ONLINE) {
            returnJSON.put("status", "ONLINE");
        } else {
            returnJSON.put("status", "OFFLINE");
        }
        return returnJSON;
    }

    public DeviceType getDeviceType(){
        return DeviceType.THERMOSTAT;
    }
}
