<template>
  <div class="goods-item" @click="itemClick">
    <img :src="getImg" @load="imageLoad"/>
    <div class="goods-info">
      <p>{{ goodsItem.title }}</p>
      <span class="price">{{ goodsItem.price }}</span>
      <span class="collect">{{ goodsItem.cfav }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "GoodsListItem",
  props: {
    goodsItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    imageLoad() {
      //非父子组件通信,事件总线通信
      //思路1：通过路由区分不同的页面发出不同的事件
      // if(this.$route.path.indexOf("/home")){
      //   this.$bus.$emit('homeItemImageLoad')
      // }else if(this.$route.path.indexOf("/detail")){
      //   this.$bus.$emit('detailItemImageLoad')
      // }
      this.$bus.$emit('itemImageLoad')

    },
    itemClick() {
      // 2.跳转到详情页面
      this.$router.push("/detail/"+this.goodsItem.iid)
    }
  },
  computed:{
    getImg(){
      return this.goodsItem.image||this.goodsItem.img||this.goodsItem.show.img
    }
  }

}
</script>

<style scoped>
.goods-item {
  padding-bottom: 40px;
  position: relative;
  width: 48%;
}

.goods-item img {
  width: 100%;
  border-radius: 5px;
}

.goods-info {
  font-size: 12px;
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  overflow: hidden;
  text-align: center;
}

.goods-info .price {
  color: var(--color-high-text);
  margin-right: 20px;
}

.goods-info .collect {
  position: relative;
}

.goods-info .collect::before {
  content: '';
  position: absolute;
  left: -15px;
  top: -1px;
  width: 14px;
  height: 14px;
  background: url("~assets/img/common/collect.svg") 0 0/14px 14px;
}
</style>
