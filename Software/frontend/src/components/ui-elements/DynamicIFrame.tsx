import React, { Component, ReactEventHandler, useEffect, useRef, useState } from 'react'

interface DynamicIframeProps {
  src: string
}

const DynamicIframe: React.FC<DynamicIframeProps> = (props) => {
  // iFrame ref
  const iFrameRef = useRef<any>()
  const [height, setHeight] = useState(0)

  useEffect(() => {
    console.log('src changed')
    console.log(props.src)
  }, [props.src])

  const handleIframeLoad = (event: any) => {
    setHeight(0)
    // console.log('iframe loaded')
    // console.log(event)
    // const iframe = event.target
    // const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document
    //
    // if (iframeDocument) {
    //   setHeight(iframeDocument.body.scrollHeight)
    // }
  }
  return (
    <iframe
      ref={iFrameRef}
      width='100%'
      height='auto'
      src={props.src}
      title='Camera Live Stream'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
      allowFullScreen
      onLoad={handleIframeLoad}
      style={{ height: height, border: 'none' }}
    />
  )
}

export default DynamicIframe
