<template>
  <view class="order-container">
    <!-- Tab 切换 -->
    <view class="tab-bar">
      <text
        @tap="switchTab('purchased')"
        :class="{ active: activeTab === 'purchased' }"
      >我购买的</text>
      <text
        @tap="switchTab('sold')"
        :class="{ active: activeTab === 'sold' }"
      >我出售的</text>
    </view>

    <!-- 订单列表（支持下拉刷新 & 上拉加载） -->
    <scroll-view
      class="order-list"
      scroll-y
      style="height:100vh"
      @scrolltolower="loadMore"
      lower-threshold="50"
    >
      <!-- 首屏加载中 -->
      <view v-if="initialLoading" class="loading">加载中…</view>

      <!-- 循环渲染订单 -->
      <view
        v-for="item in orders"
        :key="item.trade_id"
        class="order-card"
      >
        <image
          v-if="item.fileList?.[0]?.type === 'image'"
          class="order-image"
          :src="item.fileList[0].url"
          mode="aspectFill"
        />
        <video
          v-else-if="item.fileList?.[0]?.type === 'video'"
          class="order-image"
          :src="item.fileList[0].url"
          controls
        />

        <view class="order-info">
          <text class="order-title">{{ item.title }}</text>
          <text class="order-price">￥{{ item.price }}</text>
          <text class="order-status">
            {{
              item.status === '交易完成'
                ? '交易完成'
                : item.buyer_confirm && !item.seller_confirm
                ? '待卖家确认'
                : !item.buyer_confirm && item.seller_confirm
                ? '待买家确认'
                : item.status
            }}
          </text>
        </view>

        <view class="order-actions">
          <button
            v-if="item.status === '交易中' && (!item.buyer_confirm || !item.seller_confirm)"
            @tap="confirmTrade(item.trade_id)"
          >确认交易</button>
          <button
            v-if="item.status === '交易中'"
            @tap="cancelTrade(item.trade_id)"
            class="cancel-btn"
          >取消</button>
          <button
            v-if="activeTab === 'sold' && item.status === '已取消'"
            @tap="relistTrade(item.trade_id)"
          >重新上架</button>
        </view>
      </view>

      <!-- 底部状态提示 -->
      <view v-if="loading && orders.length" class="loading">加载中…</view>
      <view v-else-if="!hasMore && orders.length" class="no-more">没有更多了</view>
      <view
        v-else-if="!loading && !initialLoading && !orders.length"
        class="empty-message"
      >暂无订单</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import config from '@/utils/config'
import { request } from '@/utils/api'
import { logError } from '@/utils/logger'

const activeTab = ref('purchased')
const orders = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)
const initialLoading = ref(true)

let openid = ''

onMounted(async () => {
  const userInfo = uni.getStorageSync('userInfo') || {}
  if (!userInfo.openid) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    initialLoading.value = false
    return
  }
  openid = userInfo.openid
  await refresh()
})

onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})

async function switchTab(tab) {
  if (activeTab.value === tab) return
  activeTab.value = tab
  await refresh()
}

async function refresh() {
  orders.value = []
  pageNum.value = 1
  hasMore.value = true
  initialLoading.value = true
  await loadMore()
}

async function loadMore() {
  if (!hasMore.value || loading.value) return
  loading.value = true
  try {
    const path =
      activeTab.value === 'purchased'
        ? 'userPurchasedTrades'
        : 'userSoldTrades'
    // 手动拼 query string
    const url = `${config.baseURL}/${path}` +
      `?openid=${encodeURIComponent(openid)}` +
      `&pageNum=${pageNum.value}` +
      `&pageSize=${pageSize.value}`

    const res = await request({
      url,
      method: 'GET'
    })
    if (Array.isArray(res)) {
      if (res.length < pageSize.value) hasMore.value = false
      orders.value.push(...res)
      pageNum.value++
    } else {
      hasMore.value = false
    }
  } catch (err) {
    logError(err)
    uni.showToast({ title: '加载失败', icon: 'none' })
    hasMore.value = false
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

async function confirmTrade(id) {
  try {
    await request({
      url: `${config.baseURL}/trades/${id}/confirm?openid=${encodeURIComponent(openid)}`,
      method: 'PUT'
    })
    uni.showToast({ title: '操作成功' })
    await refresh()
  } catch (err) {
    logError(err)
    uni.showToast({ title: '确认失败', icon: 'none' })
  }
}

function cancelTrade(id) {
  uni.showModal({
    title: '取消订单',
    content: '取消后无法恢复，确认吗？',
    success: async res => {
      if (!res.confirm) return
      try {
        await request({
          url: `${config.baseURL}/trades/${id}/status?status=已取消`,
          method: 'PUT'
        })
        uni.showToast({ title: '已取消' })
        await refresh()
      } catch (err) {
        logError(err)
        uni.showToast({ title: '取消失败', icon: 'none' })
      }
    }
  })
}

async function relistTrade(id) {
  try {
    await request({
      url: `${config.baseURL}/trades/${id}/status?status=可交易`,
      method: 'PUT'
    })
    uni.showToast({ title: '已上架' })
    await refresh()
  } catch (err) {
    logError(err)
    uni.showToast({ title: '上架失败', icon: 'none' })
  }
}
</script>

<style>
.order-container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}
.tab-bar {
  display: flex;
  justify-content: space-around;
  background: #fff;
  padding: 20rpx 0;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.1);
}
.tab-bar text {
  padding: 20rpx 60rpx;
  border-radius: 20rpx;
  font-weight: bold;
  color: #666;
}
.tab-bar text.active {
  background: #204dad;
  color: #fff;
}

.order-list {
  margin-top: 20rpx;
}
.order-card {
  display: flex;
  align-items: center;
  background: #fff;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 20rpx;
  box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.1);
}
.order-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 10rpx;
  margin-right: 20rpx;
}
.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.order-title { font-size: 30rpx; font-weight: bold; color: #333; }
.order-price { font-size: 28rpx; color: #ff5722; }
.order-status { font-size: 24rpx; color: #666; }

.order-actions {
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.order-actions button {
  width: 100rpx;
  border-radius: 5rpx;
  font-size: 24rpx;
  padding: 0;
}
.cancel-btn {
  background: #ff4d4f;
  color: #fff;
}

.loading,
.no-more,
.empty-message {
  text-align: center;
  color: #999;
  padding: 30rpx 0;
  font-size: 28rpx;
}
</style>
