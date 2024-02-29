import React, { forwardRef, memo } from "react"

import { TextInput as ReactNativeTextInput } from "react-native"

import { rgbStringToObject } from "../../functions/rgbStringToObject"

const TextInput = forwardRef(
  (
    {
      text,
      setText,
      placeholder = "Título",
      fontSize,
      backgroundColor,
      color,
      selectionColor,
      multiline = false,
      isTitle = false,
      ...rest
    },
    ref
  ) => {
    const mapFontSizeStyle = {
      small: {
        fontSize: !isTitle ? 13 : 16,
        marginVertical: 15
      },
      average: {
        fontSize: !isTitle ? 19 : 24,
        marginVertical: 20
      },
      large: {
        fontSize: !isTitle ? 22 : 29,
        marginVertical: 20
      },
      huge: {
        fontSize: !isTitle ? 28 : 37,
        marginVertical: 25
      }
    }

    return (
      <ReactNativeTextInput
        ref={ref}
        mode="outlined"
        multiline={multiline}
        scrollEnabled={false}
        style={{
          marginVertical: 20,
          backgroundColor,
          color,
          fontWeight: "700",
          ...rest.style,
          ...mapFontSizeStyle[fontSize]
        }}
        selectionColor={`rgba(${rgbStringToObject(selectionColor)}, 0.6)`}
        cursorColor={`rgba(${rgbStringToObject(selectionColor)}, 0.5)`}
        placeholder={placeholder}
        placeholderTextColor={`rgba(${rgbStringToObject(color)}, 0.4)`}
        value={text}
        onChangeText={setText}
        {...rest}
      />
    )
  }
)

export default memo(TextInput)
