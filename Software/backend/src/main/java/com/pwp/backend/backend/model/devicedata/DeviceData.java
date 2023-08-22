package com.pwp.backend.backend.model.devicedata;

import com.pwp.backend.backend.model.DeviceType;
import org.json.JSONObject;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Abstract superclass that stores device data
 */
@Document("data")
public abstract class DeviceData {

    protected String id;
    protected ConnectionMode status; // false == offline, true == online
    public DeviceData(String id, ConnectionMode status){
        this.id = id;
        this.status = status;
    }

    public String getId(){return this.id;}
    //public abstract String[] getTimestamps();

    public void setStatus(ConnectionMode status){
        this.status = status;
    }

    public ConnectionMode getStatus() {
        return status;
    }

    public abstract DeviceType getDeviceType();
    public abstract JSONObject getCurrentValues();
}
