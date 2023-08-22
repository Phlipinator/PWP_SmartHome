import express from 'express'
import dotenv from 'dotenv'
import {
    Connection,
    createConnection,
    createLongLivedTokenAuth,
    getStates,
} from 'home-assistant-js-websocket'
import mapDeviceList from '../util/deviceUtil'
import { Logger } from '../util/logger'

dotenv.config()

// CONSTANTS

const homeAssistantHost = process.env.HOME_ASSISTANT_HOST
if (homeAssistantHost === undefined) {
    Logger.error('HOME_ASSISTANT_HOST is undefined in environment variables')
    process.exit(1)
}

const homeAssistantPort = process.env.HOME_ASSISTANT_PORT
if (homeAssistantHost === undefined) {
    Logger.error('HOME_ASSISTANT_PORT is undefined in environment variables')
    process.exit(1)
}

const longLifeAccessToken = process.env.LONG_LIFE_ACCESS_TOKEN
if (longLifeAccessToken === undefined) {
    Logger.error('LONG_LIFE_ACCESS_TOKEN is undefined in environment variables')
    process.exit(1)
}

const router = express.Router()

// HELPER METHODS

/**
 * Get auth for Home Assistant
 */
const getHomeAssistentAuth = () => {
    const homeAssistantUrl = `https://${homeAssistantHost}:${homeAssistantPort}`

    console.log(`URL to Home Assistant: ${homeAssistantUrl}`)
    // Authenticate via long live token
    return createLongLivedTokenAuth(homeAssistantUrl, longLifeAccessToken)
}

/**
 * Connect to Home Assistant
 */
const connectToHomeAssistant = () => {
    console.log('Connecting to Home Assistant...')
    return new Promise<Connection | undefined>((resolve) => {
        try {
            const homeAssistantAuth = getHomeAssistentAuth()
            createConnection({ auth: homeAssistantAuth }).then((conn) => {
                const homeAssistantVersion = conn.haVersion
                if (homeAssistantVersion) {
                    console.log('Connected to Home Assistant.')
                    resolve(conn)
                } else {
                    console.log('Could not connect to Home Assistant.')
                    resolve(undefined)
                }
            })
        } catch (err) {
            homeAssistantErrorHandler(err)
        }
    })
}

const homeAssistantErrorHandler = (err: unknown) => {
    switch (err) {
        case 1:
            console.error('ERR_CANNOT_CONNECT') // May check API_URL!
            break
        case 2:
            console.error('ERR_INVALID_AUTH')
            break
        case 3:
            console.error('ERR_CONNECTION_LOST')
            break
        case 4:
            console.error('ERR_HASS_HOST_REQUIRED')
            break
        case 5:
            console.error('ERR_INVALID_HTTPS_TO_HTTP')
            break
        default:
            console.error(err)
    }
}

// ROUTES

/**
 * GET Check connection to Home Assistant
 */
router.get('/', async (req, res) => {
    console.log('Request received - route: h-a/ -> Check connection')
    connectToHomeAssistant().then((conn) => {
        if (conn) {
            res.send({ result: `Connected to Home Assistant with version ${conn.haVersion}` })
            // Close socket connection
            conn.close()
            console.log('Home Assistant connection closed.')
        } else {
            res.send({ result: 'Could not connect to Home Assistant' })
        }
    })
})

/**
 * GET all available devices from the Home Assistant and their states
 */
router.get('/deviceList', async (req, res) => {
    console.log('Request received - route: h-a/deviceList')
    connectToHomeAssistant().then((conn) => {
        if (conn) {
            getStates(conn).then((entities) => {
                // Close socket connection
                conn.close()
                console.log('Home Assistant connection closed.')
                const devices = mapDeviceList(entities)

                // Send json
                res.send({ devices })
            })
        } else {
            res.send({ result: 'Could not connect to Home Assistant' })
        }
    })
})

export default router
