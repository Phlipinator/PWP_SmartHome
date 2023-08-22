package com.pwp.backend.backend.repository;

import com.pwp.backend.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import com.pwp.backend.backend.model.Device;

public interface UserRepository extends MongoRepository<User, String> {
    @Query("{username: '?0'}")
    User findUserByName(String username);
    @Query("{_id: '?0'}")
    User findUserByID(String id);

}
