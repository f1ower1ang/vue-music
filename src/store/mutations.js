import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_FULLSCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYING](state, flag) {
    state.playing = flag
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_SHOW_MESSAGE](state, flag) {
    state.showMsg = flag
  },
  [types.SET_MESSAGE_TEXT](state, text) {
    state.msgText = text
  },
  [types.SET_FAVORITE_LIST](state, favor) {
    state.favoriteList = favor
  },
  [types.SET_PLAY_HISTORY](state, list){
    state.playHistory = list
  }
}

export default mutations
