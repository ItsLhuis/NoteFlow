import React, { useState, useEffect, useRef, useCallback, memo } from "react"
import { BackHandler, View, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"

import Animated, {
  Layout,
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming
} from "react-native-reanimated"

import { useNavigation } from "@react-navigation/native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

import { useTheme } from "../../../../contexts/themeContext"

import { useFolders } from "../../../../contexts/foldersContext"

import { useNotes } from "../../../../contexts/notesContext"

import Toast from "react-native-toast-message"

import { FlashList } from "@shopify/flash-list"

import { BottomSheetTextInput } from "@gorhom/bottom-sheet"

import { Portal, Appbar, Button, Text, FAB } from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

import AppBarContent from "components/AppBarContent"
import FolderCard from "components/FolderCard"
import PressableScale from "components/PressableScale"
import BottomSheet from "components/BottomSheet"
import BottomSheetModalMoreActions from "components/BottomSheetModalMoreActions"

import { rgbStringToObject } from "../../../../functions/rgbStringToObject"

const BottomSheetFolderActions = ({
  setActionsNoteText,
  selectedFolders,
  actionsNoteText,
  actionMode,
  getCurrentColors,
  actionsFolderSheetOpen,
  closeActionsFolderSheet,
  setShowActions,
  deselectAllFolders
}) => {
  const [folderActions, setFolderActions] = useState(false)

  const { folderExists, getNextFolderId, addFolder, updateFolder } = useFolders()

  const handleAddFolder = () => {
    if (folderExists(actionsNoteText)) {
      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: getCurrentColors(),
          title: "Já existe uma pasta com o mesmo nome!",
          duration: 3000
        },
        visibilityTime: 3000,
        autoHide: true
      })

      closeActionsFolderSheet()
      return
    }

    const nextId = getNextFolderId()

    const newFolder = {
      id: nextId,
      title: actionsNoteText
    }

    addFolder(newFolder)

    Toast.show({
      type: "customToast",
      props: {
        getCurrentColors: getCurrentColors(),
        title: "Pasta criada com sucesso!",
        duration: 3000
      },
      visibilityTime: 3000,
      autoHide: true
    })

    closeActionsFolderSheet()
  }

  const handleEditFolder = () => {
    if (folderExists(actionsNoteText, selectedFolders[0])) {
      Toast.show({
        type: "customToast",
        props: {
          getCurrentColors: getCurrentColors(),
          title: "Já existe uma pasta com o mesmo nome!",
          duration: 3000
        },
        visibilityTime: 3000,
        autoHide: true
      })
      return
    }

    updateFolder(selectedFolders[0], { title: actionsNoteText })

    setFolderActions(true)

    closeActionsFolderSheet()

    deselectAllFolders()

    Toast.show({
      type: "customToast",
      props: {
        getCurrentColors: getCurrentColors(),
        title: "Pasta editada com sucesso!",
        duration: 3000
      },
      visibilityTime: 3000,
      autoHide: true
    })
  }

  useEffect(() => {
    if (actionsFolderSheetOpen) {
      setFolderActions(false)
    }
  }, [actionsFolderSheetOpen])

  return (
    <BottomSheet
      isVisible={actionsFolderSheetOpen}
      snap={[280]}
      title={actionMode === "AddFolder" ? "Adicionar Pasta" : "Editar Pasta"}
      onClose={() => {
        setActionsNoteText("")
        closeActionsFolderSheet()

        if (!folderActions && actionMode !== "AddFolder") {
          setShowActions(true)
        }
      }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
    >
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          marginHorizontal: 20
        }}
      >
        <BottomSheetTextInput
          style={{
            marginTop: 10,
            color: getCurrentColors().colors.onBackground,
            borderRadius: 15,
            fontSize: 16,
            padding: 15,
            borderWidth: 2,
            borderColor: getCurrentColors().colors.primary
          }}
          outlineColor={getCurrentColors().colors.primary}
          selectionColor={`rgba(${rgbStringToObject(getCurrentColors().colors.primary)}, 0.6)`}
          cursorColor={getCurrentColors().colors.primary}
          placeholder={"Nome da pasta"}
          placeholderTextColor={getCurrentColors().colors.outline}
          value={actionsNoteText}
          onChangeText={setActionsNoteText}
          autoFocus
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
            onPress={closeActionsFolderSheet}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            disabled={!actionsNoteText}
            textColor="white"
            style={{ flex: 1, borderRadius: 10 }}
            onPress={() => {
              if (actionMode === "AddFolder") {
                handleAddFolder()
              } else {
                handleEditFolder()
              }
            }}
          >
            {actionMode === "AddFolder" ? "Adicionar" : "Editar"}
          </Button>
        </View>
      </View>
    </BottomSheet>
  )
}

const BottomSheetDeleteFolders = ({
  bottomSheetTitle,
  title,
  deleteFolderSheetOpen,
  closeDeleteFolderSheet,
  onPress,
  setShowActions
}) => {
  const [deleting, setDeleting] = useState(false)

  const onCancelPress = () => {
    if (setShowActions) {
      setShowActions(true)
    }

    closeDeleteFolderSheet()
  }

  const onDeletePress = () => {
    setDeleting(true)

    closeDeleteFolderSheet()

    onPress()
  }

  useEffect(() => {
    if (deleteFolderSheetOpen) {
      setDeleting(false)
    }
  }, [deleteFolderSheetOpen])

  return (
    <BottomSheet
      isVisible={deleteFolderSheetOpen}
      title={bottomSheetTitle}
      snap={[250]}
      onClose={() => {
        closeDeleteFolderSheet()

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

const AllFolders = () => {
  const navigation = useNavigation()

  const insets = useSafeAreaInsets()

  const { getCurrentColors } = useTheme()

  const flashListRef = useRef(null)

  const { getFolderNameById, selectedFolder, selectFolder, deleteFolder, folders } = useFolders()
  const [selectedFolders, setSelectedFolders] = useState([])

  const { deleteNotesByFolderId, getTotalNotesByFolder } = useNotes()

  const [actionMode, setActionMode] = useState("AddFolder")

  const [showActions, setShowActions] = useState(false)
  const [hideFabButton, setHideFabButton] = useState(false)

  const marginBottomAnimation = useSharedValue(0)
  const allFoldersMarginBottomAnimatedStyle = useAnimatedStyle(() => {
    return {
      marginBottom: withTiming(marginBottomAnimation.value)
    }
  })

  const [actionsNoteText, setActionsNoteText] = useState("")

  const [actionsFolderSheetOpen, setActionsFolderSheetOpen] = useState(false)
  const openActionsFolderSheet = () => {
    setShowActions(false)
    setActionsFolderSheetOpen(true)
  }
  const closeActionsFolderSheet = () => setActionsFolderSheetOpen(false)

  const handleDeleteFolder = () => {
    if (selectedFolders.includes(selectedFolder)) {
      selectFolder(1)
    }

    deleteFolder(selectedFolders)
    deleteNotesByFolderId(selectedFolders)

    Toast.show({
      type: "customToast",
      props: {
        getCurrentColors: getCurrentColors(),
        title: "Pasta(s) eliminada(s) com sucesso!",
        duration: 3000
      },
      visibilityTime: 3000,
      autoHide: true
    })

    deselectAllFolders()
  }

  const [deleteFolderSheetOpen, setDeleteFolderSheetOpen] = useState(false)
  const openDeleteFolderSheet = () => {
    setShowActions(false)
    setDeleteFolderSheetOpen(true)
  }
  const closeDeleteFolderSheet = () => setDeleteFolderSheetOpen(false)

  const getDeleteFolderTitleText = () => {
    const numSelected = selectedFolders.length
    if (numSelected === 1) {
      return "Eliminar 1 pasta?"
    } else {
      return `Eliminar ${numSelected} pastas?`
    }
  }

  const renderFolderItem = ({ item, index }) => {
    return (
      <FolderCard
        item={item}
        index={index}
        selectedFolder={selectedFolder === item.id}
        totalNotes={getTotalNotesByFolder(item.id)}
        hasSelectedFolders={hasSelectedFolders()}
        selected={getSelectedFolder(item)}
        onPress={() => handleOnPressFolder(item)}
        onLongPress={() => handleOnLongPressFolder(item, index)}
      />
    )
  }

  const selectFolders = (folder) => {
    setSelectedFolders((prevSelected) => {
      if (prevSelected.includes(folder.id)) {
        return prevSelected.filter((folderItem) => folderItem !== folder.id)
      }
      return [...prevSelected, folder.id]
    })
  }

  const deselectAllFolders = () => {
    setSelectedFolders([])
  }

  const selectAllFolders = () => {
    const allFolderIds = folders.map((folder) => folder.id)
    const filteredFolderIds = allFolderIds.slice(2)
    setSelectedFolders(filteredFolderIds)
  }

  const getNoteTitleText = () => {
    const numSelected = selectedFolders.length
    if (numSelected === 0) {
      return "0 pastas selecionadas"
    } else if (numSelected === 1) {
      return "1 pasta selecionada"
    } else {
      return `${numSelected} pastas selecionadas`
    }
  }

  const isAllFoldersSelected = () => {
    const folderIds = folders.map((folder) => folder.id)
    const selectedWithoutMainFolders = selectedFolders.filter(
      (folderId) => folderId !== "1" && folderId !== "2"
    )
    return selectedWithoutMainFolders.length === folderIds.length - 2
  }

  const hasSelectedFolders = () => selectedFolders.length !== 0

  const handleOnPressFolder = (folder) => {
    if (selectedFolders.length) {
      if (folder.id !== 1 && folder.id !== 2) {
        selectFolders(folder)
      }
    } else {
      selectFolder(folder.id)
      setTimeout(() => {
        navigation.goBack()
      }, 400)
    }
  }

  const handleOnLongPressFolder = (folder, index) => {
    if (!selectedFolders.length && folder.id !== 1 && folder.id !== 2) {
      selectFolders(folder)

      if (index === folders.length - 1) {
        setTimeout(() => {
          flashListRef?.current?.scrollToEnd({ animated: true })
        }, 400)
      }
    }
  }

  const getSelectedFolder = (folder) => selectedFolders.includes(folder.id)

  useEffect(() => {
    if (selectedFolders.length) {
      marginBottomAnimation.value = insets.bottom + 85
      setHideFabButton(true)
      setShowActions(true)
    } else {
      marginBottomAnimation.value = 0
      setHideFabButton(false)
      setShowActions(false)
    }
  }, [selectedFolders])

  useEffect(() => {
    const handleBackPress = () => {
      if (showActions) {
        setShowActions(false)
        return false
      }
    }

    const backHandlerListener = BackHandler.addEventListener("hardwareBackPress", handleBackPress)

    return () => {
      backHandlerListener.remove()
    }
  }, [showActions])

  const keyExtractor = useCallback((item, _) => item.id)

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppBarContent title="Pastas" />
      {showActions && (
        <Portal>
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Appbar.Header mode="center-aligned">
              <Appbar.Action icon="close" onPress={deselectAllFolders} />
              <Appbar.Content title={getNoteTitleText()} titleStyle={{ fontWeight: "700" }} />
              <Appbar.Action
                icon="playlist-check"
                onPress={selectAllFolders}
                color={isAllFoldersSelected() ? getCurrentColors().colors.primary : undefined}
              />
            </Appbar.Header>
          </Animated.View>
        </Portal>
      )}
      <Animated.View style={[allFoldersMarginBottomAnimatedStyle, { flex: 1 }]}>
        <View
          style={{
            flex: 1,
            marginHorizontal: 20,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            overflow: "hidden"
          }}
        >
          <FlashList
            ref={flashListRef}
            data={folders}
            extraData={selectFolders}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
            estimatedItemSize={80}
            renderItem={renderFolderItem}
          />
        </View>
      </Animated.View>
      <BottomSheetModalMoreActions isVisible={showActions}>
        <Animated.View
          layout={Layout}
          entering={FadeIn}
          exiting={FadeOut}
          style={{ flexDirection: "row", justifyContent: "center", gap: 35 }}
        >
          {selectedFolders.length < 2 && (
            <Animated.View entering={FadeIn} exiting={FadeOut}>
              <TouchableOpacity
                onPress={() => {
                  setActionsNoteText(getFolderNameById(selectedFolders[0]))
                  setActionMode("EditFolder")
                  openActionsFolderSheet()
                }}
              >
                <View style={{ alignItems: "center", gap: 5 }}>
                  <Icon name="square-edit-outline" color="#9897ba" size={23} />
                  <Text variant="labelMedium">Editar</Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <TouchableOpacity onPress={openDeleteFolderSheet}>
              <View style={{ alignItems: "center", gap: 5 }}>
                <Icon name="trash-can-outline" color="#9897ba" size={23} />
                <Text variant="labelMedium">Eliminar</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </BottomSheetModalMoreActions>
      {!hideFabButton && (
        <Animated.View
          entering={ZoomIn}
          exiting={ZoomOut}
          style={{
            position: "absolute",
            bottom: useSafeAreaInsets().bottom + 40,
            right: 40
          }}
        >
          <PressableScale
            onPress={() => {
              setActionMode("AddFolder")
              openActionsFolderSheet()
            }}
          >
            <FAB
              icon="plus"
              color="white"
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 60,
                height: 60,
                borderRadius: 9999,
                backgroundColor: getCurrentColors().colors.primary
              }}
            />
          </PressableScale>
        </Animated.View>
      )}
      <BottomSheetFolderActions
        actionsNoteText={actionsNoteText}
        selectedFolders={selectedFolders}
        setShowActions={setShowActions}
        actionMode={actionMode}
        getCurrentColors={getCurrentColors}
        actionsFolderSheetOpen={actionsFolderSheetOpen}
        closeActionsFolderSheet={closeActionsFolderSheet}
        setActionsNoteText={setActionsNoteText}
        deselectAllFolders={deselectAllFolders}
      />
      <BottomSheetDeleteFolders
        bottomSheetTitle="Eliminar Pasta(s)"
        title={getDeleteFolderTitleText()}
        deleteFolderSheetOpen={deleteFolderSheetOpen}
        closeDeleteFolderSheet={closeDeleteFolderSheet}
        onPress={handleDeleteFolder}
        setShowActions={setShowActions}
      />
    </KeyboardAvoidingView>
  )
}

export default memo(AllFolders)
