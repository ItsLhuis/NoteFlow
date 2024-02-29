import React, { createContext, useContext, useState } from "react"

import * as Notifications from "expo-notifications"

import { getData, storeData } from "config/asyncStorage"

import { useUserSettings } from "../contexts/userSettingsContext"

const NotesContext = createContext()

export const NotesProvider = ({ children }) => {
  const { userSettings } = useUserSettings()

  const [notes, setNotes] = useState([])

  const [searchText, setSearchText] = useState("")

  const addNote = async (note, selectedFolder) => {
    note.folder = note.folder ? note.folder : selectedFolder

    const existingNotes = (await getData("allNotes")) || []
    const isNoteAlreadyExists = existingNotes.some((existingNote) => existingNote.id === note.id)

    if (!isNoteAlreadyExists) {
      setNotes((prevNotes) => [...prevNotes, note])

      const updatedNotes = [...existingNotes, note]

      await storeData("allNotes", updatedNotes)
    }
  }

  const updateAllNotes = async (updatedNotes) => {
    const updatedAllNotes = notes.map(
      (note) => updatedNotes.find((updatedNote) => updatedNote.id === note.id) || note
    )

    setNotes(updatedAllNotes)

    await storeData("allNotes", updatedAllNotes)
  }

  const updateNote = async (noteId, updatedProperties) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, ...updatedProperties } : note
    )

    setNotes(updatedNotes)

    await storeData("allNotes", updatedNotes)
  }

  const removeFieldsFromNote = async (noteId, fieldsToRemove) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === noteId) {
        const updatedNote = { ...note }

        if (fieldsToRemove) {
          fieldsToRemove.forEach((field) => {
            delete updatedNote[field]
          })
        }

        return updatedNote
      }

      return note
    })

    setNotes(updatedNotes)

    await storeData("allNotes", updatedNotes)
  }

  const moveToFolder = async (noteIds, folderId) => {
    const updatedNotes = notes.map((note) => {
      if (noteIds.includes(note.id)) {
        return { ...note, folder: folderId }
      }
      return note
    })

    setNotes(updatedNotes)

    await storeData("allNotes", updatedNotes)
  }

  const cancelScheduledNotification = async (noteId) => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync()

    const notificationsToCancel = scheduledNotifications.filter(
      (notification) => notification.content.data.noteId === noteId
    )

    await Promise.all(
      notificationsToCancel.map(async (notification) => {
        const notificationIdToCancel = notification.identifier
        await Notifications.cancelScheduledNotificationAsync(notificationIdToCancel)
      })
    )
  }

  const deleteNote = async (noteIds) => {
    const updatedNotes = notes.filter((note) => !noteIds.includes(note.id))

    setNotes(updatedNotes)

    await storeData("allNotes", updatedNotes)

    await Promise.all(noteIds.map((noteId) => cancelScheduledNotification(noteId)))
  }

  const deleteNotesByFolderId = async (folderIds) => {
    const notesToDelete = notes.filter((note) => folderIds.includes(note.folder))

    const noteIdsToDelete = notesToDelete.map((note) => note.id)

    const updatedNotes = notes.filter((note) => !noteIdsToDelete.includes(note.id))

    setNotes(updatedNotes)

    await storeData("allNotes", updatedNotes)

    await Promise.all(noteIdsToDelete.map((noteId) => cancelScheduledNotification(noteId)))
  }

  const getNotesByFolder = (selectedFolder) => {
    const sortOrder = userSettings.sortOrder

    let filteredNotes

    if (selectedFolder === 1) {
      filteredNotes = [...notes]
    } else {
      filteredNotes = notes.filter((note) => note.folder === selectedFolder)
    }

    if (searchText.trim() !== "") {
      const searchLower = searchText.toLowerCase()
      filteredNotes = filteredNotes.filter(
        (note) =>
          (note.title && note.title.toLowerCase().includes(searchLower)) ||
          (note.description && note.description.toLowerCase().includes(searchLower))
      )
    }

    filteredNotes.sort((a, b) => {
      if (a.fixed && !b.fixed) {
        return -1
      } else if (!a.fixed && b.fixed) {
        return 1
      }

      if (sortOrder === "modificationDate") {
        return new Date(b.modificationDate) - new Date(a.modificationDate)
      } else if (sortOrder === "creationDate") {
        return new Date(b.creationDate) - new Date(a.creationDate)
      }

      return 0
    })

    return filteredNotes
  }

  const getNoteById = (noteId) => {
    const note = notes.find((note) => note.id === noteId)

    return note || false
  }

  const getTotalNotesByFolder = (folderId) => {
    if (folderId === 1) {
      return notes.length
    }

    const notesInFolder = notes.filter((note) => note.folder === folderId)
    return notesInFolder.length
  }

  const getNextNoteId = () => {
    const maxId = notes.reduce((max, note) => (note.id > max ? note.id : max), 0)
    return maxId + 1
  }

  const areNotesEqual = (noteId, updatedProperties) => {
    const existingNote = notes.find((note) => note.id === noteId)

    if (!existingNote) {
      return false
    }

    return (
      existingNote.title === updatedProperties.title &&
      existingNote.description === updatedProperties.description
    )
  }

  const getNoteTitleOrDescription = (noteId) => {
    const note = notes.find((note) => note.id === noteId)

    if (note) {
      return note.title || note.description || "Untitled Note"
    }

    return "Note Not Found"
  }

  const getReminderDateByNoteId = (noteId) => {
    const note = notes.find((note) => note.id === noteId)

    if (!note || !note.reminderDate || new Date(note.reminderDate) < new Date()) {
      return false
    }

    return note.reminderDate
  }

  return (
    <NotesContext.Provider
      value={{
        setNotes,
        searchText,
        setSearchText,
        addNote,
        updateAllNotes,
        updateNote,
        removeFieldsFromNote,
        moveToFolder,
        deleteNote,
        deleteNotesByFolderId,
        getNotesByFolder,
        getNoteById,
        getTotalNotesByFolder,
        getNextNoteId,
        areNotesEqual,
        getNoteTitleOrDescription,
        getReminderDateByNoteId
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = () => {
  return useContext(NotesContext)
}
