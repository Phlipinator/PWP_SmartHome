package com.pwp.backend.backend.model.devicedata;

import com.pwp.backend.backend.model.DeviceType;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * CameraConfig represents the configuration/setting of a thermostat
 */
@Document("data")
public class CameraData extends DeviceData {

    public CameraData(String id, ConnectionMode status){
        super(id, status);
    }

    public JSONObject getCurrentValues(){
        JSONObject returnJSON = new JSONObject();
        returnJSON.put("device-id",super.id );
        returnJSON.put("status", super.status);
        return returnJSON;
    }

    public DeviceType getDeviceType(){
        return DeviceType.CAMERA;
    }
}
