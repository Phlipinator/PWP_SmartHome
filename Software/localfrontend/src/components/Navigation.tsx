import { ReactElement } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DeviceOverview } from './pages/devicecontrol/DeviceOverview'
import { Auth0Provider } from '@auth0/auth0-react'
import { TemperatureControl } from './pages/devicecontrol/TemperatureControl'
import { frontendURL } from '../environmentVariables'
import { CameraControl } from './pages/devicecontrol/CameraControl'

const Navigation = (): ReactElement => {
  return (
    <Router>
      <Routes>
        <Route index element={<DeviceOverview />} />
        <Route path='devices/thermostat' element={<TemperatureControl />} />
        <Route path='devices/camera' element={<CameraControl />} />
      </Routes>
    </Router>
  )
}

export { Navigation }
