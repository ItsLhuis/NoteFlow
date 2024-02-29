import React, { useState, useEffect, useLayoutEffect, useRef, useCallback, memo } from "react"
import {
  BackHandler,
  View,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform
} from "react-native"

import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

import { useNavigation } from "@react-navigation/native"

import { useUserSettings } from "../../../../contexts/userSettingsContext"

import { useTheme } from "../../../../contexts/themeContext"

import { useFolders } from "../../../../contexts/foldersContext"

import { useNotes } from "../../../../contexts/notesContext"

import Toast from "react-native-toast-message"

import { captureRef } from "react-native-view-shot"

import * as Sharing from "expo-sharing"

import { FlashList } from "@shopify/flash-list"

import { Appbar, Text, Divider, TouchableRipple } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import CustomButton from "components/CustomButton"
import PressableScale from "components/PressableScale"
import TextInput from "components/TextInput"
import BottomSheet from "components/BottomSheet"
import BottomSheetDeleteNotes from "components/BottomSheetDeleteNotes"
import BottomSheetReminder from "components/BottomSheetReminder"
import ViewShare from "components/ViewShare"

import { formatTodayDate, formatTime } from "../../../../functions/format"
import { rgbStringToObject } from "../../../../functions/rgbStringToObject"

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

const modes = [
  { id: 0, mode: "default" },
  { id: 1, mode: "blue" },
  { id: 2, mode: "blue2" },
  { id: 3, mode: "blue3" },
  { id: 4, mode: "green" },
  { id: 5, mode: "green2" },
  { id: 6, mode: "orange" },
  { id: 7, mode: "orange2" },
  { id: 8, mode: "pink" },
  { id: 9, mode: "pink2" },
  { id: 10, mode: "red" },
  { id: 11, mode: "red2" },
  { id: 12, mode: "violet" },
  { id: 13, mode: "yellow" }
]

const AppBar = ({
  noteId,
  setNoteFixed,
  noteFixed,
  setNoteDate,
  handleSaveNote,
  actionMode,
  navigation,
  noteColors,
  isDefaultNoteColor,
  openNoteColorsSheet,
  openReminderNoteSheet,
  openDeleteNoteSheet,
  viewShareRef
}) => {
  const { updateNote } = useNotes()

  return (
    <Appbar.Header
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: isDefaultNoteColor
          ? noteColors.colors.background
          : noteColors.colors.inversePrimary,
        marginBottom: 5
      }}
    >
      <Appbar.BackAction
        color={isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary}
        onPress={() => {
          Keyboard.dismiss()
          navigation.goBack()
        }}
      />
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end" }}>
        {actionMode === "NotEditing" && (
          <Animated.View style={{ flexDirection: "row" }} entering={FadeIn} exiting={FadeOut}>
            <Appbar.Action
              icon="calendar-clock-outline"
              color={
                isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary
              }
              onPress={() => {
                Keyboard.dismiss()
                openReminderNoteSheet()
              }}
            />
            <Appbar.Action
              icon="tshirt-crew-outline"
              color={
                isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary
              }
              onPress={() => {
                Keyboard.dismiss()
                openNoteColorsSheet()
              }}
            />
          </Animated.View>
        )}
        <CustomButton
          isIconButton
          isInAppBar
          icon={actionMode === "Editing" ? "check" : "dots-vertical"}
          iconColor={
            isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary
          }
          menuWidth={160}
          actions={{
            onPress:
              actionMode === "Editing"
                ? () => {
                    Keyboard.dismiss()
                    handleSaveNote()
                  }
                : () => Keyboard.dismiss()
          }}
          menuItems={
            actionMode !== "Editing" && [
              {
                title: "Partilhar",
                onPress: async () => {
                  const url = await captureRef(viewShareRef, {
                    format: "jpg",
                    quality: 1
                  })

                  try {
                    setTimeout(async () => {
                      await Sharing.shareAsync(url)
                    }, 250)
                  } catch (error) {
                    console.log("Erro: ", error)
                  }
                }
              },
              {
                title: !noteFixed ? "Fixar" : "Soltar",
                onPress: () => {
                  if (noteId) {
                    const currentDate = new Date().toISOString()

                    updateNote(noteId, { modificationDate: currentDate, fixed: !noteFixed })

                    setNoteDate(currentDate)

                    setNoteFixed(!noteFixed)

                    Toast.show({
                      type: "customToast",
                      props: {
                        getCurrentColors: noteColors,
                        title: `Nota ${!noteFixed ? "fixada" : "solta"} com sucesso!`,
                        duration: 3000
                      },
                      visibilityTime: 3000,
                      autoHide: true
                    })
                  } else {
                    Toast.show({
                      type: "customToast",
                      props: {
                        getCurrentColors: noteColors,
                        title: "Não é possível fixar uma nota vazia!",
                        duration: 3000
                      },
                      visibilityTime: 3000,
                      autoHide: true
                    })
                  }
                }
              },
              { title: "Eliminar", onPress: () => openDeleteNoteSheet() }
            ]
          }
        />
      </View>
    </Appbar.Header>
  )
}

const BottomSheetFolders = ({
  noteId,
  folders,
  setNoteDate,
  getCurrentColors,
  foldersSheetOpen,
  closeFoldersSheet,
  flashListRef,
  folderSelected,
  setFolderSelected,
  keyExtractor
}) => {
  const { getTotalNotesByFolder, updateNote } = useNotes()

  const filteredFolders = folders.filter((item) => item.id !== 1)
  const selectedIndex = filteredFolders.findIndex((item) => item.id === folderSelected)
  const sortedFolders =
    selectedIndex !== -1
      ? [
          filteredFolders[selectedIndex],
          ...filteredFolders.slice(0, selectedIndex),
          ...filteredFolders.slice(selectedIndex + 1)
        ]
      : filteredFolders

  const renderFolderItem = ({ item }) => {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{
          backgroundColor:
            folderSelected === item.id
              ? `rgba(${rgbStringToObject(getCurrentColors().colors.primary)}, 0.2)`
              : "transparent"
        }}
      >
        <TouchableRipple
          onPress={() => {
            closeFoldersSheet()
            setTimeout(() => {
              setFolderSelected(item.id)

              const currentDate = new Date().toISOString()

              updateNote(noteId, { modificationDate: currentDate, folder: item.id })

              setNoteDate(currentDate)
            }, 200)
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              margin: 20,
              gap: 15
            }}
          >
            {folderSelected === item.id && (
              <Icon name="check" size={20} color={getCurrentColors().colors.primary} />
            )}
            <Text
              variant="titleSmall"
              numberOfLines={1}
              style={{
                flex: 1,
                fontWeight: folderSelected === item.id ? "700" : "500",
                marginRight: 15
              }}
            >
              {item.title}
            </Text>
            <Text
              variant="titleSmall"
              style={{ fontWeight: folderSelected === item.id ? "700" : "500" }}
            >
              {getTotalNotesByFolder(item.id)}
            </Text>
          </View>
        </TouchableRipple>
      </Animated.View>
    )
  }

  const renderItemSeparatorComponent = () => <Divider />

  return (
    <BottomSheet isVisible={foldersSheetOpen} title="Pasta" onClose={closeFoldersSheet}>
      <View
        style={{
          flex: 1,
          overflow: "hidden",
          borderRadius: 10,
          margin: 20,
          marginTop: 0,
          backgroundColor: getCurrentColors().colors.elevation.level5
        }}
      >
        <FlashList
          ref={flashListRef}
          data={sortedFolders}
          keyExtractor={keyExtractor}
          bounces={false}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={60}
          renderItem={renderFolderItem}
          ItemSeparatorComponent={renderItemSeparatorComponent}
        />
      </View>
    </BottomSheet>
  )
}

const BottomSheetNoteColors = ({
  modes,
  theme,
  noteId,
  getCurrentColors,
  noteColorsSheetOpen,
  closeNoteColorsSheet,
  flashListRef,
  noteModeSelected,
  setNoteModeSelected,
  setNoteDate,
  keyExtractor
}) => {
  const { updateNote } = useNotes()

  const [reload, setReload] = useState(false)

  useEffect(() => {
    setReload(true)

    setTimeout(() => {
      setReload(false)
    })
  }, [theme.mode])

  const selectedIndex = modes.findIndex((item) => item.mode === noteModeSelected)

  const sortedModes = [
    modes[selectedIndex],
    ...modes.slice(0, selectedIndex),
    ...modes.slice(selectedIndex + 1)
  ]

  const renderColorItem = ({ item, index }) => {
    const isDefault = item.mode === "default"

    const noteColors = isDefault ? getCurrentColors() : colorsByNoteTheme[item.mode]

    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <PressableScale
          onPress={() => {
            closeNoteColorsSheet()

            setNoteModeSelected(item.mode)
            if (noteId) {
              const currentDate = new Date().toISOString()

              const updatedNote = {
                modificationDate: currentDate,
                mode: item.mode
              }

              updateNote(noteId, updatedNote)

              setNoteDate(currentDate)
            }
          }}
        >
          <View
            style={{
              borderRadius: 10,
              padding: 5,
              marginHorizontal: 2,
              borderWidth: 3,
              borderColor:
                item.mode === noteModeSelected ? getCurrentColors().colors.primary : "transparent"
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: 140,
                borderRadius: 5,
                backgroundColor: isDefault
                  ? noteColors.colors.elevation.level5
                  : noteColors.colors.inversePrimary,
                ...(index === 0 && { marginLeft: 0 }),
                ...(index === modes.length - 1 && { marginRight: 0 })
              }}
            >
              <Icon
                name="playlist-edit"
                size={50}
                color={isDefault ? noteColors.colors.outline : noteColors.colors.primary}
              />
            </View>
          </View>
        </PressableScale>
      </Animated.View>
    )
  }

  return (
    <BottomSheet isVisible={noteColorsSheetOpen} onClose={closeNoteColorsSheet} snap={[370]}>
      <View
        style={{
          flex: 1
        }}
      >
        {!reload && (
          <FlashList
            ref={flashListRef}
            data={sortedModes}
            keyExtractor={keyExtractor}
            bounces={false}
            horizontal
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={150}
            contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
            renderItem={renderColorItem}
          />
        )}
      </View>
    </BottomSheet>
  )
}

const Note = ({ route }) => {
  const navigation = useNavigation()

  const { theme, getCurrentColors } = useTheme()

  const { userSettings } = useUserSettings()

  const flashListFoldersRef = useRef(null)
  const flashListNoteColorsRef = useRef(null)
  const noteInputTitleRef = useRef(null)
  const noteInputDescriptionRef = useRef(null)
  const viewShareRef = useRef(null)

  const mode = route.params.mode

  const [actionMode, setActionMode] = useState(mode === "addNote" ? "Editing" : "NotEditing")

  const { folders, selectedFolder, getFolderNameById } = useFolders()
  const [folderSelected, setFolderSelected] = useState(selectedFolder === 1 ? 2 : selectedFolder)

  const { addNote, updateNote, deleteNote, getNextNoteId, areNotesEqual, getReminderDateByNoteId } =
    useNotes()

  const [noteModeSelected, setNoteModeSelected] = useState("default")
  const isDefaultNoteColor = noteModeSelected === "default"
  const noteColors = isDefaultNoteColor ? getCurrentColors() : colorsByNoteTheme[noteModeSelected]

  const [reminderDateValue, setReminderDateValue] = useState(() => {
    const currentDate = new Date()
    currentDate.setMinutes(currentDate.getMinutes() + 1)

    return currentDate
  })

  const [noteFontSize, setNoteFontSize] = useState(null)

  const [noteId, setNoteId] = useState(null)

  const [noteTitle, setNoteTitle] = useState("")

  const [noteCreationDate, setNoteCreationDate] = useState("")
  const [noteDate, setNoteDate] = useState("")
  const [noteTotalChar, setNoteTotalChar] = useState(0)

  const [noteDescription, setNoteDescription] = useState("")

  const [noteFixed, setNoteFixed] = useState(null)

  const handleSaveNote = () => {
    if (actionMode === "Editing") {
      if (noteId) {
        const currentDate = new Date().toISOString()

        const updatedNote = {
          title: noteTitle,
          description: noteDescription,
          modificationDate: currentDate
        }

        if (noteTitle === "" && noteDescription === "") {
          deleteNote([noteId])

          setNoteId(null)
        } else {
          const isNoteModified = areNotesEqual(noteId, updatedNote)

          if (isNoteModified) {
            return
          }

          updateNote(noteId, updatedNote)
        }

        return
      }

      if (noteTitle || noteDescription) {
        const nextId = getNextNoteId()

        const newNote = {
          id: nextId,
          title: noteTitle,
          description: noteDescription,
          creationDate: noteCreationDate,
          modificationDate: new Date().toISOString(),
          fixed: false,
          folder: folderSelected,
          mode: noteModeSelected
        }

        setNoteId(nextId)

        addNote(newNote, folderSelected)
      }
    }
  }

  useLayoutEffect(() => {
    setNoteFontSize(userSettings.fontSize)

    if (mode === "addNote") {
      const currentDate = route.params.currentDate

      setNoteDate(currentDate)
      setNoteCreationDate(currentDate)
    } else {
      const note = route.params.note

      setFolderSelected(note.folder)
      setNoteModeSelected(note.mode)
      setNoteId(note.id)
      setNoteTitle(note.title ? note.title : "")
      setNoteCreationDate(note.creationDate)
      setNoteDate(note.modificationDate)
      setNoteDescription(note.description ? note.description : "")
      setNoteFixed(note.fixed)

      return
    }

    setTimeout(() => {
      noteInputDescriptionRef?.current?.focus()
    }, 300)
  }, [])

  useEffect(() => {
    const handleBackPress = () => {
      if (noteTitle || noteDescription) {
        handleSaveNote()
      }
      return false
    }

    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    return () => {
      backHandler.remove()
    }
  }, [noteTitle, noteDescription])

  useEffect(() => {
    const charCount = noteDescription.length
    const charLabel = charCount === 1 ? "caractere" : "caracteres"
    setNoteTotalChar(`${charCount} ${charLabel}`)
  }, [noteDescription])

  const [deleteNoteSheetOpen, setDeleteNoteSheetOpen] = useState(false)
  const openDeleteNoteSheet = () => setDeleteNoteSheetOpen(true)
  const closeDeleteNoteSheet = () => setDeleteNoteSheetOpen(false)

  const handleDeleteNote = () => {
    if (noteId) {
      deleteNote([noteId])

      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: getCurrentColors(),
          title: "Nota eliminada com sucesso!",
          duration: 3000
        },
        visibilityTime: 3000,
        autoHide: true
      })

      navigation.goBack()
    } else {
      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: getCurrentColors(),
          title: "Não é possível eliminar uma nota vazia!",
          duration: 3000
        },
        visibilityTime: 3000,
        autoHide: true
      })
    }
  }

  const [reminderNoteSheetOpen, setReminderNoteSheetOpen] = useState(false)
  const openReminderNoteSheet = () => setReminderNoteSheetOpen(true)
  const closeReminderNoteSheet = () => setReminderNoteSheetOpen(false)

  const handleReminderNote = () => {
    const currentDate = new Date().toISOString()

    const updatedNote = {
      modificationDate: currentDate,
      reminderDate: new Date(reminderDateValue).toISOString()
    }

    updateNote(noteId, updatedNote)

    setNoteDate(currentDate)
  }

  const [foldersSheetOpen, setFoldersSheetOpen] = useState(false)
  const openFoldersSheet = () => setFoldersSheetOpen(true)
  const closeFoldersSheet = () => setFoldersSheetOpen(false)

  const [noteColorsSheetOpen, setNoteColorsSheetOpen] = useState(false)
  const openNoteColorsSheet = () => setNoteColorsSheetOpen(true)
  const closeNoteColorsSheet = () => setNoteColorsSheetOpen(false)

  const keyExtractor = useCallback((item, _) => item.id)

  return (
    <>
      <TouchableWithoutFeedback onPress={handleSaveNote}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <AppBar
            noteId={noteId}
            setNoteFixed={setNoteFixed}
            noteFixed={noteFixed}
            setNoteDate={setNoteDate}
            handleSaveNote={handleSaveNote}
            actionMode={actionMode}
            navigation={navigation}
            isDefaultNoteColor={isDefaultNoteColor}
            noteColors={noteColors}
            openNoteColorsSheet={openNoteColorsSheet}
            openReminderNoteSheet={openReminderNoteSheet}
            openDeleteNoteSheet={openDeleteNoteSheet}
            viewShareRef={viewShareRef}
          />
          <View style={{ flex: 1, zIndex: 9999 }}>
            <ScrollView
              style={{
                flex: 1,
                paddingHorizontal: 20,
                backgroundColor: isDefaultNoteColor
                  ? noteColors.colors.background
                  : noteColors.colors.inversePrimary
              }}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              <View
                style={{ alignItems: "flex-start", justifyContent: "flex-start", marginBottom: 5 }}
              >
                <PressableScale
                  effect
                  onPress={() => openFoldersSheet(true)}
                  style={{
                    overflow: "hidden",
                    borderRadius: 10,
                    backgroundColor: isDefaultNoteColor
                      ? noteColors.colors.elevation.level3
                      : `rgba(${rgbStringToObject(noteColors.colors.primary)}, 0.2)`,
                    height: 40
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 15,
                      height: "100%",
                      gap: 10
                    }}
                  >
                    <Icon
                      name="folder-outline"
                      size={20}
                      color={
                        isDefaultNoteColor
                          ? noteColors.colors.onBackground
                          : noteColors.colors.primary
                      }
                    />
                    <Text
                      variant="labelLarge"
                      numberOfLines={1}
                      style={{
                        color: isDefaultNoteColor
                          ? noteColors.colors.onBackground
                          : noteColors.colors.primary,
                        fontWeight: "700"
                      }}
                    >
                      {getFolderNameById(folderSelected)}
                    </Text>
                  </View>
                </PressableScale>
              </View>
              <TextInput
                ref={noteInputTitleRef}
                fontSize={noteFontSize}
                backgroundColor={
                  isDefaultNoteColor
                    ? noteColors.colors.background
                    : noteColors.colors.inversePrimary
                }
                color={
                  isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary
                }
                selectionColor={noteColors.colors.primary}
                multiline
                isTitle
                text={noteTitle}
                setText={setNoteTitle}
                blurOnSubmit
                onSubmitEditing={() => noteInputDescriptionRef?.current?.focus()}
                onFocus={() => setActionMode("Editing")}
                onBlur={() => {
                  handleSaveNote()
                  setActionMode("NotEditing")
                }}
              />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 5 }}>
                <Text
                  variant="labelMedium"
                  style={{
                    fontWeight: "700",
                    color: isDefaultNoteColor
                      ? noteColors.colors.onBackground
                      : noteColors.colors.primary,
                    opacity: 0.7
                  }}
                >
                  {noteDate && formatTodayDate(noteDate)}
                </Text>
                <Icon
                  name="circle"
                  size={5}
                  color={
                    isDefaultNoteColor ? noteColors.colors.onBackground : noteColors.colors.primary
                  }
                />
                <Text
                  variant="labelMedium"
                  style={{
                    fontWeight: "700",
                    color: isDefaultNoteColor
                      ? noteColors.colors.onBackground
                      : noteColors.colors.primary,
                    opacity: 0.7
                  }}
                >
                  {noteDate && formatTime(noteDate)}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text
                  numberOfLines={1}
                  variant="labelMedium"
                  style={{
                    fontWeight: "700",
                    color: isDefaultNoteColor
                      ? noteColors.colors.onBackground
                      : noteColors.colors.primary,
                    opacity: 0.7
                  }}
                >
                  {noteTotalChar}
                </Text>
                {getReminderDateByNoteId(noteId) && (
                  <>
                    <Icon
                      name="circle"
                      size={5}
                      color={
                        isDefaultNoteColor
                          ? noteColors.colors.onBackground
                          : noteColors.colors.primary
                      }
                    />
                    <Icon name="alarm" color={noteColors.colors.primary} size={13} />
                  </>
                )}
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  noteInputDescriptionRef?.current?.blur()
                  noteInputDescriptionRef?.current?.focus()
                }}
              >
                <View style={{ flex: 1, marginTop: 10 }}>
                  <TextInput
                    ref={noteInputDescriptionRef}
                    fontSize={noteFontSize}
                    backgroundColor={
                      isDefaultNoteColor
                        ? noteColors.colors.background
                        : noteColors.colors.inversePrimary
                    }
                    color={
                      isDefaultNoteColor
                        ? noteColors.colors.onBackground
                        : noteColors.colors.primary
                    }
                    selectionColor={noteColors.colors.primary}
                    multiline
                    placeholder="Comece a escrever"
                    text={noteDescription}
                    setText={setNoteDescription}
                    onFocus={() => setActionMode("Editing")}
                    onBlur={() => {
                      handleSaveNote()
                      setActionMode("NotEditing")
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </View>
          <BottomSheetDeleteNotes
            bottomSheetTitle="Eliminar Nota"
            title="Eliminar esta nota?"
            deleteNoteSheetOpen={deleteNoteSheetOpen}
            closeDeleteNoteSheet={closeDeleteNoteSheet}
            onPress={handleDeleteNote}
          />
          <BottomSheetFolders
            noteId={noteId}
            setNoteDate={setNoteDate}
            folders={folders}
            getCurrentColors={getCurrentColors}
            foldersSheetOpen={foldersSheetOpen}
            closeFoldersSheet={closeFoldersSheet}
            flashListRef={flashListFoldersRef}
            folderSelected={folderSelected}
            setFolderSelected={setFolderSelected}
            keyExtractor={keyExtractor}
          />
          <BottomSheetNoteColors
            modes={modes}
            theme={theme}
            noteId={noteId}
            getCurrentColors={getCurrentColors}
            noteColorsSheetOpen={noteColorsSheetOpen}
            closeNoteColorsSheet={closeNoteColorsSheet}
            flashListRef={flashListNoteColorsRef}
            noteModeSelected={noteModeSelected}
            setNoteModeSelected={setNoteModeSelected}
            setNoteDate={setNoteDate}
            keyExtractor={keyExtractor}
          />
          <BottomSheetReminder
            noteId={noteId}
            dateValue={reminderDateValue}
            setDateValue={setReminderDateValue}
            bottomSheetTitle="Definir Lembrete"
            reminderNoteSheetOpen={reminderNoteSheetOpen}
            closeReminderNoteSheet={closeReminderNoteSheet}
            onPress={handleReminderNote}
            noteColors={noteColors}
          />
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <ViewShare
        ref={viewShareRef}
        title={noteTitle}
        description={noteDescription}
        isDefaultNoteColor={isDefaultNoteColor}
        noteColors={noteColors}
      />
    </>
  )
}

export default memo(Note)
