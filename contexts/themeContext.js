import React, { createContext, useState, useEffect, useContext, useCallback } from "react"

import { Appearance } from "react-native"

import { storeData, getData } from "config/asyncStorage"

import darkColors from "config/colors/dark.json"
import lightColors from "config/colors/light.json"

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(async () => {
    const storedTheme = await getData("theme")
    return storedTheme || { mode: "Dark", system: false }
  })

  const colorsByTheme = {
    Dark: darkColors,
    Light: lightColors
  }

  const getColorsByTheme = (themeMode) => {
    return colorsByTheme[themeMode]
  }

  const getCurrentColors = () => {
    return getColorsByTheme(theme.mode)
  }

  const updateTheme = useCallback(
    (newTheme) => {
      let mode
      if (!newTheme) {
        mode = theme.mode === "Dark" ? "Light" : "Dark"
        newTheme = { mode, system: false }
      } else {
        if (newTheme.system) {
          mode = newTheme.mode || (Appearance.getColorScheme() === "dark" ? "Dark" : "Light")
          newTheme = { ...newTheme, mode }
        } else {
          newTheme = { ...newTheme, system: false }
        }
      }

      setTheme(newTheme)
      storeData("theme", newTheme)
    },
    [theme.mode]
  )

  const fetchStoredTheme = async () => {
    try {
      const themeData = await getData("theme")
      if (themeData) {
        if (themeData.system) {
          const mode = Appearance.getColorScheme() === "dark" ? "Dark" : "Light"
          updateTheme({ mode, system: true })
        } else {
          updateTheme(themeData)
        }
      } else {
        const mode = Appearance.getColorScheme() === "dark" ? "Dark" : "Light"
        updateTheme({ mode, system: true })
      }
    } catch ({ message }) {
      console.log(message)
    }
  }

  useEffect(() => {
    fetchStoredTheme()
  }, [])

  useEffect(() => {
    const colorSchemeListener = Appearance.addChangeListener(({ colorScheme }) => {
      if (theme.system) {
        const mode = colorScheme === "dark" ? "Dark" : "Light"
        updateTheme({ mode, system: true })
      }
    })

    return () => {
      colorSchemeListener.remove()
    }
  }, [theme.system])

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, getCurrentColors }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  return useContext(ThemeContext)
}
