import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  console.log('Endpoint info requested')

  const endpointInfo = {
    routes: [
      {
        description: 'Home Assistant connection check',
        path: 'GET /h-a',
      },
      {
        description: 'Home Assistant devices',
        path: 'GET /h-a/deviceList',
      },
      {
        description: 'Home Assistant device info',
        path: 'GET /h-a/deviceInfo?deviceId=test',
      },
      {
        description: 'Home Assistant set connection mode',
        path: 'POST /h-a/setConnectionMode?deviceId=test',
        body: '{ "connectionMode": 2 }',
      },
    ],
  }

  res.json(endpointInfo)
})

export default router
