import React, { memo } from "react"
import { Keyboard, StyleSheet, View, TouchableWithoutFeedback } from "react-native"

import { useTheme } from "../../contexts/themeContext"

import LottieView from "lottie-react-native"

import { Text } from "react-native-paper"

const ErrorNotFound = ({ description }) => {
  const { getCurrentColors } = useTheme()

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss}>
      <View style={{ ...StyleSheet.absoluteFill, justifyContent: "center", alignItems: "center" }}>
        <View style={{ alignItems: "center" }}>
          <LottieView source={require("./lottie.json")} autoPlay loop style={{ height: 240 }} />
          <Text
            variant="titleSmall"
            style={{ color: getCurrentColors().colors.outline, textAlign: "center" }}
          >
            {description}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default memo(ErrorNotFound)
