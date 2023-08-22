# PWP Middleware
## Running the middleware
### Prerequisites
- Install Node.js
- Install dependencies with `npm install`
- Create (or ask David for the file) a `.env` file in the root directory of the project containing:
  - CONSTANT_ID=[5-digit-ID of this middleware]
  - USE_VARIABLE_ID=[true if ID should be variable]
  - APP_PORT=[port on which the middleware should run]
  - BACKEND_URL=[URL of the backend]
  - HOME_ASSISTANT_HOST=[host address of the Home Assistant instance]
  - HOME_ASSISTANT_PORT=[port of the Home Assistant instance]
  - LONG_LIFE_ACCESS_TOKEN=[long life access token for the Home Assistant instance]
  - NGROK_AUTH_TOKEN=[auth token for ngrok]
  - API_IDENTIFIER="http://localhost/api/"
  - ISSUER_BASE_URL="https://dev-xn1qpn6ctori543q.us.auth0.com/"
  - MQTT_HOST=[host address of the MQTT broker]
  - MQTT_PORT=[port of the MQTT broker]
  - MQTT_USERNAME=[username for the MQTT broker]
  - MQTT_PASSWORD=[password for the MQTT broker]
### Running
- Run the middleware with `npm dev`. This contains building the typescript project and starting the server.