import React, { useEffect, useState, memo } from "react"
import { View } from "react-native"

import { Button, Text } from "react-native-paper"

import BottomSheet from "components/BottomSheet"

const BottomSheetDeleteNotes = ({
  bottomSheetTitle,
  title,
  deleteNoteSheetOpen,
  closeDeleteNoteSheet,
  onPress,
  setShowActions
}) => {
  const [deleting, setDeleting] = useState(false)

  const onCancelPress = () => {
    if (setShowActions) {
      setShowActions(true)
    }

    closeDeleteNoteSheet()
  }

  const onDeletePress = async () => {
    setDeleting(true)

    closeDeleteNoteSheet()

    onPress()
  }

  useEffect(() => {
    if (deleteNoteSheetOpen) {
      setDeleting(false)
    }
  }, [deleteNoteSheetOpen])

  return (
    <BottomSheet
      isVisible={deleteNoteSheetOpen}
      title={bottomSheetTitle}
      snap={[250]}
      onClose={() => {
        closeDeleteNoteSheet()

        if (setShowActions) {
          if (!deleting) {
            setShowActions(true)
          }
        }
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 20
        }}
      >
        <Text variant="bodyLarge" style={{ textAlign: "center" }}>
          {title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            gap: 10
          }}
        >
          <Button
            mode="contained-tonal"
            style={{ flex: 1, borderRadius: 10 }}
            onPress={onCancelPress}
          >
            Cancelar
          </Button>
          <Button
            mode="contained-tonal"
            buttonColor="#C9594C"
            textColor="white"
            style={{ flex: 1, borderRadius: 10 }}
            onPress={onDeletePress}
          >
            Eliminar
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

export default memo(BottomSheetDeleteNotes)
