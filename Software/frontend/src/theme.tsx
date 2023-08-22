import { extendTheme } from '@chakra-ui/react'

const pwpTheme = extendTheme({
  fonts: {
    body: '"Open Sans", sans-serif',
    heading: '"Open Sans", sans-serif',
  },
  colors: {
    customBackground: {
      main: '#242424',
      card: '#343639',
      cardHover: '#606060',
      online: '#2e7d32',
      offline: '#854141',
    },
    // Generated using https://smart-swatch.netlify.app/
    buttonGreen: {
      50: '#e6fae7',
      100: '#c4ebc7',
      200: '#a1dda4',
      300: '#7dcf81',
      400: '#58c15e',
      500: '#40a844',
      600: '#308234',
      700: '#215d24',
      800: '#123814',
      900: '#001500',
    },
  },
  sizes: {
    custom: {
      arrowIcon: '40px',
    },
  },
})

export default pwpTheme
