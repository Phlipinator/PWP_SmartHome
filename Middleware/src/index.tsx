import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import ngrok from 'ngrok'
import endpointInfo from './routes/endpointInfo'
import homeAssistantOperations from './routes/homeAssistantOperations'
import deviceOperations from './routes/deviceOperations'

// Auth via auth0
import { auth } from 'express-oauth2-jwt-bearer'
import { Logger } from './util/logger'
;(global as any).WebSocket = require('ws')

dotenv.config()

const app: Express = express()

// CONSTANTS

const portEnv = process.env.APP_PORT || 3001
const port = +portEnv
const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080'

const ngrokAuthToken = process.env.NGROK_AUTH_TOKEN
if (ngrokAuthToken === undefined) {
    Logger.error('NGROK_AUTH_TOKEN is undefined in environment variables')
    process.exit(1)
}

const constantId = process.env.CONSTANT_ID || '12345'
const useVariableId =
    process.env.USE_VARIABLE_ID === undefined ? false : process.env.USE_VARIABLE_ID === 'true'

const backendRegisterMiddlewarePath = '/api/registerNetwork'

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
    audience: process.env.API_IDENTIFIER,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
})

// APP SETUP

app.use(cors())

// HELPER METHODS

const getID = () => {
    if (!useVariableId) {
        return constantId
    } else {
        // TODO: generate id some other way
        return constantId
    }
}
Logger.debug(`ID: ${getID()}`)

// Connect to ngrok
const connectNgrok = () => {
    return new Promise<string>((resolve) => {
        ngrok.authtoken(ngrokAuthToken).then(() => {
            Logger.express('Auth ngrok successful')
            ngrok.connect(port).then((middlewareUrl) => {
                Logger.express('Ngrok connected')
                Logger.express('Online address: ' + middlewareUrl)
                resolve(middlewareUrl)
            })
        })
    })
}

// Register this middleware at the pwp backend with the given ngrok middlewareUrl and id
const registerAtBackend = (middlewareUrl: string) => {
    return new Promise<void>((resolve) => {
        const url = backendUrl + backendRegisterMiddlewarePath
        Logger.express('Registering at backend: ', url)
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: middlewareUrl,
                networkId: getID().toString(),
            }),
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error('Register at backend failed')
                }
            })
            .then((json) => {
                Logger.express('Register at backend successful. Response: ')
                Logger.express(json)
                resolve()
            })
            .catch((err) => {
                Logger.error(err)
                throw new Error('Register at backend failed')
            })
    })
}

// Check if the request is from the local network
const checkLocalMode = (req: any, res: any, next: any) => {
    const ip = req.headers.host
    console.log(ip)
    if (ip === 'localhost:3001') {
        Logger.debug('Local mode')
        req.isLocalRequest = true
        next()
    } else {
        Logger.debug('Online mode')
        req.isLocalRequest = false
        checkJwt(req, res, next)
    }
}

// ROUTES

app.use('/', endpointInfo)
// app.use('/h-a', checkLocalMode, homeAssistantOperations)
app.use('/devices', checkLocalMode, deviceOperations)

// START SERVER
app.listen(port, () => {
    Logger.express(`Server is running at http://localhost:${port}`)
    connectNgrok().then((middlewareUrl) => {
        registerAtBackend(middlewareUrl).then(() => {})
    })
})
