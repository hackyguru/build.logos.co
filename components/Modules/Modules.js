import React from 'react'
import ModuleRenderer from '@components/ModuleRenderer'

const Modules = ({
  modules = false,
  moduleRefs = false,
  prevSection = false, // Manually Set Previous Section
  nextSection = false, // Manually Set Next Section,
  settings = {},
  searchParams = {}
}) => {

	if ((!modules || modules.length < 1) && !moduleRefs) {
		return false
	}

  // Merge reusable modules into module array by matching _ref to _id
  if (moduleRefs && Array.isArray(moduleRefs)) {
    let merged = []
    modules.forEach((module) => {
      if (module?._type === 'reference') {
        const ref = moduleRefs.find(r => r?._id === module?._ref)
        if (ref?.content) {
          merged.push(...ref.content)
        }
      } else {
        merged.push(module)
      }
    })
    modules = merged
  }

	// Remove Hidden Modules
	modules = modules?.filter(module => module.hidden !== true)
	
	return (
		<>
			{modules.map((item, index) => {
				let prevModule = prevSection || false
        let nextModule = nextSection || false
        
        if (index > 0) {
          prevModule = modules[index - 1]
        }
        if (index + 1 !== modules.length && !nextSection) {
          nextModule = modules[index + 1]
        }
        if (index === 0 && prevSection) {
          prevModule = prevSection
        }

				return (
					<ModuleRenderer
            key={(item?._key || item?._id) + '_' + index}
            item={item}
            prevModule={prevModule}
            nextModule={nextModule}
            isFirstSection={index === 0 && !prevModule}
						isLastSection={index + 1 === modules.length && !nextModule}
            settings={settings} // Page Settings
            searchParams={searchParams}
          />
				)
			})}
		</>
	)
}

export default Modules
