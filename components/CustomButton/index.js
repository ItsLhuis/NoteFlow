import React, { useState, useRef, memo } from "react"
import { View } from "react-native"

import { useTheme } from "../../contexts/themeContext"

import { Image } from "expo-image"
import { TouchableRipple, Text, Badge, Appbar, IconButton } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import PopUpMenu from "components/PopUpMenu"

const CustomButton = ({
  isIconButton = false,
  isInAppBar = false,
  image,
  icon,
  iconColor,
  iconSize,
  title,
  titleColor = null,
  titleDescription,
  subTitle,
  notifIcon = 0,
  rightIcon,
  actions,
  menuWidth = 220,
  menuItems
}) => {
  const { getCurrentColors } = useTheme()

  const [visible, setVisible] = useState(false)
  const [buttonLayout, setButtonLayout] = useState(null)
  const buttonRef = useRef(null)

  const showMenu = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setButtonLayout({ x: pageX, y: pageY, width, height })
        setVisible(true)
      })
    }
  }

  const hideMenu = () => setVisible(false)

  const handlePress = () => {
    if (menuItems) {
      if (actions && actions.onPress) {
        actions.onPress()
      }
      showMenu()
    } else if (actions && actions.onPress) {
      actions.onPress()
    }
  }

  return (
    <>
      {isIconButton ? (
        <>
          {isInAppBar ? (
            <Appbar.Action
              ref={buttonRef}
              icon={icon}
              iconColor={iconColor}
              onPress={handlePress}
            />
          ) : (
            <IconButton
              ref={buttonRef}
              icon={icon}
              iconColor={iconColor}
              size={iconSize}
              onPress={handlePress}
            />
          )}
        </>
      ) : (
        <TouchableRipple
          ref={buttonRef}
          style={{
            borderRadius: 0
          }}
          onPress={handlePress}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 15,
              paddingHorizontal: 10
            }}
          >
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              {image ? (
                <View style={{ justifyContent: "center" }}>
                  <View
                    style={{
                      width: 45,
                      height: 25,
                      borderRadius: 5,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: getCurrentColors().colors.surfaceVariant
                    }}
                  >
                    <Image
                      source={image}
                      style={{ flex: 1, width: undefined, height: undefined }}
                    />
                  </View>
                </View>
              ) : (
                <>
                  {icon && (
                    <View style={{ justifyContent: "center", marginLeft: 10 }}>
                      <Icon name={icon} color={iconColor} size={iconSize} />
                    </View>
                  )}
                </>
              )}
              {titleDescription ? (
                <View style={{ justifyContent: "center" }}>
                  <Text
                    variant="titleMedium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      { marginLeft: 10, marginRight: 40 },
                      titleColor && { color: titleColor }
                    ]}
                  >
                    {title}
                  </Text>
                  <Text
                    variant="labelSmall"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      { marginLeft: 10, marginRight: 40 },
                      { color: getCurrentColors().colors.outline }
                    ]}
                  >
                    {titleDescription}
                  </Text>
                </View>
              ) : (
                <Text
                  variant="titleMedium"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[{ marginLeft: 10, marginRight: 40 }, titleColor && { color: titleColor }]}
                >
                  {title}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  variant="titleSmall"
                  style={{ marginRight: 10, color: getCurrentColors().colors.outline }}
                >
                  {subTitle}
                </Text>
              </View>
              {notifIcon !== 0 && (
                <View style={{ justifyContent: "center" }}>
                  <Badge
                    style={{ backgroundColor: getCurrentColors().colors.primary, color: "white" }}
                  >
                    {notifIcon}
                  </Badge>
                </View>
              )}
              {rightIcon && (
                <>
                  {rightIcon === "expand" ? (
                    <View style={{ justifyContent: "center", marginRight: 10 }}>
                      <View style={{ gap: -14 }}>
                        <Icon
                          name={"chevron-up"}
                          color={getCurrentColors().colors.outline}
                          size={iconSize - 3}
                        />
                        <Icon
                          name={"chevron-down"}
                          color={getCurrentColors().colors.outline}
                          size={iconSize - 3}
                        />
                      </View>
                    </View>
                  ) : (
                    <View style={{ justifyContent: "center", marginRight: 10 }}>
                      <Icon
                        name={rightIcon}
                        color={getCurrentColors().colors.outline}
                        size={iconSize}
                      />
                    </View>
                  )}
                </>
              )}
            </View>
          </View>
        </TouchableRipple>
      )}
      {menuItems && (
        <PopUpMenu
          visible={visible}
          data={menuItems}
          layout={buttonLayout}
          onClose={hideMenu}
          menuWidth={menuWidth}
        />
      )}
    </>
  )
}

export default memo(CustomButton)
