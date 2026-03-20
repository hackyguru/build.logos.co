import React from 'react'
import { slugify } from '@utils/helpers'
// plopImportModules
import ResourceList from '@components/ResourceList'
import BannerStrip from '@components/BannerStrip'
import AccordionSection from '@components/AccordionSection'
import MediaWithText from '@components/MediaWithText'
import ContactFormSection from '@components/ContactFormSection'
import TwoColumnText from '@components/TwoColumnText'
import Columns from '@components/Columns'
import PostList from '@components/PostList'
import TextSection from '@components/TextSection'
import WideMedia from '@components/WideMedia'

const moduleMap = {
  // plopAddModules
	resourceList: ResourceList,
	bannerStrip: BannerStrip,
	accordionSection: AccordionSection,
	mediaWithText: MediaWithText,
	contactFormSection: ContactFormSection,
	twoColumnText: TwoColumnText,
	columns: Columns,
	postList: PostList,
	textSection: TextSection,
	wideMedia: WideMedia,
}

const ModuleRenderer = ({
  item,
  prevModule,
  nextModule,
  index,
  isLastSection,
  isFirstSection,
  id,
  settings,
  searchParams
}) => {

  if (!item || !item?._type) {
    return false
  }

  const Module = moduleMap[item._type]

  if (!Module) {
    return false
  }

  return Module ? (
    <Module
      {...item}
      prevTheme={prevModule?.theme}
      nextTheme={nextModule?.theme}
      id={id || slugify(item.internalName)}
      isLastSection={isLastSection}
      isFirstSection={isFirstSection}
      index={index}
      settings={settings} // Passed down from document settings (ie: page.settings)
      searchParams={searchParams}
    />
  ) : null
}

export default ModuleRenderer
