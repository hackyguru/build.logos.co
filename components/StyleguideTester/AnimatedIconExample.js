"use client"

import { useState, useEffect } from "react"
import AnimatedIcon from '@components/AnimatedIcon'

const AnimatedIconExample = () => {
	const [label, setLabel] = useState('menu')
  const [settings, setSettings] = useState({
    weight: 2,
    width: 24,
    spacing: 4
  })

  const iconTypes = [
    'menu',
    'close',
    'plus',
    'minus'
  ]

	useEffect(() => {
    const interval = setInterval(() => {
      setLabel((prev) => {
        const currentIndex = iconTypes.indexOf(prev)
        return iconTypes[(currentIndex + 1) % iconTypes.length]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const updateSettings = event => {
    setSettings({ ...settings, [event.target.name]: event.target.value })
  }

	return (
		<div className='flex flex-col justify-start gap-2 items-stretch'>
			<div className="w-full bg-light-grey rounded h-[100px] flex items-center justify-center">
        <AnimatedIcon
          icon={label}
          weight={settings.weight + 'px'}
          width={settings.width + 'px'}
          spacing={settings.spacing + 'px'}
        />
      </div>
			<p className="body-tiny text-light-text">
				<code>icon={label}</code>
			</p>

      <div className="body-tiny h-[1.5em] overflow-hidden grid grid-cols-3 gap-4 items-center">
        <p className="body-tiny text-light-text">
          <code>weight={settings.weight + 'px'}</code>
        </p>
        <div className="col-span-2">
          <input
            type="range"
            min={1}
            max={10}
            value={settings.weight}
            name='weight'
            onChange={updateSettings}
            className="w-full block"
          />
        </div>
      </div>
      <div className="body-tiny h-[1.5em] overflow-hidden grid grid-cols-3 gap-4 items-center">
        <p className="body-tiny text-light-text">
          <code>width={settings.width + 'px'}</code>
        </p>
        <div className="col-span-2">
          <input
            type="range"
            min={8}
            max={100}
            value={settings.width}
            name='width'
            onChange={updateSettings}
            className="w-full block"
          />
        </div>
      </div>
      <div className="body-tiny h-[1.5em] overflow-hidden grid grid-cols-3 gap-4 items-center">
        <p className="body-tiny text-light-text">
          <code>spacing={settings.spacing + 'px'}</code>
        </p>
        <div className="col-span-2">
          <input
            type="range"
            min={1}
            max={20}
            value={settings.spacing}
            name='spacing'
            onChange={updateSettings}
            className="w-full block"
          />
        </div>
      </div>
		</div>
	)
}

export default AnimatedIconExample