<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button class="check-button" @click.native="checkBtnClick" :ischecked="isSelectAll"></check-button>
      <span>全选</span>
    </div>

    <span class="total-price">合计: ¥{{ totalPrice }}</span>
    <span class="buy-product" @click="clickBuy">去计算({{ cartCount }})</span>

  </div>
</template>

<script>
import CheckButton from "@/views/cart/childComps/CheckButton";

export default {
  name: "BottomBar",
  components: {
    CheckButton
  },
  computed: {
    totalPrice() {
      const cartList = this.$store.getters.cartList;
      return cartList.filter(item => {
        return item.checked
      }).reduce((preValue, item) => {
        return preValue + item.count * item.newPrice
      }, 0).toFixed(2)
    },
    cartCount() {
      return this.$store.getters.cartCount
    },
    isSelectAll() {
      const cartList = this.$store.getters.cartList;
      // 1.判断是否全选中
      //方式一
      // if (cartList.length === 0) return false
      // return !(cartList.find(item=>!item.checked))
      //方式二
      return !(cartList.filter(item=>!item.checked).length>0)

      // 方式三
      // return cartList.find(item => item.checked === false) === undefined;
    }

  },
  methods: {
    checkBtnClick() {
      const cartList = this.$store.getters.cartList;
      if(this.isSelectAll){ //全部选择
        cartList.forEach(item=>item.checked=false)
      }else {//部分或全部不选择
        cartList.forEach(item=>item.checked=true)
      }
      return true
    },
    clickBuy(){
      if (this.isSelectAll){
        this.$toast.show("已经全部勾选结算")
      }else {
        this.$toast.show("未全部勾选结算")
      }
    }


  }
}
</script>

<style scoped>
.bottom-bar {
  position: relative;
  display: flex;

  height: 44px;
  line-height: 44px;

  background-color: #eee;
}

.bottom-bar .check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}

.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}

.bottom-bar .total-price {
  margin-left: 30px;
  flex: 1;
}

.bottom-bar .buy-product {
  width: 90px;
  background-color: var(--color-tint);
  text-align: center;
}
</style>
