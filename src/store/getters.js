export const singer = state => state.singer

export const playList = state => state.playList

export const fullScreen = state => state.fullScreen

export const sequenceList = state => state.sequenceList

export const currentIndex = state => state.currentIndex

export const playing = state => state.playing

export const mode = state =>state.mode

export const currentSong = state => state.playList[state.currentIndex] || {}

export const searchHistory = state => state.searchHistory

export const showMsg = state => state.showMsg

export const msgText = state => state.msgText

export const favoriteList = state => state.favoriteList

export const playHistory = state => state.playHistory
