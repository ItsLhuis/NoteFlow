import React, { createContext, useContext, useState } from "react"

import { getData, storeData } from "config/asyncStorage"

const FoldersContext = createContext()

export const FoldersProvider = ({ children }) => {
  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState(null)

  const addFolder = async (folder) => {
    setFolders((prevFolders) => [...prevFolders, folder])

    const existingFolders = (await getData("allFolders")) || []
    const updatedFolders = [...existingFolders, folder]
    await storeData("allFolders", updatedFolders)
  }

  const updateFolder = async (folderId, updatedProperties) => {
    const updatedFolders = folders.map((folder) =>
      folder.id === folderId ? { ...folder, ...updatedProperties } : folder
    )

    setFolders(updatedFolders)

    await storeData("allFolders", updatedFolders)
  }

  const selectFolder = async (folderId) => {
    setSelectedFolder(folderId)

    await storeData("folderSelected", folderId)
  }

  const folderExists = (folderName, folderId) => {
    return folders.some((folder) => folder.title === folderName && folder.id !== folderId)
  }

  const deleteFolder = async (foldersId) => {
    const updatedFolders = folders.filter((folder) => !foldersId.includes(folder.id))
    
    setFolders(updatedFolders)

    await storeData("allFolders", updatedFolders)
  }

  const getFolderNameById = (folderId) => {
    const folder = folders.find((folder) => folder.id === folderId)
    return folder ? folder.title : null
  }

  const getNextFolderId = () => {
    const maxId = folders.reduce((max, folder) => (folder.id > max ? folder.id : max), 0)
    return maxId + 1
  }

  return (
    <FoldersContext.Provider
      value={{
        folders,
        setFolders,
        addFolder,
        updateFolder,
        selectFolder,
        selectedFolder,
        folderExists,
        deleteFolder,
        getFolderNameById,
        getNextFolderId
      }}
    >
      {children}
    </FoldersContext.Provider>
  )
}

export const useFolders = () => {
  return useContext(FoldersContext)
}
