package com.pwp.backend.backend.model;

import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Network represents a network a user can connect to
 */
@Document("networks")
public class Network {

    private String id;
    private String url;

    public Network(String id, String url){
        this.id = id;
        this.url = url;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
