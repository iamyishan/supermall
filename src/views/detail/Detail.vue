<template>
  <div id="detail">
    <detail-nav-bar ref="nav" class="detail-nav" @itemClick="titleClick"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true">
      <!--   topImages会解析为全小写topimages ，所以用top-images靠谱些  -->
      <detail-swiper ref="base" :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo"
                         @imageLoad="imageLoad"/>
      <detail-param-info ref="param" :param-info="paramInfo"/>
      <detail-comment-info ref="comment"
                           :comment-info="commentInfo"/>
      <detail-recommend-info ref="recommend"
                             :recommend-list="recommendList"/>
      <!--      <goods-list :goods="recommendList"/>-->
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backTop" v-show="showBackTop"></back-top>
  </div>

</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailRecommendInfo from './childComps/DetailRecommendInfo'
import DetailBottomBar from "./childComps/DetailBottomBar"
// import GoodsList from "@/components/content/goods/GoodsList";

import Scroll from "components/common/scroll/Scroll";
import BackTop from "components/content/backTop/BackTop";

import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "@/network/detail";
import {itemListenerMixin, backTopMixin} from "common/mixin"
import {mapActions} from 'vuex'

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    DetailRecommendInfo,
    DetailBottomBar,
    // GoodsList,
    Scroll,
    BackTop,
  },
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommendList: [],
      themeTopYs: [],
      currentIndex: 0
    }
  },
  created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.iid
    // 2.根据iid请求详情数据
    getDetail(this.iid).then(res => {
      // 2.1.获取结果
      console.log(res);
      const data = res.result;
      // 2.2.获取顶部信息
      this.topImages = data.itemInfo.topImages
      // 2.3获取商品信息
      this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)
      // 2.4.获取店铺信息
      this.shop = new Shop(data.shopInfo)

      // 2.5.获取商品详情
      this.detailInfo = data.detailInfo;
      // 2.6.获取参数的信息
      this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
      // 2.7.保存评论信息
      if (data.rate.list) {
        this.commentInfo = data.rate.list[0];
      }
      //1.第一次获取,值不对
      //值不对的原因：this.$refs.base.$el压根没有渲染
      // this._getOffsetTop()
      // console.log(this.themeTopYs)
    })
    //3.请求推荐数据
    getRecommend().then((res, error) => {
      if (error) return
      this.recommendList = res.data.list
    })

    // this.nextTick(()=>{
    //   //1.第二次获取,值不对
    //   //值不对的原因：图片没有计算在内
    //   // this._getOffsetTop()
    //   // console.log(this.themeTopYs)
    // })


  },
  mixins: [itemListenerMixin, backTopMixin],
  mounted() {
    // 使用混入代替了
    // let refresh = debounce(this.$refs.scroll.refresh, 100)
    // this.itemImageListenser = () => {
    //   refresh()
    // }
    // this.$bus.$on('itemImageLoad', this.itemImageListenser)

  },
  destroyed() {
    this.$bus.$off("itemImageLoad", this.itemImageListenser)
  },
  updated() {
    // 获取需要的四个offsetTop
  },
  methods: {
    ...mapActions(['addCart']),

    addToCart() {
      // 1.创建对象
      const obj = {}
      // 2.对象信息
      obj.iid = this.iid;
      obj.imgURL = this.topImages[0]
      obj.title = this.goods.title
      obj.desc = this.goods.desc;
      obj.newPrice = this.goods.realPrice;


      // 3.添加到Store中(promise,mapActions)
      //方法一
      // this.$store.dispatch('addCart', obj).then(res => {
      //     console.log(res)
      //   }
      // )
      //方法二：mapActions映射到method中,再直接调用
      this.addCart(obj).then(res => {
        // this.$toast继承了Vue
        this.$toast.show(res)
      })

    },
    backTop() {
      this.$refs.scroll.scrollTo(0, 0, 300);
    },
    _getOffsetTop() {
      this.themeTopYs = []
      this.themeTopYs.push(this.$refs.base.$el.offsetTop)
      this.themeTopYs.push(this.$refs.param.$el.offsetTop)
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
    },
    contentScroll(position) {
      /**
       * 判断的方案:
       *  方案一:
       *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
       *    优点: 不需要引入其他的内容, 通过逻辑解决
       *    缺点: 判断条件过长, 并且不容易理解
       *  方案二:
       *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
       *    优点: 简洁明了, 便于理解
       *    缺点: 需要引入一个较大的int数字
       * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
       * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
       */
        //  1.获取y值
      const positionY = -position.y
      let length = this.themeTopYs.length
      for (let i = 0; i < length; i++) {
        if (this.currentIndex !== i && ((i < length - 1 && positionY > this.themeTopYs[i] && positionY <= this.themeTopYs[i + 1])
          || (i === length - 1 && positionY > this.themeTopYs[i]))) {
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //  2.监听回到顶部
      this.showBackTop = -position.y > 1000

    },
    imageLoad() {
      //1. 图片加载完scroll刷新
      this.$refs.scroll.refresh()

      //2. 图片加载完获取每个主题到顶部的距离
      this._getOffsetTop()
      console.log(this.themeTopYs)
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index] + 44)
    }
  }
}
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}

.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}

.content {
  height: calc(100% - 44px);
}
</style>
