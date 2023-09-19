import { useRef, useState, useEffect } from 'react'
/*
 * from https://codesandbox.io/s/react-segmented-control-krgq5?file=/src/SegmentedControl.jsx:0-1727
 */

interface SegmentedControlProps {
  name: string
  callback: (val: string) => void
  segments: any
  defaultIndex?: number
  controlRef: React.MutableRefObject<any>
}
const SegmentedControl: React.FC<SegmentedControlProps> = ({
  name,
  segments,
  callback,
  defaultIndex = 0,
  controlRef,
}: SegmentedControlProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex)
  const componentReady = useRef<boolean>()

  // Determine when the component is "ready"
  useEffect(() => {
    componentReady.current = true
  }, [])

  useEffect(() => {
    const activeSegmentRef = segments[activeIndex].ref
    const { offsetWidth, offsetLeft } = activeSegmentRef.current
    const { style } = controlRef.current

    style.setProperty('--highlight-width', `${offsetWidth}px`)
    style.setProperty('--highlight-x-pos', `${offsetLeft}px`)
  }, [activeIndex, callback, controlRef, segments])

  const onInputChange = (value: string, index: number) => {
    setActiveIndex(index)
    callback(value)
  }

  return (
    <div className='controls-container' ref={controlRef}>
      <div className={`controls ${componentReady.current ? 'ready' : 'idle'}`}>
        {segments?.map(
          (
            item: { value: string; ref: React.LegacyRef<HTMLDivElement>; label: string },
            i: number,
          ) => (
            <div
              key={item.value}
              className={`segment ${i === activeIndex ? 'active' : 'inactive'}`}
              ref={item.ref}
            >
              <input
                type='radio'
                value={item.value}
                id={item.label}
                name={name}
                onChange={() => onInputChange(item.value, i)}
                checked={i === activeIndex}
              />
              <label htmlFor={item.label}>{item.label}</label>
            </div>
          ),
        )}
      </div>
    </div>
  )
}

export default SegmentedControl
