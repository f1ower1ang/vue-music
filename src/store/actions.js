import * as types from './mutation-types'
import {playMode} from '../common/js/config'
import {shuffle} from "../common/js/utils";
import {saveHistory, deleteOne, clearAll, saveFavorite, deleteFavorite, savePlayHistory} from "../common/js/cache";

function findIndex(list, item) {
  return list.findIndex((cur) => {
    return cur.qqId === item.qqId && cur.ntId === item.ntId
  })
}

export function selectPlay({commit, state}, {list, index}) {
  commit(types.SET_PLAYING, true)
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_MODE, playMode.sequence)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYLIST, list)
}

export function randomPlay({commit, state}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYLIST, shuffle(list))
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_MODE, playMode.random)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

export function insertSong({commit, state}, song) {
  let playList = state.playList.slice()
  let currentIndex = state.currentIndex
  let sequenceList = state.sequenceList.slice()

  let currentSong = playList[currentIndex]

  let pIndex = findIndex(playList, song)
  currentIndex++
  if (pIndex > -1) {
    if (pIndex < currentIndex) {
      currentIndex--
    }
    playList.splice(pIndex, 1)
  }
  playList.splice(currentIndex, 0, song)

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let sIndex = findIndex(sequenceList, song)
  if (sIndex > -1) {
    if (sIndex < currentSIndex) {
      currentSIndex--
    }
    sequenceList.splice(sIndex, 1)
  }
  sequenceList.splice(currentSIndex, 0, song)

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
}

export function addToNext({commit, state}, song) {
  if (state.currentIndex === -1) {
    commit(types.SET_SEQUENCE_LIST, [song])
    commit(types.SET_PLAYLIST, [song])
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING, true)
    return
  }

  let playList = state.playList.slice()
  let currentIndex = state.currentIndex
  let sequenceList = state.sequenceList.slice()

  let currentSong = playList[currentIndex]

  currentIndex++

  playList.splice(currentIndex, 0, song)

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  sequenceList.splice(currentSIndex, 0, song)

  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
}

export function setHistory({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveHistory(query))
}

export function deleteHistory({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteOne(query))
}

export function clearHistory({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearAll())
}

export function saveFavor({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export function deleteFavor({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

export function clearSong({commit}) {
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYING, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

export function deleteSong({commit, state}, {song, index}) {
  let sequenceList = state.sequenceList.slice()
  let playList = state.playList.slice()
  let currentIndex = state.currentIndex
  let mode = state.mode

  if (currentIndex > index) {
    currentIndex--
  }

  playList.splice(index, 1)

  if (mode !== playMode.random)
    sequenceList.splice(index, 1)
  else {
    let sIndex = sequenceList.findIndex((item) => item.qqId === song.qqId && item.ntId === song.ntId)
    sequenceList.splice(sIndex, 1)
  }

  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playList)
  if (playList.length === 0) {
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING, false)
  }
}

export function savePlayHis({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlayHistory(song))
}
