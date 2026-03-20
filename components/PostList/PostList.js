"use client"

import React, { useRef } from 'react'
import Section from '@components/Section'
import Container from '@components/Container'
import PostCard from '@components/PostCard'
import ScrollEntrance from '@components/ScrollEntrance'
import Button from '@components/Button'
import cx from 'classnames'
import Slideshow from '@components/Slideshow'
import SlideshowArrows from '@components/Slideshow/SlideshowArrows'
import Link from '@components/Link'
import { getRoute } from '@utils/helpers'

const PostList = ({
  layout = 'grid',
  className = '',
  theme = 'default',
  prevTheme,
  nextTheme,
  isFirstSection,
  isLastSection,
  id,
  category,
  headline,
  listingType = 'most-recent',
  viewMoreLink = true,
  allowFeatured = false,
  posts,
  postLimit,
  // Pagination props (only used on blog listing pages)
  paginate = false,
  postCount = 0,
  currentPage = 1,
  onLoadMore,
  hasMorePosts = false,
  ...props
}) => {

  if (!posts || posts.length < 1) {
    return null
  }

  // Build "More Articles" link based on listing type
  const categorySlug = category?.slug || (Array.isArray(category) ? category[0] : null)
  let byCatMoreLink = '/' + getRoute.post
  if (categorySlug) {
    byCatMoreLink = '/' + getRoute.category + '/' + categorySlug
  }

  const morePostsLink = {
    'currated': '/' + getRoute.post,
    'by-cat': byCatMoreLink,
    'most-recent': '/' + getRoute.post
  }

  return layout === 'carousel' ? (
    <CarouselLayout
      className={className}
      theme={theme}
      prevTheme={prevTheme}
      nextTheme={nextTheme}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      id={id}
      headline={headline}
      listingType={listingType}
      viewMoreLink={viewMoreLink}
      posts={posts}
      postLimit={postLimit}
      morePostsLink={morePostsLink}
      {...props}
    />
  ) : (
    <GridLayout
      className={className}
      theme={theme}
      prevTheme={prevTheme}
      nextTheme={nextTheme}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      id={id}
      category={category}
      headline={headline}
      listingType={listingType}
      viewMoreLink={viewMoreLink}
      allowFeatured={allowFeatured}
      posts={posts}
      postLimit={postLimit}
      paginate={paginate}
      postCount={postCount}
      currentPage={currentPage}
      onLoadMore={onLoadMore}
      hasMorePosts={hasMorePosts}
      morePostsLink={morePostsLink}
      {...props}
    />
  )
}

function GridLayout({
  className = '',
  theme = 'default',
  prevTheme,
  nextTheme,
  isFirstSection,
  isLastSection,
  id,
  headline,
  listingType = 'most-recent',
  viewMoreLink = true,
  allowFeatured = false,
  posts,
  paginate = false,
  postCount = 0,
  onLoadMore,
  hasMorePosts = false,
  morePostsLink,
  ...props
}) {
  return (
    <Section
      className={cx('section-post-list', className)}
      setTheme={theme}
      prevTheme={prevTheme}
      nextTheme={nextTheme}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      id={id}
      {...props}
    >
      <ScrollEntrance>
        {headline && (
          <Container>
            <div className="mx-auto max-w-site-max-w mb-v-space-sm flex justify-between">
              <h3 className='m-0'>{headline}</h3>
            </div>
          </Container>
        )}

        <Container className="overflow-hidden">
          <div className="mx-auto max-w-site-max-w">
            <div className='-mx-half-gutter flex flex-wrap gap-y-v-space-sm'>
              {posts?.map((post, index) => {
                if (!post || !post._id) {
                  return null
                }

                const flexGridClass = 'px-half-gutter'
                let colClass = 'md:w-1/2 lg:w-1/3 lg:max-w-1/2 grow-[1]'
                if (post.featured && allowFeatured) {
                  colClass = 'md:w-1/2 lg:w-1/2 lg:max-w-[66.666%] grow-[1000]'
                }

                return (
                  <div className={cx(colClass, flexGridClass, "h-full")} key={post._id}>
                    <PostCard post={post} priority={isFirstSection && index < 3} />
                  </div>
                )
              })}
            </div>

            {/* View More link (for module sections, not paginated) */}
            {(viewMoreLink && !paginate) && (
              <div className="mt-v-space-sm">
                <Button
                  to={morePostsLink[listingType]}
                  title='View More Articles'
                >More Articles</Button>
              </div>
            )}

            {/* Load More button (for paginated blog pages) */}
            {(paginate && hasMorePosts && onLoadMore) && (
              <div className="mt-v-space-sm">
                <Button
                  onClick={onLoadMore}
                  title='Load More Articles'
                >Load More</Button>
              </div>
            )}
          </div>
        </Container>
      </ScrollEntrance>
    </Section>
  )
}

function CarouselLayout({
  className = '',
  theme = 'default',
  prevTheme,
  nextTheme,
  isFirstSection,
  isLastSection,
  id,
  headline,
  listingType = 'most-recent',
  viewMoreLink = true,
  posts,
  postLimit = 10,
  morePostsLink = {},
  ...props
}) {
  const slideshowRef = useRef(null)

  return (
    <Section
      className='overflow-hidden'
      setTheme={theme}
      prevTheme={prevTheme}
      nextTheme={nextTheme}
      isFirstSection={isFirstSection}
      isLastSection={isLastSection}
      id={id}
      {...props}
    >
      <ScrollEntrance>
        {headline && (
          <Container className="mb-v-space-sm flex justify-between">
            <h3 className='m-0'>{headline}</h3>
            <SlideshowArrows
              slideshow={slideshowRef}
              slides={posts}
              className='!hidden md:!flex'
            />
          </Container>
        )}

        <Container>
          <Slideshow
            className='overflow-visible'
            arrows={!headline}
            pager={false}
            arrowsPosition='bottom'
            arrowsClassname='px-0 !relative !justify-center !pb-0 !pt-v-space-sm'
            slidesXs={1.2}
            slidesSm={1.5}
            slidesMd={posts?.length + 1 > 2 ? 2.2 : posts?.length + 1}
            slidesLg={posts?.length + 1 > 2 ? 2.5 : posts?.length + 1}
            slidesXl={posts?.length + 1 > 3 ? 3 : posts?.length + 1}
            slides2xl={posts?.length + 1 > 4 ? 4 : posts?.length + 1}
            ref={slideshowRef}
            style={{
              '--progress': 0
            }}
          >
            {posts?.map((post, index) => {
              if (!post || !post._id || index + 1 > postLimit) {
                return null
              }
              return (
                <div className="h-full" key={post._id}>
                  <PostCard post={post} priority={isFirstSection && index < 3} />
                </div>
              )
            })}
            {viewMoreLink && (
              <div className="h-full">
                <Link
                  className='rounded w-full aspect-3/2 flex h4 bg-light-grey items-center justify-center hover:bg-main hover:text-bg transition-colors'
                  to={morePostsLink[listingType]}
                  title='View More Articles'
                >More Articles</Link>
              </div>
            )}
          </Slideshow>

          {headline && (
            <SlideshowArrows
              slideshow={slideshowRef}
              slides={posts}
              className='md:!hidden pt-v-space-sm'
            />
          )}
        </Container>
      </ScrollEntrance>
    </Section>
  )
}

export default PostList
