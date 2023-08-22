package com.pwp.backend.backend.model;

import com.pwp.backend.backend.model.devicedata.CameraData;
import com.pwp.backend.backend.model.devicedata.ConnectionMode;
import com.pwp.backend.backend.model.devicedata.DeviceData;
import com.pwp.backend.backend.model.devicedata.ThermostatData;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Device represents a device a user adds to their account
 */
@Document("devices")    //"devices" is the name of the collection in mongodb where the devices are stored
public class Device {

    private String id;
    private String name;
    private DeviceType deviceType;


    public Device(String id, DeviceType deviceType){
        this.id = id;
        this.name = "Device"; // Default name, can be changed later
        this.deviceType = deviceType;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceType deviceType) {
        this.deviceType = deviceType;
    }

}
