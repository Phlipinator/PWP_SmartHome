package com.pwp.backend.backend.repository;

import com.pwp.backend.backend.model.Network;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface NetworkRepository extends MongoRepository<Network, String> {

    @Query("{_id: '?0'}")
    Network findNetworkByID(String id);

}
