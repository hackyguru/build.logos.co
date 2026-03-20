import React from 'react'
import Link from '@components/Link'
import Image from '@components/Image'
import ProfileImage from '@components/ProfileImage'
import cx from 'classnames'
import { getDocumentLink } from '@utils/helpers'
import { MdArrowForward } from 'react-icons/md'

const PostCard = ({ post, className, priority }) => {
	if (!post) {
		return false
	}
	
	const excerpt = post?.excerpt || post?.bodyExcerpt
	const isExternal = post?.postType === 'external'

	return (
		<div className={cx(
			'relative',
			'flex',
			'flex-col',
			'gap-2',
			'group/card',
			className,
			{
				'p-gutter theme-light-grey hover:!bg-hr md:aspect-3/2 transition rounded': !post.featuredImage
			}
		)}>
			{post.featuredImage && (
				<div className='relative mb-1 rounded overflow-hidden'>
					<Image
						image={post.featuredImage}
						alt={post.title}
						colorFill
						priority={priority}
						sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
						ratio={1.5}
					/>
					<div className="transition group-hover/card:opacity-20 opacity-0 bg-black absolute top-0 left-0 w-full h-full"></div>
				</div>
			)}
			{post?.categories && (
				<div className="flex gap-2">
					{post.categories.map((category, index) => {
						return (
							<div key={category._id} className='relative z-2'>
								<Link {...getDocumentLink(category)} className="inline">
									<span className="animate-underline">{category?.title}</span>
									{post.categories.length !== index + 1 && ', '}
								</Link>
							</div>
						)
					})}
				</div>
			)}
			
			<h3 className={cx('text-balance', {
				'h3': post.featuredImage,
				'h2 pb-[2em] grow': !post.featuredImage
			})}>
				<div>{post.title}</div>
			</h3>

			{post?.author && (
				<div>
					<Link {...getDocumentLink(post.author)} className="group relative z-2 body-small inline-flex align-top items-center gap-[.75em]">
						<ProfileImage person={post.author} />
						<div>
							<span className="animate-underline">{post?.author?.name}</span>
						</div>
					</Link>
				</div>
			)}

			{excerpt && (
				<div className="body">{excerpt}</div>
			)}

			<div className='relative z-2 pt-2'>
				<Link
					{...getDocumentLink(post)}
					className="body font-bold"
				>
					{isExternal ? (
						<div className='flex gap-1 justify-start align-center'>
							<span className='animate-underline underlined leading-none'>
								Go to article
							</span>
							<MdArrowForward className='-mt-[.03em] -rotate-45'/>
						</div>
					) : (
						<span className='animate-underline underlined'>
							Read more
						</span>
					)}
				</Link>
			</div>

			<Link
				{...getDocumentLink(post)}
				target={isExternal ? '_blank' : ''}
				className="absolute top-0 left-0 w-full h-full block z-1"
			/>
		</div>
	)
}

export default PostCard
