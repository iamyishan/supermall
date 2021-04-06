import {ADD_COUNTER, ADD_TO_CART} from "./mutation-types"

const actions = {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // // 1.查看是否添加过
      let oldProduct=context.state.cartList.find(item=>item.iid===payload.iid)
      if(oldProduct){ //数量+1
        // oldProduct.counter+=1
        context.commit(ADD_COUNTER,oldProduct)
        resolve("当前的商品数量加+1")
      }else { //添加新商品
        payload.count=1
        payload.checked=true
        context.commit(ADD_TO_CART,payload)
        resolve("添加了新商品")
      }
      reject("失败了")
    })
  }
}
export default actions
