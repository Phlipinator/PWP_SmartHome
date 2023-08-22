package com.pwp.backend.backend.repository;

import com.pwp.backend.backend.model.User;
import com.pwp.backend.backend.model.devicedata.DeviceData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.pwp.backend.backend.model.Device;

public interface DataRepository extends MongoRepository<DeviceData, String> {
    @Query("{_id: '?0'}")
    DeviceData findDeviceByID(String id);
}