import React from "react"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Text, Surface } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

export const toastConfig = {
  customToast: ({ props }) => (
    <Surface
      style={{
        flexDirection: "row",
        padding: 20,
        paddingVertical: 15,
        gap: 10,
        borderRadius: 10,
        backgroundColor: props.getCurrentColors.colors.primary,
        marginTop: useSafeAreaInsets().top - 20,
        marginHorizontal: 10
      }}
    >
      {props.icon && <Icon name={props.icon} color="white" size={props.iconSize} />}
      <Text
        style={{
          color: props.getCurrentColors.colors.primaryContainer,
          fontWeight: "700",
          textAlign: "center"
        }}
        variant="titleSmall"
      >
        {props.title}
      </Text>
    </Surface>
  )
}
