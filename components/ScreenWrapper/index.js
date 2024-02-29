import React from "react"
import { ScrollView, StyleSheet, View } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../contexts/themeContext"

export default function ScreenWrapper({
  children,
  withScrollView = true,
  style,
  contentContainerStyle,
  ...rest
}) {
  const { getCurrentColors } = useTheme()

  const insets = useSafeAreaInsets()

  const containerStyle = [
    styles.container,
    {
      backgroundColor: getCurrentColors().colors.background,
      paddingBottom: insets.bottom,
      paddingLeft: insets.left,
      paddingRight: insets.left
    }
  ]

  return (
    <>
      {withScrollView ? (
        <ScrollView
          {...rest}
          contentContainerStyle={contentContainerStyle}
          keyboardShouldPersistTaps="always"
          alwaysBounceVertical={false}
          showsVerticalScrollIndicator={false}
          style={[containerStyle, style]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[containerStyle, style]}>{children}</View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
