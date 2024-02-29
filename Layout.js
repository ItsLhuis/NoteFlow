import React from "react"

import { useTheme } from "./contexts/themeContext"

import { NavigationContainer } from "@react-navigation/native"

import { MD3DarkTheme, MD3LightTheme } from "react-native-paper"

import AppNavigator from "./navigation"

const Layout = () => {
  const { theme, getCurrentColors } = useTheme()

  const appTheme = {
    ...(theme.mode === "Dark" ? MD3DarkTheme : MD3LightTheme),
    roundness: 1,
    colors: {
      ...getCurrentColors().colors
    }
  }

  return (
    <NavigationContainer theme={appTheme}>
      <AppNavigator appTheme={appTheme} />
    </NavigationContainer>
  )
}

export default Layout
