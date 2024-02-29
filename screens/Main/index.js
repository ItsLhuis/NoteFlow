import React, { useEffect, useState, useRef } from "react"
import {
  Animated as RNAnimated,
  BackHandler,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native"

import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated"

import { useNavigation } from "@react-navigation/native"
import { CommonActions } from "@react-navigation/native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../contexts/themeContext"

import { useNotes } from "../../contexts/notesContext"

import { Appbar, FAB, Text } from "react-native-paper"

import PressableScale from "components/PressableScale"
import SearchInput from "components/SearchInput"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

const width = wp("100%")
const height = hp("100%")

import { AllNotes } from "./Notes"

import { rgbStringToObject } from "../../functions/rgbStringToObject"

const AppBar = ({ navigation, appBarOpacity }) => {
  return (
    <RNAnimated.View
      style={{
        opacity: appBarOpacity
      }}
    >
      <Appbar.Header mode="small">
        <Appbar.Content title="Notas" titleStyle={{ fontWeight: "700", marginLeft: 5 }} />
        <Appbar.Action icon="cog-outline" onPress={() => navigation.navigate("Settings")} />
      </Appbar.Header>
    </RNAnimated.View>
  )
}

const Main = () => {
  const navigation = useNavigation()

  const { getCurrentColors } = useTheme()

  const searchRef = useRef(null)

  const notesRef = useRef(null)

  const [startSearch, setStartSearch] = useState(true)
  const appBarOpacity = useRef(new RNAnimated.Value(1)).current

  const [appOverlay, setAppOverlay] = useState(false)

  const [deselectItems, setDeselectItems] = useState(false)
  const [hideFabButton, setHideFabButton] = useState(false)

  const marginTopAnimation = useSharedValue(0)
  const searchNoteInputAppBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginTop: withTiming(marginTopAnimation.value)
    }
  })

  const marginRightAnimation = useSharedValue(0)
  const searchNoteInputAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginRight: withTiming(marginRightAnimation.value)
    }
  })

  const searchTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }
    }
  }, [])

  const handleShowSearchAnimation = () => {
    if (!startSearch) {
      return
    }

    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current)
    }

    setDeselectItems(true)

    setSearchText("")

    setHideFabButton(true)
    setStartSearch(false)

    setTimeout(() => {
      setAppOverlay(true)
    }, 100)

    marginRightAnimation.value = 90
    marginTopAnimation.value = -50

    notesRef?.current?.scrollToOffset({ animated: true, offset: 0 })

    searchTimerRef.current = setTimeout(() => {
      searchRef?.current.focus()
    }, 400)

    RNAnimated.timing(appBarOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false
    }).start()
  }

  const handleHideSearchAnimation = () => {
    setSearchText("")

    searchRef?.current.blur()
    clearTimeout(searchTimerRef.current)

    setDeselectItems(false)

    setStartSearch(true)

    setAppOverlay(false)

    marginRightAnimation.value = 0
    marginTopAnimation.value = 0

    RNAnimated.timing(appBarOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false
    }).start(() => {
      setHideFabButton(false)
      setSearchText("")
    })
  }

  const { searchText, setSearchText } = useNotes()

  const handleSearchTextChange = (text) => {
    setSearchText(text)
  }

  useEffect(() => {
    if (startSearch) {
      return
    }

    if (searchText && searchText.trim() !== "") {
      setAppOverlay(false)
    } else {
      setAppOverlay(true)
    }
  }, [searchText, startSearch])

  const handleHardwareBackPress = () => {
    if (!startSearch && navigation.isFocused()) {
      handleHideSearchAnimation()
      return true
    }
    return false
  }

  useEffect(() => {
    const backHandlerSubscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleHardwareBackPress
    )

    return () => {
      backHandlerSubscription.remove()
    }
  }, [startSearch, navigation])

  const handleAddButtonPress = () => {
    const currentDate = new Date().toISOString()
    navigation.dispatch(
      CommonActions.navigate({
        name: "Note",
        params: {
          mode: "addNote",
          currentDate: currentDate
        }
      })
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View style={searchNoteInputAppBarAnimatedStyle}>
          <AppBar navigation={navigation} appBarOpacity={appBarOpacity} />
        </Animated.View>
        <View
          style={{
            marginBottom: 20,
            zIndex: 60
          }}
        >
          <Animated.View style={searchNoteInputAnimatedStyle}>
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                left: 20,
                zIndex: startSearch ? 100 : -1,
                width: width - 40,
                height: 50,
                borderRadius: 9999
              }}
              onPress={handleShowSearchAnimation}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                zIndex: 60
              }}
            >
              <SearchInput
                ref={searchRef}
                searchText={searchText}
                setSearchText={handleSearchTextChange}
              />
              <TouchableOpacity onPress={handleHideSearchAnimation}>
                <Text
                  variant="labelLarge"
                  style={{ color: getCurrentColors().colors.primary, fontWeight: "700" }}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
          {appOverlay && (
            <TouchableWithoutFeedback onPress={handleHideSearchAnimation}>
              <Animated.View
                entering={FadeIn}
                exiting={FadeOut}
                style={{
                  position: "absolute",
                  top: 60,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: `rgba(${rgbStringToObject(
                    getCurrentColors().colors.background
                  )}, 0.8)`,
                  height,
                  width,
                  zIndex: 5
                }}
              />
            </TouchableWithoutFeedback>
          )}
        </View>
        <AllNotes
          notesRef={notesRef}
          deselectItems={deselectItems}
          startSearch={startSearch}
          appOverlay={appOverlay}
          setHideFabButton={setHideFabButton}
        />
        {!hideFabButton && (
          <Animated.View
            style={{ position: "absolute", bottom: useSafeAreaInsets().bottom, right: 40 }}
            entering={ZoomIn}
            exiting={ZoomOut}
          >
            <PressableScale onPress={handleAddButtonPress}>
              <FAB
                icon="plus"
                color="white"
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 60,
                  height: 60,
                  marginVertical: 40,
                  borderRadius: 9999,
                  backgroundColor: getCurrentColors().colors.primary
                }}
              />
            </PressableScale>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </View>
  )
}

export default Main
