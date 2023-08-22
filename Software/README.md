
<h1><img src="https://i.ibb.co/zJfZ6xK/pwp-animation.gif" alt="PWP Smarthome" ></h1>

<h3 align="center">A smart home application built with <a href="https://reactjs.org/" target="_blank">React</a> (Frontend), <a href="https://spring.io/" target="_blank">Spring</a> (Backend), <a href="https://www.mongodb.com/" target="_blank">MongoDB</a> (Database) and secured by <a href="https://auth0.com/" target="_blank">Auth0</a> (Authentification)<br></br></h3> 

![screenshot](https://i.ibb.co/sQ9yVzH/arch-new.png)

## Table Of Content

- [Features](#features)
- [Setup](#setup)
    - [Frontend (React, Node)](#frontend)
    - [Backend (Spring)](#backend)
- [Authorization](#authorization)
    - [Auth0 Authorization](#auth0)
    - [MongoDB Authorization](#mongodb)
- [Related](#related)
- [Credits](#credits)

## Features

* Add a hub to a users account to display all connected devices within the network
* Account system using [Auth0](https://auth0.com/) to authorize access to a network
  - Register using E-Mail + Password to create an account
  - Social identity providers can be used to create an account (Google)
* Switch a devices mode
  - **[0] Offline**: Only allows hardware related actions
  - **[1] Access Point**: Only allows actions when directly connected to a smart devices access point
  - **[2] Local Network**: Only allows actions when connected to a hub within the same network
  - **[3] Online**: Full remote access to a devices functionality from anywhere
* Store and display history of data when a device is in online mode (Thermostat only)
* Compatible devices
  - Thermostat
  - Camera

![screenshot](https://i.ibb.co/X42bJCS/screenshots-new.png)

## Setup
### Frontend

Requirements:
* [Git](https://git-scm.com)
* [Node.js](https://nodejs.org/)

```bash
# Clone repository
$ git clone https://gitlab.com/pwp-server/pwp-server.git

# Go into the repository
$ cd frontend/scr

# Install dependencies
$ npm install

# Run the app
$ npm start
```


### Backend
**Requirements:**
* [Git](https://git-scm.com)
* [Java 19](https://jdk.java.net/19/)
* [IntelliJ](https://www.jetbrains.com/de-de/idea/)


```bash
# Clone repository
$ git clone https://gitlab.com/pwp-server/pwp-server.git
```
* Open backend project in **IntelliJ**
* Make sure the project is recognized as **Maven Project**
* If needed, reload **pom.xml** to download dependencies (should download automatically after opening the project)

```Java
// Run main method in BackendApplication.java
public static void main(String[] args) {
	SpringApplication.run(BackendApplication.class, args);
}
```
## Authorization
### Auth0
**Frontend:**
* The Auth0 settings are handled by the **Auth0 React SDK**
* Auth0 settings in ***frontend/src/src/components/Navigation.tsx*** are already set up. To use your own Auth0 Account change **domain**, **clientId** and **audience**

```typescript
<Auth0Provider
    domain= <domain>
    clientId= <clientId>
    audience= <audience>
>
```

**Backend:**
* The Auth0 settings are handled by **Spring Security**
* Auth0 settings in ***scr/ressources/application.yml*** are already set up. To use your own Auth0 Account change **audience** and **issuer-uri**

```
auth0:
  audience: <audience>
spring:
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: <issuer-uri>
```
### MongoDB
* MongoDB settings in ***scr/ressources/application.properties*** are already set up. To use your own Mongo database change **authentication-database**, **username**, **password**, **database** and **uri**
```
spring.data.mongodb.authentication-database = <authentication-database>
spring.data.mongodb.username = <username>
spring.data.mongodb.password = <password>
spring.data.mongodb.database = <database>
spring.data.mongodb.uri = <uri>
```

## Credits

Software used:

Frontend
- [Node.js](https://nodejs.org/), [React](https://reactjs.org/), [Chakra UI](https://chakra-ui.com/)

Backend
- [Maven](https://maven.apache.org/), [Spring](https://spring.io/)

Database
- [MongoDB](https://www.mongodb.com/)

## Related

[Hardware](https://) - Git Repository of the Hardware project

[Middleware](https://gitlab.lrz.de/marcello/pwp_test_node_backend) - Git Repository of the Middleware project


---

A webprogramming project at LMU Munich - [Praktikum Web Programmierung WiSe 22/23](https://www.medien.ifi.lmu.de/lehre/ws2223/pwp/) 

