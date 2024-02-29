import React, { memo, useCallback } from "react"
import { Pressable } from "react-native"

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing
} from "react-native-reanimated"

import { TouchableRipple } from "react-native-paper"

const PressableScale = ({ children, effect = false, onPress, onLongPress, ...rest }) => {
  const scaleValue = useSharedValue(1)

  const handlePressIn = useCallback(() => {
    scaleValue.value = withTiming(0.95, { duration: 80, easing: Easing.ease })
  }, [scaleValue])

  const handlePressOut = useCallback(() => {
    scaleValue.value = withTiming(1, { duration: 80, easing: Easing.ease })
  }, [scaleValue])

  const memoizedOnPressIn = useCallback(() => {
    handlePressIn()
  }, [handlePressIn])

  const memoizedOnPressOut = useCallback(() => {
    handlePressOut()
  }, [handlePressOut])

  const memoizedOnPress = useCallback(() => {
    onPress()
  }, [onPress])

  const memoizedOnLongPress = useCallback(() => {
    if (onLongPress) {
      onLongPress()
    }
  }, [onLongPress])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }]
    }
  }, [scaleValue])

  return (
    <Animated.View style={[animatedStyle, { ...rest.style }]}>
      {effect ? (
        <TouchableRipple
          onPressIn={memoizedOnPressIn}
          onPressOut={memoizedOnPressOut}
          onPress={memoizedOnPress}
          onLongPress={memoizedOnLongPress}
        >
          {children}
        </TouchableRipple>
      ) : (
        <Pressable
          onPressIn={memoizedOnPressIn}
          onPressOut={memoizedOnPressOut}
          onPress={memoizedOnPress}
          onLongPress={memoizedOnLongPress}
        >
          {children}
        </Pressable>
      )}
    </Animated.View>
  )
}

export default memo(PressableScale)
