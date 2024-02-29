import React, { useEffect, useRef, memo } from "react"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../contexts/themeContext"

import { BottomSheetModal } from "@gorhom/bottom-sheet"

const BottomSheetModalMoreActions = ({ isVisible, children }) => {
  const { getCurrentColors } = useTheme()

  const bottomSheetModalRef = useRef(null)

  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present()
    } else {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [isVisible])

  return (
    <BottomSheetModal
      ref={bottomSheetModalRef}
      index={0}
      enableContentPanningGesture={false}
      enableHandlePanningGesture={false}
      snapPoints={[useSafeAreaInsets().bottom + 85]}
      backgroundStyle={{
        backgroundColor: getCurrentColors().colors.elevation.level1,
        borderRadius: 0
      }}
      handleIndicatorStyle={{ display: "none" }}
    >
      {children}
    </BottomSheetModal>
  )
}

export default memo(BottomSheetModalMoreActions)
