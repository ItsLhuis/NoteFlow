import React, { useState, useEffect } from "react"
import { View } from "react-native"
import { StatusBar } from "expo-status-bar"

import { useUserSettings } from "../../../contexts/userSettingsContext"

import { useTheme } from "../../../contexts/themeContext"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useNavigation } from "@react-navigation/native"

import { storeData, getData } from "config/asyncStorage"

import ScreenWrapper from "components/ScreenWrapper"
import CustomButton from "components/CustomButton"

import { Divider, Text, IconButton } from "react-native-paper"

import { widthPercentageToDP as wp } from "react-native-responsive-screen"

const width = wp("100%")

const mapFontSizeLabel = {
  small: "Pequena",
  average: "Média",
  large: "Grande",
  huge: "Enorme"
}

const mapSortOrderLabel = {
  creationDate: "Pela data de criação",
  modificationDate: "Pela data de modificação"
}

const mapLayoutLabel = {
  list: "Vista de lista",
  grid: "Vista de grelha"
}

const Settings = () => {
  const navigation = useNavigation()

  const { getCurrentColors } = useTheme()

  const { updateUserSettings } = useUserSettings()

  const [BUTTONS, setBUTTONS] = useState([])

  const renderButtons = (buttons) => {
    const insets = useSafeAreaInsets()

    const { getCurrentColors } = useTheme()

    return buttons.map((button, index) => (
      <View
        key={index}
        style={index === buttons.length - 1 ? { marginBottom: insets.bottom } : null}
      >
        {button.isTitle ? (
          <Text
            variant="titleSmall"
            style={{
              marginHorizontal: 20,
              marginBottom: 10,
              marginTop: 5,
              color: getCurrentColors().colors.outline
            }}
          >
            {button.title}
          </Text>
        ) : (
          <>
            <CustomButton
              {...button}
              style={index === buttons.length - 1 ? { marginBottom: insets.bottom } : null}
            />
            {button.hasDivider && (
              <>
                <Divider bold={true} style={{ marginVertical: 15 }} />
                {button.titleDivider && (
                  <Text
                    variant="titleSmall"
                    style={{
                      marginHorizontal: 20,
                      marginBottom: 10,
                      marginTop: 5,
                      color: getCurrentColors().colors.outline
                    }}
                  >
                    {button.titleDivider}
                  </Text>
                )}
              </>
            )}
          </>
        )}
      </View>
    ))
  }

  const handleMenuItemPress = async ({ key, value }) => {
    await storeData("userSettings", { ...(await getData("userSettings")), [key]: value })
    updateUserSettings(await getData("userSettings"))

    buildButtons()
  }

  const getSelectedOption = async (category) => {
    const userSettings = await getData("userSettings")

    switch (category) {
      case "fontSize":
        return userSettings.fontSize
      case "sortOrder":
        return userSettings.sortOrder
      case "layout":
        return userSettings.layout
      default:
        return null
    }
  }

  const fetchSelectedOptions = async () => {
    const fontSizeSelected = await getSelectedOption("fontSize")
    const sortOrderSelected = await getSelectedOption("sortOrder")
    const layoutSelected = await getSelectedOption("layout")

    return { fontSizeSelected, sortOrderSelected, layoutSelected }
  }

  const buildButtons = async () => {
    const { fontSizeSelected, sortOrderSelected, layoutSelected } = await fetchSelectedOptions()

    const buttons = [
      {
        title: "Estilo",
        isTitle: true,
        hasDivider: false
      },
      {
        iconColor: "#FE938C",
        iconSize: 25,
        icon: "format-size",
        title: "Tamanho do tipo de letra",
        subTitle: mapFontSizeLabel[fontSizeSelected],
        rightIcon: "expand",
        menuWidth: 190,
        menuItems: [
          {
            title: "Pequena",
            selected: fontSizeSelected === "small",
            onPress: () => handleMenuItemPress({ key: "fontSize", value: "small" })
          },
          {
            title: "Média",
            selected: fontSizeSelected === "average",
            onPress: () => handleMenuItemPress({ key: "fontSize", value: "average" })
          },
          {
            title: "Grande",
            selected: fontSizeSelected === "large",
            onPress: () => handleMenuItemPress({ key: "fontSize", value: "large" })
          },
          {
            title: "Enorme",
            selected: fontSizeSelected === "huge",
            onPress: () => handleMenuItemPress({ key: "fontSize", value: "huge" })
          }
        ]
      },
      {
        iconColor: "#88BB92",
        iconSize: 25,
        icon: "sort",
        title: "Ordenar",
        subTitle: mapSortOrderLabel[sortOrderSelected],
        rightIcon: "expand",
        menuWidth: width <= 310 ? width - 50 : 310,
        menuItems: [
          {
            title: "Pela data de criação",
            selected: sortOrderSelected === "creationDate",
            onPress: () => handleMenuItemPress({ key: "sortOrder", value: "creationDate" })
          },
          {
            title: "Pela data de modificação",
            selected: sortOrderSelected === "modificationDate",
            onPress: () => handleMenuItemPress({ key: "sortOrder", value: "modificationDate" })
          }
        ]
      },
      {
        iconColor: "#DBD56E",
        iconSize: 25,
        icon: "view-grid-outline",
        title: "Disposição",
        subTitle: mapLayoutLabel[layoutSelected],
        rightIcon: "expand",
        menuItems: [
          {
            title: "Vista de lista",
            selected: layoutSelected === "list",
            onPress: () => handleMenuItemPress({ key: "layout", value: "list" })
          },
          {
            title: "Vista de grelha",
            selected: layoutSelected === "grid",
            onPress: () => handleMenuItemPress({ key: "layout", value: "grid" })
          }
        ],
        hasDivider: true,
        titleDivider: "Outros"
      },
      {
        iconColor: "#FE938C",
        iconSize: 25,
        title: "Política de privacidade",
        rightIcon: "chevron-right",
        actions: { onPress: () => null }
      }
    ].filter(Boolean)

    setBUTTONS(buttons)
  }

  useEffect(() => {
    buildButtons()
  }, [])

  return (
    <>
      <StatusBar translucent style="light" />
      {BUTTONS && (
        <ScreenWrapper>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
          >
            <Text variant="displaySmall" style={{ flex: 1, fontWeight: "700", margin: 20 }}>
              NoteFlow
            </Text>
            <IconButton
              mode="contained-tonal"
              style={{
                borderRadius: 9999,
                backgroundColor: getCurrentColors().colors.background,
                margin: 20
              }}
              icon="close"
              size={25}
              onPress={() => navigation.goBack()}
            />
          </View>
          {renderButtons(BUTTONS)}
        </ScreenWrapper>
      )}
    </>
  )
}

export default Settings
