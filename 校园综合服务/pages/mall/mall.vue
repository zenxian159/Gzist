<template>
  <view class="container">
    <!-- 搜索框 -->
    <view class="search">
      <input
        type="text"
        v-model="searchKeyword"
        placeholder="搜索商品"
        @input="onSearchInput"
        @confirm="onSearch"
        class="search-input"
      />
      <button @click="onSearch">搜索</button>
    </view>

    <!-- 分类滑动 -->
    <scroll-view class="category-scroll" scroll-x>
      <view
        v-for="(category, index) in categories"
        :key="index"
        @click="onCategorySelect(category)"
        :class="['category-item', selectedCategory === category ? 'selected' : '']"
      >
        <text>{{ category }}</text>
      </view>
    </scroll-view>

    <!-- 商品列表（仅上拉加载） -->
    <scroll-view
      scroll-y
      class="product-list"
      style="height: 100vh;"
      @scrolltolower="loadMore"
      lower-threshold="50"
      :scroll-with-animation="true"
    >
      <view v-if="filteredProducts.length > 0" class="product-grid">
        <view
          v-for="item in filteredProducts"
          :key="item.trade_id"
          @click="toDetail(item.trade_id)"
          class="product-item"
        >
          <image
            :src="
              item.fileList[0].type === 'video'
                ? '/static/image/video-placeholder.png'
                : item.fileList[0].url
            "
            mode="aspectFill"
            class="product-image"
            lazy-load
            default-src="/static/image/loading-placeholder.png"
          />
          <view class="product-name">{{ item.title }}</view>
          <view class="product-price">￥{{ item.price }}</view>
          <view class="seller-info">
            <image :src="item.sellerAvatar" class="seller-avatar" />
            <text class="seller-name">{{ item.sellerName }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-message">
        <text>暂无商品，快去发布吧！</text>
      </view>

      <!-- 底部 loading -->
      <view v-if="loadingMore" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-if="!hasMore && filteredProducts.length > 0" class="no-more">
        <text>没有更多了</text>
      </view>
    </scroll-view>

    <!-- 菜单按钮 -->
    <view class="menu-button" @click="toggleMenu">
      <image src="/static/image/menu-icon.png" class="menu-icon" />
    </view>

    <!-- 功能菜单 -->
    <view class="menu-container">
      <view class="menu-item" :style="postAnimation" @click="navigateToPost">
        <image src="/static/image/post-icon.png" />
        <text>发布</text>
      </view>
      <view class="menu-item" :style="manageAnimation" @click="navigateToManage">
        <image src="/static/image/manage-icon.png" />
        <text>管理</text>
      </view>
      <view class="menu-item" :style="ordersAnimation" @click="navigateToOrders">
        <image src="/static/image/order-icon.png" />
        <text>订单</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import config from '@/utils/config'
import { request } from '@/utils/api'
import { logError } from '@/utils/logger'

// 基础数据
const products = ref([])
const filteredProducts = ref([])
const categories = ref(['全部', '电子产品', '学习用品', '生活用品', '运动用品', '其他'])
const selectedCategory = ref('全部')
const searchKeyword = ref('')
const hasSearched = ref(false)

// 是否正在加载更多
const loadingMore = ref(false)
// 分页数据
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)

// 菜单动画
const menuVisible = ref(false)
const postAnimation = ref({})
const manageAnimation = ref({})
const ordersAnimation = ref({})

// 页面显示时刷新
onShow(() => {
  refreshProducts()
})

// 刷新商品列表：重置分页并拉第一页
const refreshProducts = async () => {
  pageNum.value = 1
  hasMore.value = true
  products.value = []
  filteredProducts.value = []
  hasSearched.value = false
  await getProducts()
}

// 获取商品（分页加载）
// 已在后端做 status='可交易' 过滤，前端无需再次筛选 status
const getProducts = async () => {
  try {
    if (!hasMore.value) return
    const res = await request({
      url: `${config.baseURL}/trades?pageNum=${pageNum.value}&pageSize=${pageSize.value}`
    })
    if (Array.isArray(res)) {
      if (res.length < pageSize.value) hasMore.value = false
      products.value.push(...res)
      applyFilter()
      pageNum.value++
    } else {
      hasMore.value = false
    }
  } catch (err) {
    logError(err)
    hasMore.value = false
  }
}

// 搜索输入变化
const onSearchInput = (e) => {
  searchKeyword.value = e.detail.value.trim()
}

// 搜索商品
const onSearch = () => {
  if (!searchKeyword.value) {
    filteredProducts.value = products.value
    hasSearched.value = false
    return
  }
  const kw = searchKeyword.value.toLowerCase()
  const results = products.value.filter(item =>
    item.title.toLowerCase().includes(kw)
  )
  filteredProducts.value = results
  hasSearched.value = true
  selectedCategory.value = '全部'
  if (results.length === 0) {
    uni.showToast({ title: '没有找到相关商品', icon: 'none' })
  }
}

// 选择分类
const onCategorySelect = (category) => {
  selectedCategory.value = category
  applyFilter()
}

// 筛选并更新 filteredProducts
const applyFilter = () => {
  let base = products.value
  if (hasSearched.value) {
    const kw = searchKeyword.value.toLowerCase()
    base = base.filter(item =>
      item.title.toLowerCase().includes(kw)
    )
  }
  if (selectedCategory.value !== '全部') {
    base = base.filter(item =>
      item.category === selectedCategory.value
    )
  }
  filteredProducts.value = base
}

// 跳转到详情页
const toDetail = (id) => {
  const item = filteredProducts.value.find(i => i.trade_id === id)
  uni.navigateTo({
    url: '/pages/mall/detail/detail',
    success: () => {
      setTimeout(() => {
        uni.$emit('sendProductData', { item })
      }, 100)
    }
  })
}

// 菜单展开/收起动画
const toggleMenu = () => {
  if (!menuVisible.value) {
    menuVisible.value = true
    setTimeout(() => {
      postAnimation.value = { opacity: 1, transform: 'translate(-60px, -60px)' }
      manageAnimation.value = { opacity: 1, transform: 'translate(-100px, 0px)' }
      ordersAnimation.value = { opacity: 1, transform: 'translate(0px, -100px)' }
    }, 50)
  } else {
    postAnimation.value = manageAnimation.value = ordersAnimation.value = {
      opacity: 0,
      transform: 'translate(0, 0)'
    }
    setTimeout(() => {
      menuVisible.value = false
    }, 300)
  }
}

// 上拉加载更多
const loadMore = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    await getProducts()
  } catch (e) {
    logError(e)
  } finally {
    loadingMore.value = false
  }
}

// 页面跳转
const navigateToPost = () => {
  uni.navigateTo({ url: '/pages/mall/post/post' })
}
const navigateToManage = () => {
  uni.navigateTo({ url: '/pages/mall/manage/manage' })
}
const navigateToOrders = () => {
  uni.navigateTo({ url: '/pages/mall/orders/orders' })
}
</script>

<style>
.container {
  min-height: 100vh;
  background-color: #f6f6f6;
}

/* 搜索框 */
.search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
}
.search-input {
  flex: 1;
  height: 72rpx;
  padding: 0 30rpx;
  border: 2rpx solid #ddd;
  border-radius: 10rpx;
  font-size: 28rpx;
}
.search > button {
  margin-left: 20rpx;
  width: 160rpx;
  height: 80rpx;
  background-color: #204dad;
  color: white;
  border-radius: 10rpx;
  font-size: 32rpx;
}

/* 滑动分类 */
.category-scroll {
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  padding: 20rpx 0;
  background: #fff;
}
.category-item {
  display: inline-block;
  padding: 16rpx 30rpx;
  margin-right: 20rpx;
  border-radius: 10rpx;
  font-size: 28rpx;
  background-color: #f0f0f0;
  color: #333;
  transition: all 0.3s;
}
.category-item.selected {
  background-color: #204dad;
  color: #fff;
}

/* 商品列表：两列布局 */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 20rpx;
}
.product-item {
  margin: 8px;
  width: 40%;
  background: #fff;
  padding: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.1);
}
.product-image {
  width: 100%;
  height: 300rpx;
  border-radius: 10rpx;
}
.product-name {
  font-size: 36rpx;
  font-weight: bold;
  margin-top: 10rpx;
  margin-left: 10rpx;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.product-price {
  color: #f56c6c;
  font-size: 32rpx;
  margin-top: 10rpx;
}

/* 发布者信息 */
.seller-info {
  display: flex;
  align-items: center;
  margin-top: 10rpx;
}
.seller-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 20rpx;
}
.seller-name {
  font-size: 24rpx;
  color: #666;
}

/* 空数据 / 加载更多 / 无更多 */
.empty-message,
.loading-more,
.no-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
}
.empty-message text {
  font-size: 32rpx;
  color: #999;
}

/* 菜单按钮 */
.menu-button {
  position: fixed;
  bottom: 160rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background-color: rgba(32, 77, 173, 0.73);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 1000;
}
.menu-icon {
  width: 80rpx;
  height: 80rpx;
}

/* 菜单容器 */
.menu-container {
  position: fixed;
  bottom: 160rpx;
  right: 40rpx;
  width: 120rpx;
  height: 120rpx;
}
.menu-item {
  position: absolute;
  width: 140rpx;
  height: 140rpx;
  background-color: rgba(32, 77, 173, 0.73);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: 0;
  transform: translate(0, 0);
  transition: all 0.3s ease;
}
.menu-item image {
  width: 60rpx;
  height: 60rpx;
  margin-bottom: 10rpx;
}
.menu-item text {
  font-size: 24rpx;
  color: white;
}
</style>
