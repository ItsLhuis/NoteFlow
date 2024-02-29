import React, { memo } from "react"
import { View } from "react-native"

import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated"

import { useTheme } from "../../contexts/themeContext"

import { useFolders } from "../../contexts/foldersContext"

import { Text } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import PressableScale from "components/PressableScale"

const FolderTag = ({ total, item, index, folderId, title, icon, iconColor, onPress }) => {
  const { getCurrentColors } = useTheme()

  const { selectedFolder } = useFolders()

  return (
    <PressableScale
      effect
      style={{
        overflow: "hidden",
        borderRadius: 10,
        marginHorizontal: 5,
        backgroundColor:
          selectedFolder === folderId
            ? getCurrentColors().colors.primary
            : getCurrentColors().colors.elevation.level5,
        marginRight: index === total - 1 ? 0 : undefined,
        ...(index === 0 && { marginLeft: 0 })
      }}
      onPress={() => {
        if (selectedFolder === (!icon ? item.id : false)) {
          return
        }

        onPress()
      }}
    >
      <Animated.View layout={Layout} entering={FadeIn} exiting={FadeOut}>
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
            paddingHorizontal: 15,
            height: 40
          }}
        >
          <Text
            variant="labelLarge"
            style={{
              fontWeight: "700",
              color: selectedFolder === folderId ? "white" : getCurrentColors().colors.onBackground
            }}
          >
            {title}
          </Text>
          <Icon
            name={icon}
            size={20}
            color={iconColor ? iconColor : getCurrentColors().colors.primary}
          />
        </View>
      </Animated.View>
    </PressableScale>
  )
}

export default memo(FolderTag)
