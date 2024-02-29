import React, { createContext, useContext, useState, useEffect } from "react"

import { getData, storeData } from "config/asyncStorage"

const UserSettingsContext = createContext()

export const UserSettingsProvider = ({ children }) => {
  const [userSettings, setUserSettings] = useState({})

  useEffect(() => {
    const fetchUserSettings = async () => {
      const storedUserSettings = (await getData("userSettings")) || {}
      setUserSettings(storedUserSettings)
    }

    fetchUserSettings()
  }, [])

  const updateUserSettings = async (newSettings) => {
    setUserSettings((prevSettings) => ({
      ...prevSettings,
      ...newSettings
    }))

    await storeData("userSettings", {
      ...userSettings,
      ...newSettings
    })
  }

  return (
    <UserSettingsContext.Provider value={{ userSettings, updateUserSettings }}>
      {children}
    </UserSettingsContext.Provider>
  )
}

export const useUserSettings = () => {
  return useContext(UserSettingsContext)
}
