import React from 'react'
import { getShareData } from '@/utils/helpers'

const getPersonSchema = (person, site) => {
	const personShareData = getShareData(person, site)
	const pageLink = personShareData.openGraph.url

	// Build sameAs array from social media links
	const sameAs = site?.social?.map(link => link.url).filter(Boolean) || []

	if (!person) {
		return false
	}
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": person.name,
    "url": pageLink,
    "sameAs": sameAs,
  }
}

const SchemaOrg = ({ site, page, isHome }) => {
	const shareData = getShareData(page, site, isHome)
	const pageLink = shareData?.openGraph?.url
	let structuredData = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: shareData?.openGraph?.siteName,
		url: pageLink
	}

	if (!isHome) {
		structuredData = {
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: page?.title,
			url: pageLink,
			description: shareData?.description,
		}
	}

	if (page?._type === 'post') {
		structuredData = {
			"@context": "https://schema.org",
			"@type": "BlogPosting",
			"headline": page?.title,
			"url": pageLink,
			description: shareData?.description,
			"image": shareData?.openGraph?.images[0],
			// "datePublished": datePublished,
			// "dateModified": dateModified,
		}

		if (page?.author) {
			structuredData.author = getPersonSchema(page.author)
		}
	}

	return (
		<>
			<script
				type="application/ld+json"
				suppressHydrationWarning
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
		</>
	)
}

export default SchemaOrg
