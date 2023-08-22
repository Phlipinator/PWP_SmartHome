package com.pwp.backend.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

/**
 * User represents a document on the MongoDB database containing User information, Device information and settings
 */
@Document("users")
public class User {
    @Id
    private String id;
    private List<String> deviceIdList;

    private String networkID;

    public User(String id){
        this.networkID = null;
        this.id = id;

        // Deprecated
        deviceIdList = null;
    }

    @Deprecated
    /**
     * -- DEPRECATED --
     * Adds a new device to a users list of devices
     * @param id
     */
    public void addDevice(String id){
        // Check if device already exists, if not add new device to the deviceList
        if(!deviceExists(id)){
            deviceIdList.add(id);
        }
    }
    @Deprecated
    /**
     * -- DEPRECATED --
     * Checks if a device id already exists
     * @param deviceId device id
     * @return deviceExists
     */
    public boolean deviceExists(String deviceId){
        boolean deviceExists = false;

        for(int i = 0; i < deviceIdList.size(); i++){
            String currentId = deviceIdList.get(i);
            if(currentId.equals(deviceId)){
                deviceExists = true;
                break;
            }
        }
        return deviceExists;
    }
    @Deprecated
    /**
     * --DEPRECATED --
     * Removes a device from a users document
     * @param id device id
     */
    public void removeDevice(String id) {
        for (int i = 0; i < deviceIdList.size(); i++) {
            if (deviceIdList.get(i).equals(id)) {
                deviceIdList.remove(i);
                break;
            }
        }
    }
    @Deprecated
    /**
     * --DEPRECATED --
     * Returns a device with a given deviceID
     * @param deviceID
     * @return
     */
    public String getDeviceID(String deviceID){
        String id = null;
        for (int i = 0; i < deviceIdList.size(); i++) {
            String currentID = deviceIdList.get(i);

            if(currentID.equals(deviceID)){
                id = currentID;
                break;
            }
        }
        return id;
    }

    @Deprecated
    /**
     * --DEPRECATED --
     * Returns a JSONArray containing the Device, its status, id and name
     * @return
     */
    public List<String> getDeviceList(){

        return deviceIdList;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }


    public String getNetworkID() {
        return networkID;
    }

    public void setNetworkID(String networkID) {
        this.networkID = networkID;
    }
}
