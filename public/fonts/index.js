import localFont from 'next/font/local'

export const mainFont = localFont({
  variable: '--font-main',
  display: 'swap',
  src: [
    {
      path: './rhymes/RhymesDisplay-Regular.woff2',
      weight: 'normal',
      style: 'normal'
    }
  ]
})

export const secondaryFont = localFont({
  variable: '--font-secondary',
  display: 'swap',
  src: [{
    path: './public-sans/PublicSans-Regular.woff2',
    weight: 'normal',
    style: 'normal'
  }]
})

export const monoFont = localFont({
  variable: '--font-mono',
  display: 'swap',
  src: [
    {
      path: './fira/FiraCode-Regular.woff2',
      weight: 'normal',
      style: 'normal'
    },
    {
      path: './fira/FiraCode-SemiBold.woff2',
      weight: '700',
      style: 'normal'
    }
  ]
})