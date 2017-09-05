import * as mutations from './mutation-types'

import Vue from 'vue'
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage)

export default {
  [mutations.SOCKET_GETCUTISFEEDBACK] (state, data) {
    if (Vue.localStorage.get('auth').user.npm === data.npm) {
      state.cutis = data.resp.data
    }
  },
  // [mutations.SOCKET_UPLOADCUTIFEEDBACKS] (state, data) {
  //   if (Vue.localStorage.get('auth').user.npm === data.npm) {
  //     if (data.resp.success === false) {
  //       state.uploadFeedback = 2
  //     } else {
  //       state.uploadFeedback = 3
  //     }
  //   }
  // },
  [mutations.TEST] (state, data) {
    // asd
  }
}
