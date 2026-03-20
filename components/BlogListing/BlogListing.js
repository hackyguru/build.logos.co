"use client"

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PostList from '@components/PostList'
import { getRoute } from '@utils/helpers'

const BlogListing = ({
  posts: initialPosts,
  postCount,
  currentPage = 1,
  limit = 12,
  paginationMode = 'load-more', // 'load-more' or 'url'
  basePath,
  listingType = 'most-recent',
  category,
  author,
  allowFeatured = false,
  fetchMorePosts,
  ...props
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [posts, setPosts] = useState(initialPosts || [])
  const [page, setPage] = useState(currentPage)

  const hasMorePosts = posts.length < postCount

  const handleLoadMore = async () => {
    if (!hasMorePosts || !fetchMorePosts) return

    const nextPage = page + 1
    const offset = posts.length

    startTransition(async () => {
      const newPosts = await fetchMorePosts({ offset, limit })

      if (newPosts?.length) {
        setPosts(prev => [...prev, ...newPosts])
        setPage(nextPage)

        // Update URL without navigation (shareable)
        const newUrl = nextPage > 1
          ? `${basePath}?page=${nextPage}`
          : basePath
        window.history.pushState({}, '', newUrl)
      }
    })
  }

  const handleUrlPagination = (newPage) => {
    const url = newPage > 1
      ? `${basePath}?page=${newPage}`
      : basePath
    router.push(url)
  }

  return (
    <PostList
      layout="grid"
      listingType={listingType}
      category={category}
      posts={posts}
      postCount={postCount}
      currentPage={page}
      paginate={true}
      hasMorePosts={hasMorePosts && !isPending}
      onLoadMore={paginationMode === 'load-more' ? handleLoadMore : undefined}
      viewMoreLink={false}
      allowFeatured={allowFeatured}
      {...props}
    />
  )
}

export default BlogListing
