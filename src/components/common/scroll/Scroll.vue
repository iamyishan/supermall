<template>
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'

export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0
    },
    pullUpLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scroll: null,
    }
  },
  mounted() {
    // 1.创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      probeType: this.probeType, //1滑动位置不监听;2位置监听;3位置监听,且有惯性效果
      click: true,//div事件绑定才有效
      pullUpLoad: this.pullUpLoad //上拉加载
    })

    // 2.监听滚动的位置
    this.scroll.on('scroll', (position) => {
      // console.log(position);
      this.$emit('scroll', position)
    })
    // 3.监听上拉事件
    if (this.scroll) {
      this.scroll.on("pullingUp", () => {
        this.$emit("pullingUp")
      })
    }
  },
  methods: {
    finishPullUp() {
      this.scroll.finishPullUp()
    },
    scrollTo(x, y, time = 300) {
      this.scroll.scrollTo(x, y, time)
    },
    refresh() {
      this.scroll && this.scroll.refresh()
    }
  }

}
</script>

<style scoped>

</style>
