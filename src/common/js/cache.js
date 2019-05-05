import storage from 'good-storage'

const historyKey = '__history__'
const favoriteKey = '__favorite__'
const playHistoryKey = '__play_history__'
const MAX = 15

function insertQuery(lists, query, compare, max_len) {
  let index = lists.findIndex(compare)
  if (index === 0)
    return
  else if (index !== -1)
    lists.splice(index, 1)
  lists.unshift(query)
  if (lists.length > max_len)
    lists.pop()
}

function deleteFromArray(list, query, compare) {
  let index = list.findIndex(compare)
  list.splice(index, 1)
}

export function saveHistory(query) {
  let searches = storage.get(historyKey, [])
  insertQuery(searches, query, (item) => {
    return item === query
  }, MAX)
  storage.set(historyKey, searches)
  return searches
}

export function loadHistory() {
  return storage.get(historyKey, [])
}

export function deleteOne(query) {
  let searches = storage.get(historyKey, [])
  deleteFromArray(searches, query, (item) => {
    return item === query
  })
  storage.set(historyKey, searches)
  return searches
}

export function clearAll() {
  storage.set(historyKey, [])
  return []
}

export function saveFavorite(song) {
  let favorite = storage.get(favoriteKey, [])
  insertQuery(favorite, song, (item) => {
    return song.ntId === item.ntId && song.qqId === item.qqId
  }, 100)
  storage.set(favoriteKey, favorite)
  return favorite
}

export function loadFavorite() {
  return storage.get(favoriteKey, [])
}

export function deleteFavorite(song) {
  let favorite = storage.get(favoriteKey, [])
  let index = favorite.findIndex((item) => song.ntId === item.ntId && song.qqId === item.qqId)
  favorite.splice(index, 1)
  storage.set(favoriteKey, favorite)
  return favorite
}

export function loadPlayHistory() {
  return storage.get(playHistoryKey, [])
}

export function savePlayHistory(song) {
  let playHistory = storage.get(playHistoryKey, [])
  insertQuery(playHistory, song, (item) => {
    return song.ntId === item.ntId && song.qqId === item.qqId
  }, 100)
  storage.set(playHistoryKey, playHistory)

  return playHistory
}
