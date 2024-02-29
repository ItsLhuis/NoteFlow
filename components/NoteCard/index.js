import React, { useCallback, memo } from "react"
import { View } from "react-native"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { useTheme } from "../../contexts/themeContext"

import { Text } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import PressableScale from "components/PressableScale"

import { formatDate } from "../../functions/format"

import blueColors from "config/colors/notes/blue.json"
import blue2Colors from "config/colors/notes/blue2.json"
import blue3Colors from "config/colors/notes/blue3.json"
import greenColors from "config/colors/notes/green.json"
import green2Colors from "config/colors/notes/green2.json"
import orangeColors from "config/colors/notes/orange.json"
import orange2Colors from "config/colors/notes/orange2.json"
import pinkColors from "config/colors/notes/pink.json"
import pink2Colors from "config/colors/notes/pink2.json"
import redColors from "config/colors/notes/red.json"
import red2Colors from "config/colors/notes/red2.json"
import violetColors from "config/colors/notes/violet.json"
import yellowColors from "config/colors/notes/yellow.json"

const colorsByNoteTheme = {
  blue: blueColors,
  blue2: blue2Colors,
  blue3: blue3Colors,
  green: greenColors,
  green2: green2Colors,
  orange: orangeColors,
  orange2: orange2Colors,
  pink: pinkColors,
  pink2: pink2Colors,
  red: redColors,
  red2: red2Colors,
  violet: violetColors,
  yellow: yellowColors
}

const NoteCard = ({
  item,
  index,
  notesLayout,
  hasSelectedNotes,
  selected,
  onPress,
  onLongPress
}) => {
  const { getCurrentColors } = useTheme()

  const isDefault = item.mode === "default"

  const noteColors = isDefault ? getCurrentColors() : colorsByNoteTheme[item.mode]

  const handlePress = useCallback(() => {
    onPress(item)
  }, [onPress])

  const handleLongPress = useCallback(() => {
    onLongPress(item)
  }, [onLongPress])

  return (
    <PressableScale
      style={{
        overflow: "hidden",
        borderRadius: 10,
        backgroundColor: selected
          ? isDefault
            ? noteColors.colors.elevation.level5
            : noteColors.colors.inversePrimary
          : isDefault
          ? noteColors.colors.elevation.level2
          : noteColors.colors.primaryContainer,
        marginHorizontal: notesLayout === "grid" ? 5 : 0,
        marginBottom: 10,
        marginTop: 0,
        borderRadius: 10,
        ...(index % 2 === 0 ? { marginLeft: 0 } : { marginRight: 0 })
      }}
      onPress={handlePress}
      onLongPress={handleLongPress}
    >
      <View style={{ overflow: "hidden", borderRadius: 10 }}>
        <View style={{ flex: 1 }}>
          <View style={{ padding: 15, gap: 10 }}>
            {item.title && (
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "700",
                  marginBottom: 5,
                  color: isDefault ? noteColors.colors.onBackground : noteColors.colors.primary
                }}
              >
                {item.title}
              </Text>
            )}
            {item.description && (
              <Text
                variant="labelLarge"
                numberOfLines={10}
                style={{
                  color: isDefault ? noteColors.colors.onBackground : noteColors.colors.primary,
                  opacity: 0.7
                }}
              >
                {item.description}
              </Text>
            )}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                width: "100%"
              }}
            >
              <Text
                variant="labelLarge"
                numberOfLines={1}
                style={{
                  color: isDefault ? noteColors.colors.onBackground : noteColors.colors.primary,
                  opacity: 0.7,
                  fontSize: 12,
                  marginTop: 5,
                  flex: 1
                }}
              >
                {formatDate(item.modificationDate)}
              </Text>
              <View style={{ flexDirection: "row", gap: 15 }}>
                {item.fixed && (
                  <Icon
                    name="arrow-collapse-down"
                    color={noteColors.colors.primary}
                    size={15}
                    style={{ marginTop: 5 }}
                  />
                )}
                {item.reminderDate && new Date(item.reminderDate) > new Date() && (
                  <Icon
                    name="alarm"
                    color={noteColors.colors.primary}
                    size={15}
                    style={{ marginTop: 5 }}
                  />
                )}
                {hasSelectedNotes && (
                  <Animated.View entering={FadeIn} exiting={FadeOut}>
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        height: 23,
                        width: 23,
                        borderRadius: 9999,
                        backgroundColor: isDefault
                          ? noteColors.colors.surfaceVariant
                          : noteColors.colors.inversePrimary
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
                              backgroundColor: noteColors.colors.primary
                            }}
                          >
                            <Icon
                              name="check"
                              size={16}
                              color={isDefault ? "white" : noteColors.colors.inversePrimary}
                            />
                          </View>
                        </Animated.View>
                      )}
                    </View>
                  </Animated.View>
                )}
              </View>
            </View>
          </View>
        </View>
      </View>
    </PressableScale>
  )
}

export default memo(NoteCard)
