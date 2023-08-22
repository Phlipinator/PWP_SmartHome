package com.pwp.backend.backend.repository;

import com.pwp.backend.backend.model.Device;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface DeviceRepository extends MongoRepository<Device, String> {

    @Query("{_id: '?0'}")
    Device findDeviceByID(String id);

}
