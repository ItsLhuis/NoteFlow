import React, { forwardRef, memo } from "react"
import { View, Image } from "react-native"

import ViewShot from "react-native-view-shot"

import { Text } from "react-native-paper"

const ViewShare = forwardRef(({ title, description, isDefaultNoteColor, noteColors }, ref) => {
  return (
    <ViewShot
      ref={ref}
      style={{
        position: "absolute",
        padding: 20,
        backgroundColor: isDefaultNoteColor
          ? noteColors.colors.background
          : noteColors.colors.inversePrimary,
        zIndex: -1
      }}
    >
      <View
        style={{
          borderWidth: 1,
          borderColor: isDefaultNoteColor
            ? noteColors.colors.onBackground
            : noteColors.colors.primary,
          borderRadius: 8,
          padding: 20
        }}
      >
        <Text
          variant="titleLarge"
          style={{
            color: isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary,
            fontWeight: "700",
            marginBottom: 20
          }}
        >
          {title}
        </Text>
        <Text
          variant="titleMedium"
          style={{
            color: isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary
          }}
        >
          {description}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20
        }}
      >
        <Text
          variant="titleSmall"
          style={{
            color: isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary,
            opacity: 0.7
          }}
        >
          Criado por NoteFlow
        </Text>
        <Image
          style={{
            height: 50,
            width: 50
          }}
          source={require("../../assets/icon-transparent.png")}
          resizeMode="contain"
        />
      </View>
    </ViewShot>
  )
})

export default memo(ViewShare)
