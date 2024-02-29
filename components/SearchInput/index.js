import React, { forwardRef, memo } from "react"
import { View } from "react-native"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { useTheme } from "../../contexts/themeContext"

import { TextInput } from "react-native-paper"

import { rgbStringToObject } from "../../functions/rgbStringToObject"

const SearchInput = forwardRef(
  ({ searchText, setSearchText, borderRadius = 9999, placeholder = "Pesquisar", ...rest }, ref) => {
    const { getCurrentColors } = useTheme()

    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          paddingHorizontal: 20
        }}
      >
        <TextInput
          ref={ref}
          theme={{ roundness: borderRadius }}
          mode="outlined"
          style={{
            fontSize: 14,
            backgroundColor: getCurrentColors().colors.elevation.level3,
            height: 50,
            width: "100%",
            ...rest.style
          }}
          outlineColor={"transparent"}
          activeOutlineColor={"transparent"}
          selectionColor={`rgba(${rgbStringToObject(getCurrentColors().colors.primary)}, 0.6)`}
          cursorColor={getCurrentColors().colors.primary}
          left={<TextInput.Icon disabled icon="magnify" size={20} />}
          right={<View />}
          placeholder={placeholder}
          placeholderTextColor={getCurrentColors().colors.outline}
          value={searchText}
          onChangeText={setSearchText}
          {...rest}
        />
        {searchText && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{ position: "absolute", top: "26%", right: 57, zIndex: 9999 }}
          >
            <TextInput.Icon
              icon="close"
              size={20}
              onPress={() => {
                setSearchText("")
              }}
            />
          </Animated.View>
        )}
      </View>
    )
  }
)

export default memo(SearchInput)
