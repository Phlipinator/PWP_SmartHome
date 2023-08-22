import { ReactElement } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { DocumentationOverview } from './pages/documentation/DocumentationOverview'
import { DeviceOverview } from './pages/devicecontrol/DeviceOverview'
import Profile from './pages/profile/Profile'
import { Auth0Provider } from '@auth0/auth0-react'
import PrivateArea from './PrivateArea'
import CallbackPage from './account/CallbackPage'
import { TemperatureControl } from './pages/devicecontrol/TemperatureControl'
import { EnterHubID } from './pages/adddevice/EnterHubID'
import { frontendURL } from '../environmentVariables'
import { CameraControl } from './pages/devicecontrol/CameraControl'
import { SmartThermostatDocumentation } from './pages/documentation/SmartThermostatDocumentation'
import { CameraDocumentation } from './pages/documentation/CameraDocumentation'

const Navigation = (): ReactElement => {
  return (
    <Router>
      <Auth0Provider
        domain='https://dev-xn1qpn6ctori543q.us.auth0.com'
        clientId='kRQuO57fxBbFrfkcq4G2qwDcm8BqwY1h'
        redirectUri={`${frontendURL}/callback`}
        audience='http://localhost/api/'
        useRefreshTokens
        cacheLocation='localstorage'
      >
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path='documentation' element={<DocumentationOverview />} />
          <Route path='documentation/thermostat' element={<SmartThermostatDocumentation />} />
          <Route path='documentation/camera' element={<CameraDocumentation />} />
          <Route path='callback' element={<CallbackPage />} />

          <Route
            path='add'
            element={
              <PrivateArea>
                <EnterHubID />
              </PrivateArea>
            }
          ></Route>

          <Route
            path='devices'
            element={
              <PrivateArea>
                <DeviceOverview />
              </PrivateArea>
            }
          />
          <Route path='devices/thermostat' element={<TemperatureControl />} />
          <Route path='devices/camera' element={<CameraControl />} />

          <Route
            path='profile'
            element={
              <PrivateArea>
                <Profile />
              </PrivateArea>
            }
          >
            {/* TODO: Add sites and routes for personal device information and control */}
          </Route>
        </Routes>
      </Auth0Provider>
    </Router>
  )
}

export { Navigation }
