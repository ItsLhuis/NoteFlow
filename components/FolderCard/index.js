import React, { useCallback, memo } from "react"
import { View } from "react-native"

import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated"

import { useTheme } from "../../contexts/themeContext"

import { Text } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import PressableScale from "components/PressableScale"

const FolderCard = ({
  item,
  index,
  selectedFolder,
  hasSelectedFolders,
  selected,
  totalNotes,
  onPress,
  onLongPress
}) => {
  const { getCurrentColors } = useTheme()

  const handlePress = useCallback(() => {
    onPress(item)
  }, [onPress])

  const handleLongPress = useCallback(() => {
    onLongPress(item)
  }, [onLongPress])

  const isNotSelectableFolder = item.id === 1 || item.id === 2

  return (
    <PressableScale
      effect
      style={{
        overflow: "hidden",
        borderRadius: 10,
        backgroundColor: isNotSelectableFolder
          ? getCurrentColors().colors.elevation.level2
          : selected
          ? getCurrentColors().colors.elevation.level5
          : getCurrentColors().colors.elevation.level2,
        marginBottom: 10,
        marginTop: 0,
        borderRadius: 10,
        ...(index % 2 === 0 ? { marginLeft: 0 } : { marginRight: 0 })
      }}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <Animated.View layout={Layout} entering={FadeIn} exiting={FadeOut}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 20
          }}
        >
          <View
            style={{ flex: 1, flexDirection: "row", alignItems: "center", height: 30, gap: 15 }}
          >
            {selectedFolder && (
              <Icon name="check" color={getCurrentColors().colors.primary} size={20} />
            )}
            <Text
              variant="titleSmall"
              numberOfLines={1}
              style={{ flex: 1, fontWeight: selectedFolder ? "700" : "500", marginRight: 15 }}
            >
              {item.title}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <Text variant="titleSmall" style={{ fontWeight: selectedFolder ? "700" : "500" }}>
              {totalNotes}
            </Text>
            {hasSelectedFolders && !isNotSelectableFolder && (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 23,
                    width: 23,
                    borderRadius: 9999,
                    backgroundColor: getCurrentColors().colors.surfaceVariant
                  }}
                >
                  {selected && (
                    <Animated.View entering={FadeIn} exiting={FadeOut}>
                      <View
                        style={{
                          height: 23,
                          width: 23,
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: 9999,
                          backgroundColor: getCurrentColors().colors.primary
                        }}
                      >
                        <Icon name="check" size={16} color="white" />
                      </View>
                    </Animated.View>
                  )}
                </View>
              </Animated.View>
            )}
          </View>
        </View>
      </Animated.View>
    </PressableScale>
  )
}

export default memo(FolderCard)
