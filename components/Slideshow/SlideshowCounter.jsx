import React from 'react'

export const SlideshowCounter = ({ className, current, total }) => {
  const wrapperClassname = 'overflow-hidden items-baseline flex !leading-none'

	return (
	  <div className={wrapperClassname + ' ' + className}>
	  	<div
        className='flex flex-col items-center h-[1em] overflow-visible'
        style={{
          '--offset': current
        }}
      >
				{Array(total).fill().map((item, i) => {
					return (
            <div
              key={"counter-item-" + i}
              className={`transition-transform translate-y-[calc(-1em*var(--offset))] ${current === i ? 'current-item' : 'item'}`}
            >
              <span className={`flex justify-center duration-slow transition-all ${current === i ? 'max-w-[2em]' : 'max-w-0 overflow-visible opacity-0 scale-y-50'}`}>{i + 1}</span>
            </div>
          )
				})}
			</div>
			&nbsp;/ {total}
	  </div>
	)
}

export default SlideshowCounter
