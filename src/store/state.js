import {playMode} from "../common/js/config";
import {loadHistory,loadFavorite,loadPlayHistory} from "../common/js/cache";

const state = {
  singer: {},
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  currentIndex: -1,
  mode: playMode.sequence,
  searchHistory: loadHistory(),
  showMsg: false,
  msgText: '',
  favoriteList: loadFavorite(),
  playHistory: loadPlayHistory()
}

export default state
