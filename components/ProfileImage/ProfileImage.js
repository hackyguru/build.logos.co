import React from 'react'
import cx from 'classnames'
import Image from '@components/Image'

const ProfileImage = ({ person, className }) => {
	return (
		<div className={cx(
			className,
			'rounded-full',
			'aspect-square',
			'w-[2.25em]',
			'flex',
			'items-center',
			'justify-center',
			'align-center',
			'theme-light-grey',
			'relative'
		)}>
			{person.headshot ? (
				<Image
					className="rounded-full overflow-hidden"
					image={person.headshot}
					ratio={1}
					alt={person.name}
					sizes="200px"
				/>
			) : (
				<span className='text-light-text leading-none'>{person.name[0]}</span>
			)}
		</div>
	)
}

export default ProfileImage
