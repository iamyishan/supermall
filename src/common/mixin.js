import {debounce} from  "common/utils"

//混入的基本使用
export const itemListenerMixin={
  data(){
    return {
      itemImageListenser: null
    }
  },
  mounted(){
    // 1.图片加载完成的事件监听
    const refresh = debounce(this.$refs.scroll.refresh, 50)
    //  对监听事件进行保存
    this.itemImageListenser = () => {
      refresh()
    }
    this.$bus.$on('itemImageLoad', this.itemImageListenser)
  }
}

// 回到顶部抽成混入
export const backTopMixin={
  data() {
    return {
      showBackTop:false
    }
  }
}
