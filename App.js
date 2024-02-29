import * as SystemUI from "expo-system-ui"
SystemUI.setBackgroundColorAsync("#5461E8")

import React from "react"

import "react-native-gesture-handler"

import { SafeAreaProvider } from "react-native-safe-area-context"

import { UserSettingsProvider } from "./contexts/userSettingsContext"

import { ThemeProvider } from "./contexts/themeContext"

import { FoldersProvider } from "./contexts/foldersContext"
import { NotesProvider } from "./contexts/notesContext"

import Layout from "./Layout"

export default function App() {
  return (
    <ThemeProvider>
      <UserSettingsProvider>
        <FoldersProvider>
          <NotesProvider>
            <SafeAreaProvider>
              <Layout />
            </SafeAreaProvider>
          </NotesProvider>
        </FoldersProvider>
      </UserSettingsProvider>
    </ThemeProvider>
  )
}
