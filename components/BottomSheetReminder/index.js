import React, { useState, memo, useEffect } from "react"
import { View } from "react-native"

import * as Notifications from "expo-notifications"

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

import { useTheme } from "../../contexts/themeContext"

import { useNotes } from "../../contexts/notesContext"

import Toast from "react-native-toast-message"

import DateTimePickerModal from "react-native-modal-datetime-picker"

import { Button, Text, IconButton } from "react-native-paper"

import BottomSheet from "components/BottomSheet"

import { formatFullDate } from "../../functions/format"

const BottomSheetReminder = ({
  noteId,
  dateValue,
  setDateValue,
  bottomSheetTitle,
  reminderNoteSheetOpen,
  closeReminderNoteSheet,
  onPress,
  noteColors
}) => {
  const { getCurrentColors } = useTheme()

  const { getNoteTitleOrDescription, getReminderDateByNoteId, removeFieldsFromNote } = useNotes()

  const [noteReminderDate, setNoteReminderDate] = useState(getReminderDateByNoteId(noteId))

  useEffect(() => {
    setDateValue(getReminderDateByNoteId(noteId) ? getReminderDateByNoteId(noteId) : new Date())
    setNoteReminderDate(getReminderDateByNoteId(noteId))
  }, [reminderNoteSheetOpen])

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = (date) => {
    hideDatePicker()
    setNoteReminderDate(date)
    setDateValue(date)
  }

  const onCancelPress = () => {
    closeReminderNoteSheet()
  }

  const onReminderPress = async () => {
    if (!noteId) {
      closeReminderNoteSheet()

      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: getCurrentColors(),
          title: "Não é possível definir lembrete numa nota vazia!",
          duration: 3000
        },
        visibilityTime: 3000,
        autoHide: true
      })

      return
    }

    if (new Date(dateValue) > new Date()) {
      try {
        const result = await scheduleReminderNotification(noteId, dateValue)

        closeReminderNoteSheet()

        if (result) {
          onPress()

          Toast.show({
            type: "customToast",
            props: {
              getCurrentColors: noteColors,
              title: "Lembrete definido com sucesso!",
              duration: 3000
            },
            visibilityTime: 3000,
            autoHide: true
          })
        }
      } catch (error) {
        closeReminderNoteSheet()

        Toast.show({
          type: "customToast",
          props: {
            getCurrentColors: noteColors,
            title: "Erro ao definir lembrete!",
            duration: 3000
          },
          visibilityTime: 3000,
          autoHide: true
        })
      }
    } else {
      closeReminderNoteSheet()

      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: noteColors,
          title: "Para definir lembrete, deve definir uma data posterior à atual!",
          duration: 4000
        },
        visibilityTime: 3000,
        autoHide: true
      })
    }
  }

  const scheduleReminderNotification = async (noteId, reminder) => {
    const { status } = await Notifications.requestPermissionsAsync()

    if (status !== "granted") {
      throw new Error("Permission not granted")
    }

    await cancelScheduledNotification(noteId)

    const result = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Lembrete de Nota",
        body: getNoteTitleOrDescription(noteId),
        data: { noteId }
      },
      trigger: { date: reminder }
    })

    if (result) {
      return result
    } else {
      return undefined
    }
  }

  const cancelScheduledNotification = async (noteId) => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()

    const notificationToCancel = scheduledNotifications.find(
      (notification) => notification.content.data.noteId === noteId
    )

    if (notificationToCancel) {
      const notificationIdToCancel = notificationToCancel.identifier

      await Notifications.cancelScheduledNotificationAsync(notificationIdToCancel)
    }
  }

  const handleDeleteReminderDate = async (noteId) => {
    await cancelScheduledNotification(noteId)

    closeReminderNoteSheet()

    Toast.show({
      type: "customToast",
      props: {
        getCurrentColors: noteColors,
        title: "Lembrete eliminado com sucesso!",
        duration: 3000
      },
      visibilityTime: 3000,
      autoHide: true
    })

    removeFieldsFromNote(noteId, ["reminderDate"])
  }

  return (
    <BottomSheet
      isVisible={reminderNoteSheetOpen}
      title={bottomSheetTitle}
      snap={[260]}
      onClose={onCancelPress}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 20
        }}
      >
        <View
          style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5 }}
        >
          <Button
            mode="contained-tonal"
            style={{ borderRadius: 10, flex: 1 }}
            onPress={showDatePicker}
          >
            <Text style={{ fontWeight: "700" }}>
              {noteReminderDate ? formatFullDate(dateValue) : "Sem lembrete"}
            </Text>
          </Button>
          <IconButton
            icon="trash-can-outline"
            style={{ borderRadius: 10 }}
            onPress={() => handleDeleteReminderDate(noteId)}
            disabled={!getReminderDateByNoteId(noteId)}
          />
        </View>
        <DateTimePickerModal
          date={noteReminderDate ? new Date(noteReminderDate) : new Date()}
          minimumDate={new Date()}
          pickerStyleIOS={{ backgroundColor: getCurrentColors().colors.elevation.level2 }}
          customConfirmButtonIOS={({ onPress }) => {
            return (
              <Button
                mode="contained"
                style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
                onPress={onPress}
              >
                <Text variant="titleMedium" style={{ color: "white" }}>
                  Confirmar
                </Text>
              </Button>
            )
          }}
          customCancelButtonIOS={() => {
            return (
              <Button
                mode="contained-tonal"
                style={{ borderRadius: 10 }}
                onPress={() => {
                  hideDatePicker()
                }}
              >
                <Text variant="titleMedium">Cancelar</Text>
              </Button>
            )
          }}
          display="inline"
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          locale="pt_PT"
        />
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
            mode="contained"
            textColor="white"
            style={{ flex: 1, borderRadius: 10 }}
            onPress={onReminderPress}
          >
            Definir
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

export default memo(BottomSheetReminder)
