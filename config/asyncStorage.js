import AsyncStorage from "@react-native-async-storage/async-storage"

export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch ({ error }) {
    console.error(error)
  }
}

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch ({ error }) {
    console.error(error)
  }
}

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key)
  } catch (error) {
    console.error(error)
  }
}
