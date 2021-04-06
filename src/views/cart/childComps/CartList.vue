<template>
  <div class=" cart-list">
    <scroll class="content" ref="scroll"
            :probe-type="3"
            :pull-up-load="true">
      <cart-list-item v-for="(item,index) in cartList" :key="index"
                      :item-info="item"/>

    </scroll>
  </div>

</template>

<script>
import Scroll from "components/common/scroll/Scroll"
import CartListItem from "./CartListItem";

export default {
  name: "childComps",
  components: {
    CartListItem,
    Scroll
  },
  computed: {
    cartList() {
      return this.$store.getters.cartList
    }
  },
  activated() {
    this.$refs.scroll.refresh()
  }

}
</script>

<style scoped>
.cart-list {
  height: calc(100% - 44px - 49px - 44px);
}

.content {
  height: 100%;
  overflow: hidden;
}
</style>
