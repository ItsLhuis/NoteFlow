import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { BackHandler, View } from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../contexts/themeContext"

import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet"

import { Appbar } from "react-native-paper"

const BottomSheet = ({ isVisible, snap, title, centeredAlign = true, onClose, children, ...rest }) => {
  const { theme, getCurrentColors } = useTheme()

  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const bottomSheetModalRef = useRef(null)
  const snapPoints = useMemo(() => snap, [])

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        style={[
          props.style,
          {
            backgroundColor:
              theme.mode === "Dark" ? "rgba(20, 20, 20, 0.8)" : "rgba(70, 70, 70, 0.8)"
          }
        ]}
        opacity={1}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [getCurrentColors]
  )

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present()
      setIsSheetOpen(true)
    } else {
      bottomSheetModalRef.current?.dismiss()
      setIsSheetOpen(false)
    }
  }, [isVisible])

  useEffect(() => {
    const handleBackPress = () => {
      if (isSheetOpen) {
        onClose()
        return true
      }
      return false
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    return () => {
      backHandler.remove()
    }
  }, [isSheetOpen, onClose])

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      backdropComponent={renderBackdrop}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      snapPoints={snapPoints}
      onDismiss={() => {
        onClose()
      }}
      backgroundStyle={{
        backgroundColor: "transparent"
      }}
      handleIndicatorStyle={{ display: "none" }}
      {...rest}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: getCurrentColors().colors.elevation.level2,
          margin: 20,
          marginTop: 0,
          marginBottom: 20 + useSafeAreaInsets().bottom,
          borderRadius: 10,
          overflow: "hidden"
        }}
      >
        <Appbar
          mode={centeredAlign ? "center-aligned" : "small"}
          style={{
            backgroundColor: getCurrentColors().colors.elevation.level2,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <Appbar.Content title={title} titleStyle={{ fontWeight: "700", paddingLeft: 5 }} />
          <Appbar.Action icon="close" onPress={() => onClose()} />
        </Appbar>
        {children}
      </View>
    </BottomSheetModal>
  )
}

BottomSheet.defaultProps = {
  snap: ["50%"]
}

export default BottomSheet
