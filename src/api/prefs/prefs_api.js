import axios from 'axios'

export const savePreferences = (PREF_OBJECT) => {
  localStorage.setItem(PREF_OBJECT.KEY, JSON.stringify(PREF_OBJECT))
  return Promise.resolve(getPreferences(PREF_OBJECT.KEY))
}

export const getPreferences = (PREF_OBJECT_KEY) => {
  return Promise.resolve(JSON.parse(localStorage.getItem(PREF_OBJECT_KEY)))
}
