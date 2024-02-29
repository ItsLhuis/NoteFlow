import * as SystemUI from "expo-system-ui"
SystemUI.setBackgroundColorAsync("transparent")

import React, { useEffect, useRef } from "react"
import { Platform, View } from "react-native"

import * as Notifications from "expo-notifications"

import * as NavigationBar from "expo-navigation-bar"

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from "react-native-reanimated"

import { useUserSettings } from "../../contexts/userSettingsContext"

import { useTheme } from "../../contexts/themeContext"

import { useFolders } from "../../contexts/foldersContext"

import { useNotes } from "../../contexts/notesContext"

import { useNavigation } from "@react-navigation/native"
import { CommonActions } from "@react-navigation/native"

import { getData, storeData } from "config/asyncStorage"

import LottieView from "lottie-react-native"

import * as SplashScreen from "expo-splash-screen"

export default function Splash() {
  const navigation = useNavigation()

  const { updateTheme, getCurrentColors } = useTheme()

  const { updateUserSettings } = useUserSettings()

  const { setFolders, selectFolder } = useFolders()

  const { setNotes } = useNotes()

  const logoAnimation = useSharedValue(0)
  const lottieAnimation = useSharedValue(-300)

  const isMounted = useRef(false)
  const lottieViewRef = useRef(null)

  const navigateToMain = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }]
      })
    )
  }

  const runPrepare = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        setTimeout(async () => {
          const userTheme = await getData("theme")

          if (!userTheme) {
            updateTheme({ system: true })
          }

          const userSettings = await getData("userSettings")

          if (!userSettings) {
            const defaultSettings = {
              fontSize: "average",
              sortOrder: "modificationDate",
              layout: "grid"
            }

            updateUserSettings(defaultSettings)
          } else {
            updateUserSettings(userSettings)
          }

          const allNotes = await getData("allNotes")
          if (allNotes) {
            setNotes(allNotes)
          }

          const allFolders = await getData("allFolders")
          if (!allFolders) {
            const defaultFolders = [
              {
                id: 1,
                title: "Tudo"
              },
              {
                id: 2,
                title: "Sem categoria"
              }
            ]

            await storeData("allFolders", defaultFolders)
            setFolders(defaultFolders)
          } else {
            setFolders(allFolders)
          }

          const folderSelected = await getData("folderSelected")
          if (!folderSelected) {
            selectFolder(1)
          } else {
            selectFolder(folderSelected)
          }

          resolve(true)
        }, 1000)
      } catch (error) {
        reject(false)
      }
    })
  }

  const splash = async () => {
    await SplashScreen.hideAsync()

    setTimeout(() => {
      logoAnimation.value = withSpring(1)
      setTimeout(() => {
        lottieAnimation.value = withTiming(0, { duration: 1000 })
      }, 100)
    }, 100)

    lottieViewRef.current?.play()

    runPrepare().then(() => {
      setTimeout(async () => {
        const response = await Notifications.getLastNotificationResponseAsync()

        if (response) {
          const storedNotes = await getData("allNotes")

          if (!storedNotes) {
            navigateToMain()
          }

          const note = storedNotes.find(
            (note) => note.id === response.notification.request.content.data.noteId
          )

          if (note) {
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
          } else {
            navigateToMain()
          }
        } else {
          navigateToMain()
        }
      }, 400)
    })
  }

  useEffect(() => {
    if (!isMounted.current) {
      splash()
      isMounted.current = true
    }
  }, [])

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoAnimation.value,
      transform: [
        {
          translateY: logoAnimation.value * -60
        }
      ]
    }
  })

  const lottieAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoAnimation.value,
      transform: [
        {
          translateX: lottieAnimation.value
        }
      ]
    }
  })

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setPositionAsync("absolute")
      NavigationBar.setBackgroundColorAsync("#ffffff00")
    }
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: getCurrentColors().colors.primary
      }}
    >
      <Animated.Image
        style={[
          {
            position: "absolute",
            height: 220,
            width: 220
          },
          logoAnimatedStyle
        ]}
        source={require("../../assets/adaptive-icon.png")}
        resizeMode="contain"
      />
      <View style={{ height: 70 }}>
        <Animated.View style={lottieAnimatedStyle}>
          <LottieView
            ref={lottieViewRef}
            loop
            source={require("./lottie.json")}
            style={{ height: 170 }}
          />
        </Animated.View>
      </View>
    </View>
  )
}
