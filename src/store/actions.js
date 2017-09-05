import * as mutation from './mutation-types.js'

export default {
  test (context, param) {
    context.commit(mutation.TEST, param)
  }
}
