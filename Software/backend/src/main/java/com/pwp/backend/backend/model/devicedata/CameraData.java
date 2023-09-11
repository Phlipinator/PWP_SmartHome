package com.pwp.backend.backend.model.devicedata;

import com.pwp.backend.backend.model.DeviceType;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * CameraConfig represents the configuration/setting of a thermostat
 */
@Document("data")
public class CameraData extends DeviceData {

    String currentStreamUrl;

    public CameraData(String id, ConnectionMode status){
        super(id, status);
    }

    public JSONObject getCurrentValues(){
        JSONObject returnJSON = new JSONObject();
        returnJSON.put("device-id",super.id );
        if (super.status == ConnectionMode.ONLINE) {
            returnJSON.put("status", "ONLINE");
        } else {
            returnJSON.put("status", "OFFLINE");
        }
        returnJSON.put("stream-url", currentStreamUrl);
        return returnJSON;
    }

    public void setCurrentValues(String streamUrl, ConnectionMode status){
        this.currentStreamUrl = streamUrl;
        super.status = status;
    }

    public DeviceType getDeviceType(){
        return DeviceType.CAMERA;
    }
}
