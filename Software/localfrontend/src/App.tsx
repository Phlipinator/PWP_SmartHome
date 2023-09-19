import { ReactElement } from 'react'
import './assets/stylesheets/App.css'
import { Navigation } from './components/Navigation'
import { Box } from '@chakra-ui/react'

const App = (): ReactElement => {
  return (
    <div className='App'>
      <Navigation />
    </div>
  )
}

export default App
