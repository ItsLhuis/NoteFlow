import React, { useState, useEffect, memo } from "react"
import { BackHandler, View, TouchableWithoutFeedback } from "react-native"

import Animated, {
  Easing,
  useSharedValue,
  withSpring,
  withTiming,
  useAnimatedStyle,
  runOnJS
} from "react-native-reanimated"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../contexts/themeContext"

import { Portal, TouchableRipple, Text } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen"

const width = wp("100%")
const height = hp("100%")

import { rgbStringToObject } from "../../functions/rgbStringToObject"

const PopUpMenu = ({ visible, data, layout, onClose, menuWidth }) => {
  const insets = useSafeAreaInsets()

  const { theme, getCurrentColors } = useTheme()

  const fadeAnimation = useSharedValue(0)
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnimation.value
    }
  })

  const [popUpVisible, setPopUpVisible] = useState(false)

  useEffect(() => {
    if (visible) {
      setPopUpVisible(true)
      fadeAnimation.value = withSpring(1)
    } else {
      fadeAnimation.value = withTiming(
        0,
        { duration: 300, easing: Easing.inOut(Easing.ease) },
        () => {
          runOnJS(setPopUpVisible)(false)
        }
      )
    }
  }, [visible])

  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        onClose()
        return true
      }
    }

    const backHandlerListener = BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    return () => {
      backHandlerListener.remove()
    }
  }, [onClose])

  if (popUpVisible) {
    const handlePress = (menuItem) => {
      menuItem.onPress()
      onClose()
    }

    const totalMenuHeight = data.length * 70
    const shouldDisplayAbove = layout.y + layout.height + 20 + totalMenuHeight > height
    const topValue = shouldDisplayAbove ? layout.y - 20 - 100 : layout.y + layout.height - 10
    const leftValue = layout.x + (layout.width - menuWidth)
    const rightValue = 20

    return (
      <Portal>
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              animatedContainerStyle,
              {
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor:
                  theme.mode === "Dark" ? "rgba(20, 20, 20, 0.8)" : "rgba(70, 70, 70, 0.8)",
                height: height + insets.bottom + insets.top,
                width,
                zIndex: 5
              }
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            animatedContainerStyle,
            {
              position: "absolute",
              top: topValue,
              left: leftValue,
              right: rightValue,
              backgroundColor: getCurrentColors().colors.elevation.level2,
              borderRadius: 20,
              overflow: "hidden",
              zIndex: 10
            }
          ]}
        >
          {data.map((menuItem, index) => (
            <TouchableRipple key={index} onPress={() => handlePress(menuItem)}>
              <View
                style={{
                  padding: 20,
                  paddingVertical: 15,
                  paddingTop: index === 0 ? 20 : 15,
                  paddingBottom: index === data.length - 1 ? 20 : 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: menuItem.selected
                    ? `rgba(${rgbStringToObject(getCurrentColors().colors.primary)}, 0.2)`
                    : "transparent"
                }}
              >
                <Text
                  variant="titleMedium"
                  numberOfLines={2}
                  style={{
                    width: "80%",
                    color: menuItem.selected
                      ? getCurrentColors().colors.primary
                      : getCurrentColors().colors.onBackground
                  }}
                >
                  {menuItem.title}
                </Text>
                {menuItem.selected && (
                  <Icon name="check" size={20} color={getCurrentColors().colors.primary} />
                )}
              </View>
            </TouchableRipple>
          ))}
        </Animated.View>
      </Portal>
    )
  }

  return null
}

export default memo(PopUpMenu)
