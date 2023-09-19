//
export interface ConnectionMode {
  id: number
  name: string
  shortDescription: string
  color: string
  imageSource: string
}

export const OFFLINE = {
  id: 0,
  name: 'Offline',
  shortDescription: 'Disconnect and use physical controls',
  color: '#ff5050',
  imageSource: '/assets/images/wifi-off.png',
}
export const AP_MODE = {
  id: 1,
  name: 'Access Point',
  shortDescription: 'Control device via AP mode',
  color: '#ffcc66',
  imageSource: '/assets/images/ap.png',
}
export const LOCAL_NETWORK = {
  id: 2,
  name: 'Local Network',
  shortDescription: 'Control all devices in the network',
  color: 'RoyalBlue',
  imageSource: '/assets/images/wifi.png',
}
export const ONLINE = {
  id: 3,
  name: 'Online',
  shortDescription: 'Control your devices from anywhere',
  color: '#339966',
  imageSource: '/assets/images/online.png',
}
