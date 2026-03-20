"use client"

import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [activeModal, setActiveModal] = useState(null)

  const toggleModal = (slug) => {
    setActiveModal(prev => prev === slug ? null : slug)
  }

  return (
    <AppContext.Provider value={{ activeModal, toggleModal }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)

export default AppContext
