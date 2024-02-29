import React from "react"

import { useNavigation } from "@react-navigation/native"

import { Appbar } from "react-native-paper"

const AppBarContent = ({
  hasGoBack = true,
  elevated = false,
  title,
  actions,
  iconColor,
  ...rest
}) => {
  const navigation = useNavigation()

  return (
    <Appbar.Header elevated={elevated} {...rest}>
      {hasGoBack && <Appbar.BackAction color={iconColor} onPress={() => navigation.goBack()} />}
      <Appbar.Content title={title} titleStyle={{ fontWeight: "700" }} />
      {actions &&
        actions.map((action, index) => (
          <Appbar.Action key={index} icon={action.icon} onPress={action.onPress} />
        ))}
    </Appbar.Header>
  )
}

export default AppBarContent
