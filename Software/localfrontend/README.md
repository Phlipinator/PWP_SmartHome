# Starting and deploying the PWP Frontend

## Run locally

### `npm install`

### `npm run test`

The latter sets the environment variables for the backend and frontend url to localhost before starting the application

## Scripts

### `npm install`

Installs all necessary dependencies

### `npm run test`

Starts the application after setting the environment variables for the backend and frontend url to localhost

### `npm run start`

Starts the application without setting environment variables

## Deploy on Raspberry Pi

This one is a little finicky. The Raspberry Pi can't handle the build process, so you have to build the application on your local machine with `npm run build` and then copy the contents of the build folder to the folder `Software/localfrontend_on_pi/output_to_host`.

There you can simply run `npm run start` and the application will start on the Raspberry Pi.