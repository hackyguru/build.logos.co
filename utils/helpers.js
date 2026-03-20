export const isBrowser = typeof window !== 'undefined'

export const isMobileSafari = () => {
  if (!isBrowser) return false
  const ua = window.navigator.userAgent
  return /iP(ad|hone|od).+Version\/[\d.]+.*Safari/i.test(ua)
}

export const getLinkProps = (link) => {
  if (!link) return {}
  const url = link?.url || link?.link?.url || link?.externalUrl
  const page = link?.page || link?.link?.page
  const slug = page?.slug?.current || page?.slug
  const to = url || (slug ? `/${slug}` : '')
  const target = link?.newTab || link?.target === '_blank' ? '_blank' : undefined
  return {
    to,
    href: to,
    target,
    title: link?.title || link?.link?.title || link?.pageTitle || ''
  }
}

export const getRoute = {
  page: (slug) => `/${slug}`,
  post: (slug) => `/blog/${slug}`,
}

export const getDocumentLink = (doc) => {
  if (!doc) return '/'
  const slug = doc?.slug?.current || doc?.slug
  if (doc._type === 'post') return getRoute.post(slug)
  return getRoute.page(slug)
}

export const buildSizesString = (sizes) => {
  if (!sizes) return '100vw'
  if (typeof sizes === 'string') return sizes
  return sizes.map(s => `(max-width: ${s.breakpoint}px) ${s.size}`).join(', ')
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const slugify = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export const isEcommerceSite = false
