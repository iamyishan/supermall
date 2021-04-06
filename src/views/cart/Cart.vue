<template>
  <div id="cart">
    <!--    顶部导航-->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartCount }})</div>
    </nav-bar>
    <!--    购物车-->
    <cart-list class="cart-list"></cart-list>
    <!--底部导航-->
    <bottom-bar></bottom-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList"
import BottomBar from "@/views/cart/childComps/BottomBar";

export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    BottomBar
  },
  computed: {
    cartCount() {
      return this.$store.getters.cartCount
    }
  }
}
</script>

<style scoped>
#cart {
  /*position: relative;*/
  height: 100vh;
}

.nav-bar {
  background-color: var(--color-tint);
  font-weight: 700;
  color: #fff;
}
</style>
