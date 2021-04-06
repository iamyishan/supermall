import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types"

const mutations = {
  // mutations唯一的目的就是修改state中的状态，每个方法比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    state.cartList.push(payload)
  }
}
export default mutations
