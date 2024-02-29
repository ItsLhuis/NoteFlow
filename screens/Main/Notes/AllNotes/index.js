import React, { useState, useEffect, useRef, useCallback, memo } from "react"
import { StyleSheet, View, TouchableOpacity, RefreshControl } from "react-native"

import Animated, { Layout, FadeIn, FadeOut } from "react-native-reanimated"

import { useNavigation } from "@react-navigation/native"
import { CommonActions } from "@react-navigation/native"

import { useUserSettings } from "../../../../contexts/userSettingsContext"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../../../contexts/themeContext"

import { useFolders } from "../../../../contexts/foldersContext"

import { useNotes } from "../../../../contexts/notesContext"

import Toast from "react-native-toast-message"

import { FlashList, MasonryFlashList } from "@shopify/flash-list"

import { Portal, Appbar, Text, TouchableRipple, Divider } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import ErrorNotFound from "components/ErrorNotFound"
import FolderTag from "components/FolderTag"
import NoteCard from "components/NoteCard"
import BottomSheet from "components/BottomSheet"
import BottomSheetModalMoreActions from "components/BottomSheetModalMoreActions"
import BottomSheetDeleteNotes from "components/BottomSheetDeleteNotes"

const BottomSheetFolders = ({
  folders,
  getCurrentColors,
  foldersSheetOpen,
  closeFoldersSheet,
  flashListRef,
  keyExtractor,
  deselectAllNotes,
  selectedNotes,
  setShowActions
}) => {
  const [selectingFolder, setSelectingFolder] = useState(false)

  const { getFolderNameById } = useFolders()

  const { moveToFolder, getTotalNotesByFolder } = useNotes()

  const filteredFolders = folders.filter((item) => item.id !== 1)

  const renderFolderItem = ({ item }) => {
    return (
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <TouchableRipple
          onPress={() => {
            setSelectingFolder(true)

            closeFoldersSheet()

            if (selectedNotes.length > 0) {
              moveToFolder(selectedNotes, item.id)

              Toast.show({
                type: "customToast",
                props: {
                  getCurrentColors: getCurrentColors(),
                  title: `Nota(s) movida(s) com sucesso para ${getFolderNameById(item.id)}!`,
                  duration: 3000
                },
                visibilityTime: 3000,
                autoHide: true
              })

              deselectAllNotes()
            }
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
            <Text
              variant="titleSmall"
              numberOfLines={1}
              style={{
                flex: 1,
                fontWeight: "500",
                marginRight: 15
              }}
            >
              {item.title}
            </Text>
            <Text variant="titleSmall" style={{ fontWeight: "500" }}>
              {getTotalNotesByFolder(item.id)}
            </Text>
          </View>
        </TouchableRipple>
      </Animated.View>
    )
  }

  const renderItemSeparatorComponent = () => <Divider />

  useEffect(() => {
    if (foldersSheetOpen) {
      setSelectingFolder(false)
    }
  }, [foldersSheetOpen])

  return (
    <BottomSheet
      isVisible={foldersSheetOpen}
      title="Mover para"
      onClose={() => {
        closeFoldersSheet()

        if (!selectingFolder) {
          setShowActions(true)
        }
      }}
    >
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
          data={filteredFolders}
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

const AllNotes = ({ notesRef, deselectItems, startSearch, appshowList, setHideFabButton }) => {
  const navigation = useNavigation()

  const { getCurrentColors } = useTheme()

  const { userSettings } = useUserSettings()

  const foldersRef = useRef(null)
  const flashListFoldersRef = useRef(null)

  const [notesLayout, setNotesLayout] = useState(null)

  const [isRefreshing, setIsRefreshing] = useState(false)

  const onRefresh = () => {
    setIsRefreshing(true)

    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  const { folders, selectFolder, selectedFolder } = useFolders()

  const [deleteNoteSheetOpen, setDeleteNoteSheetOpen] = useState(false)
  const openDeleteNoteSheet = () => {
    setShowActions(false)
    setDeleteNoteSheetOpen(true)
  }
  const closeDeleteNoteSheet = () => setDeleteNoteSheetOpen(false)

  const [foldersSheetOpen, setFoldersSheetOpen] = useState(false)
  const openFoldersSheet = () => {
    setShowActions(false)
    setFoldersSheetOpen(true)
  }
  const closeFoldersSheet = () => setFoldersSheetOpen(false)

  const { updateAllNotes, deleteNote, getNotesByFolder } = useNotes()
  const notes = getNotesByFolder(selectedFolder)
  const [selectedNotes, setSelectedNotes] = useState([])

  const [showList, setShowList] = useState(false)

  const [showActions, setShowActions] = useState(false)

  const renderFolderItem = ({ item, index }) => {
    const handleOnPress = () => {
      if (showList) {
        return
      }

      setShowList(true)
      deselectAllNotes()
      foldersRef?.current?.scrollToIndex({
        animated: true,
        index,
        viewOffset: 0.5,
        viewPosition: 0.5
      })

      setTimeout(() => {
        selectFolder(item.id)
      }, 100)

      setTimeout(() => {
        setShowList(false)
      }, 200)
    }

    return (
      <FolderTag
        total={folders.length}
        item={item}
        index={index}
        folderId={item.id}
        title={item.title}
        onPress={handleOnPress}
      />
    )
  }

  useEffect(() => {
    if (showList) {
      return
    }

    setTimeout(() => {
      foldersRef?.current?.scrollToIndex({
        animated: true,
        index: selectedFolder - 1,
        viewOffset: 0.5,
        viewPosition: 0.5
      })
    }, 500)
  }, [selectedFolder])

  const selectNotes = (note) => {
    setSelectedNotes((prevSelected) => {
      if (prevSelected.includes(note.id)) {
        return prevSelected.filter((noteItem) => noteItem !== note.id)
      }
      return [...prevSelected, note.id]
    })
  }

  const deselectAllNotes = () => {
    setSelectedNotes([])
  }

  const selectAllNotes = () => {
    const allNoteIds = notes.map((note) => note.id)
    setSelectedNotes(allNoteIds)
  }

  const getNoteTitleText = () => {
    const numSelected = selectedNotes.length
    if (numSelected === 1) {
      return "1 nota selecionada"
    } else {
      return `${numSelected} notas selecionadas`
    }
  }

  const getDeleteNoteTitleText = () => {
    const numSelected = selectedNotes.length
    if (numSelected === 1) {
      return "Eliminar 1 nota?"
    } else {
      return `Eliminar ${numSelected} notas?`
    }
  }

  const isAllNotesSelected = () => selectedNotes.length === notes.length

  const hasSelectedNotes = () => selectedNotes.length !== 0

  const handleFixSelectedNotes = () => {
    const updatedNotes = notes.map((note) =>
      selectedNotes.includes(note.id) ? { ...note, fixed: true } : note
    )

    updateAllNotes(updatedNotes)

    deselectAllNotes()

    Toast.show({
      type: "customToast",
      props: {
        getCurrentColors: getCurrentColors(),
        title: "Nota(s) fixada(s) com sucesso!",
        duration: 3000
      },
      visibilityTime: 3000,
      autoHide: true
    })
  }

  const handleReleaseSelectedNotes = () => {
    const updatedNotes = notes.map((note) =>
      selectedNotes.includes(note.id) ? { ...note, fixed: false } : note
    )

    updateAllNotes(updatedNotes)

    deselectAllNotes()

    Toast.show({
      type: "customToast",
      props: {
        getCurrentColors: getCurrentColors(),
        title: "Nota(s) solta(s) com sucesso!",
        duration: 3000
      },
      visibilityTime: 3000,
      autoHide: true
    })
  }

  const handleMoveTo = () => {
    openFoldersSheet()
  }

  const handleDeleteNote = () => {
    if (selectedNotes.length > 0) {
      deleteNote(selectedNotes)

      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: getCurrentColors(),
          title: "Nota(s) eliminada(s) com sucesso!",
          duration: 3000
        },
        visibilityTime: 3000,
        autoHide: true
      })

      deselectAllNotes()
    }
  }

  const handleOnPressNote = (note) => {
    if (selectedNotes.length) {
      selectNotes(note)
    } else {
      navigation.dispatch(
        CommonActions.navigate({
          name: "Note",
          params: {
            mode: "editNote",
            note: note
          }
        })
      )
    }
  }

  const handleOnLongPressNote = (note) => {
    if (!startSearch) {
      return
    }

    if (!selectedNotes.length) {
      selectNotes(note)
    }
  }

  const getSelectedNote = (note) => selectedNotes.includes(note.id)

  useEffect(() => {
    if (deselectItems) {
      return
    }

    if (selectedNotes.length) {
      setHideFabButton(true)
      setShowActions(true)
    } else {
      setHideFabButton(false)
      setShowActions(false)
    }
  }, [selectedNotes])

  const renderNoteItem = ({ item, index }) => {
    return (
      <NoteCard
        item={item}
        index={index}
        notesLayout={notesLayout}
        hasSelectedNotes={hasSelectedNotes()}
        selected={getSelectedNote(item)}
        onPress={() => handleOnPressNote(item)}
        onLongPress={() => handleOnLongPressNote(item)}
      />
    )
  }

  const keyExtractor = useCallback((item, _) => item.id)

  useEffect(() => {
    if (deselectItems) {
      setShowActions(false)
      deselectAllNotes()
    }
  }, [deselectItems])

  useEffect(() => {
    setNotesLayout(userSettings.layout)
  }, [userSettings.layout])

  return (
    <View style={{ flex: 1 }}>
      {showActions && (
        <Portal>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Appbar.Header mode="center-aligned">
              <Appbar.Action icon="close" onPress={deselectAllNotes} />
              <Appbar.Content title={getNoteTitleText()} titleStyle={{ fontWeight: "700" }} />
              <Appbar.Action
                icon="playlist-check"
                onPress={selectAllNotes}
                color={isAllNotesSelected() ? getCurrentColors().colors.primary : undefined}
              />
            </Appbar.Header>
          </Animated.View>
        </Portal>
      )}
      <View style={{ flexDirection: "row", gap: 5, marginLeft: 15 }}>
        <FolderTag
          total={folders.length}
          icon="folder-open-outline"
          onPress={() => {
            setSelectedNotes([])
            navigation.navigate("AllFolders")
          }}
        />
        <View style={{ flex: 1, marginRight: 20, borderRadius: 10, overflow: "hidden" }}>
          <FlashList
            ref={foldersRef}
            data={folders}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            estimatedItemSize={70}
            renderItem={renderFolderItem}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          margin: 20,
          marginTop: 20,
          marginBottom: 0,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          overflow: "hidden"
        }}
      >
        {!showList && (
          <Animated.View style={{ flex: 1 }} entering={FadeIn} exiting={FadeOut}>
            <MasonryFlashList
              ref={notesRef}
              removeClippedSubviews
              data={notes}
              extraData={selectNotes}
              keyExtractor={keyExtractor}
              numColumns={notesLayout === "grid" ? 2 : 1}
              disableAutoLayout
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100 + useSafeAreaInsets().bottom,
                paddingHorizontal: 0.01
              }}
              estimatedItemSize={216}
              renderItem={renderNoteItem}
              scrollEnabled={!appshowList}
              onEndReachedThreshold={2}
              scrollEventThrottle={16}
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  tintColor={getCurrentColors().colors.onBackground}
                  colors={["white"]}
                  progressBackgroundColor={getCurrentColors().colors.primary}
                />
              }
            />
          </Animated.View>
        )}
        {notes.length === 0 && (
          <View
            style={{
              ...StyleSheet.absoluteFill
            }}
          >
            <ErrorNotFound description="Sem notas aqui ainda!" />
          </View>
        )}
      </View>
      <BottomSheetModalMoreActions isVisible={showActions}>
        <Animated.View
          layout={Layout}
          entering={FadeIn}
          exiting={FadeOut}
          style={{ flexDirection: "row", justifyContent: "center", gap: 35 }}
        >
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            {selectedNotes.some((noteId) => !notes.find((note) => note.id === noteId)?.fixed) ? (
              <TouchableOpacity onPress={handleFixSelectedNotes}>
                <View style={{ alignItems: "center", gap: 5 }}>
                  <Icon name="arrow-collapse-up" color="#9897ba" size={23} />
                  <Text variant="labelMedium">Fixar</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleReleaseSelectedNotes}>
                <View style={{ alignItems: "center", gap: 5 }}>
                  <Icon name="arrow-expand-down" color="#9897ba" size={23} />
                  <Text variant="labelMedium">Soltar</Text>
                </View>
              </TouchableOpacity>
            )}
          </Animated.View>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity onPress={handleMoveTo}>
              <View style={{ alignItems: "center", gap: 5 }}>
                <Icon name="arrow-expand-right" color="#9897ba" size={23} />
                <Text variant="labelMedium">Mover para</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity onPress={openDeleteNoteSheet}>
              <View style={{ alignItems: "center", gap: 5 }}>
                <Icon name="trash-can-outline" color="#9897ba" size={23} />
                <Text variant="labelMedium">Eliminar</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </BottomSheetModalMoreActions>
      <BottomSheetDeleteNotes
        bottomSheetTitle="Eliminar Nota(s)"
        title={getDeleteNoteTitleText()}
        deleteNoteSheetOpen={deleteNoteSheetOpen}
        closeDeleteNoteSheet={closeDeleteNoteSheet}
        onPress={handleDeleteNote}
        setShowActions={setShowActions}
      />
      <BottomSheetFolders
        folders={folders}
        getCurrentColors={getCurrentColors}
        foldersSheetOpen={foldersSheetOpen}
        closeFoldersSheet={closeFoldersSheet}
        flashListRef={flashListFoldersRef}
        keyExtractor={keyExtractor}
        deselectAllNotes={deselectAllNotes}
        selectedNotes={selectedNotes}
        setShowActions={setShowActions}
      />
    </View>
  )
}

export default memo(AllNotes)
