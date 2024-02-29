import React, { useEffect } from "react"
import { View } from "react-native"
import { StatusBar } from "expo-status-bar"

import * as Notifications from "expo-notifications"

import { useTheme } from "../contexts/themeContext"

import { useNotes } from "../contexts/notesContext"

import Toast from "react-native-toast-message"
import { toastConfig } from "config/toastConfig"

import { GestureHandlerRootView } from "react-native-gesture-handler"

import { createStackNavigator } from "@react-navigation/stack"
import { TransitionPresets, CardStyleInterpolators } from "@react-navigation/stack"

import { useNavigation } from "@react-navigation/native"
import { CommonActions } from "@react-navigation/native"

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

import { PaperProvider } from "react-native-paper"

import * as SplashScreen from "expo-splash-screen"
SplashScreen.preventAutoHideAsync()

import { Splash, Main, Settings } from "screens"
import { AllFolders } from "screens/Main/Folders"
import { Note } from "screens/Main/Notes"

const AppNavigator = ({ appTheme }) => {
  const Stack = createStackNavigator()

  const navigation = useNavigation()

  const { getNoteById } = useNotes()

  const { getCurrentColors } = useTheme()

  const lastNotificationResponse = Notifications.useLastNotificationResponse()

  const handleNotification = async () => {
    const response = await Notifications.getLastNotificationResponseAsync()

    if (response) {
      const note = getNoteById(response.notification.request.content.data.noteId)

      if (note) {
        const currentRoute = navigation.getCurrentRoute()
        const isNoteScreenFocused =
          currentRoute.name === "Note" && currentRoute.params?.note?.id === note.id

        if (!isNoteScreenFocused) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "Main"
                },
                {
                  name: "Note",
                  params: {
                    mode: "editNote",
                    note: note
                  }
                }
              ]
            })
          )
        }
      }
    }
  }

  useEffect(() => {
    handleNotification()
  }, [lastNotificationResponse])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={appTheme}>
        <StatusBar translucent style="auto" />
        <BottomSheetModalProvider>
          <View
            style={{
              flex: 1,
              backgroundColor: getCurrentColors().colors.background
            }}
          >
            <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={Splash} />

              <Stack.Screen name="Main" component={Main} />

              <Stack.Screen
                name="Settings"
                component={Settings}
                options={{
                  cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS
                }}
              />

              <Stack.Screen
                name="AllFolders"
                component={AllFolders}
                options={{
                  ...TransitionPresets.SlideFromRightIOS
                }}
              />

              <Stack.Screen
                name="Note"
                component={Note}
                options={{
                  ...TransitionPresets.RevealFromBottomAndroid
                }}
              />
            </Stack.Navigator>
          </View>
        </BottomSheetModalProvider>
        <Toast config={toastConfig} />
      </PaperProvider>
    </GestureHandlerRootView>
  )
}

export default AppNavigator
