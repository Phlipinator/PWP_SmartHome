import { ReactElement } from 'react'
import { DocOverviewItemProps, DocOverviewList } from '../../ui-elements/DocOverviewElements'
import Page from '../../Page'

const DocumentationOverview = (): ReactElement => {
  const listItems: Array<DocOverviewItemProps> = [
    {
      deviceName: 'Smart Thermostat',
      deviceIconPath: 'ic_flame.svg',
      documentationLink: '/documentation/thermostat',
    },
    {
      deviceName: 'Smart Camera',
      deviceIconPath: 'ic_eye.svg',
      documentationLink: '/documentation/camera',
    },
  ]
  return (
    <Page headerName='Our Devices' hasBackButton={true} backButtonDestination='/'>
      <div className='DocumentationOverview'>
        <DocOverviewList items={listItems} />
      </div>
    </Page>
  )
}

export { DocumentationOverview }
