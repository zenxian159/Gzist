<template>
  <view class="manage-container">
    <!-- 投放分页列表 -->
    <scroll-view
      class="product-list"
      scroll-y
      style="height: 100vh;"
      @scrolltolower="loadMore"
      lower-threshold="50"
    >
      <!-- 首屏加载中，且列表为空时显示 loading -->
      <view v-if="initialLoading" class="loading">加载中…</view>

      <!-- 列表循环渲染 -->
      <view v-for="item in products" :key="item.trade_id" class="manage-item">
        <view class="product-card">
          <image
            v-if="item.fileList?.[0]?.type === 'image'"
            class="manage-image"
            :src="item.fileList[0].url"
            mode="aspectFill"
          />
          <video
            v-else-if="item.fileList?.[0]?.type === 'video'"
            class="manage-image"
            :src="item.fileList[0].url"
            controls
          />

          <view class="manage-info">
            <text class="manage-title">{{ item.title }}</text>
            <text class="manage-price">￥{{ item.price }}</text>
          </view>
        </view>

        <!-- 底部操作按钮 -->
        <view class="button-container">
          <button
            class="sold-btn"
            @click="toggleStatus(item.trade_id, item.status)"
          >
            {{ item.status }}
          </button>
          <button
            class="edit-btn"
            @click="editProduct(item.trade_id)"
            :disabled="item.status !== '可交易'"
          >
            编辑
          </button>
          <button class="delete-btn" @click="deleteProduct(item.trade_id)">
            删除
          </button>
        </view>
      </view>

      <!-- 底部提示：加载中 / 无更多 / 空状态 -->
      <view v-if="loading && products.length" class="loading">加载中…</view>
      <view v-else-if="!hasMore && products.length" class="no-more">没有更多了</view>
      <view
        v-else-if="!loading && !products.length && !initialLoading"
        class="empty"
      >
        暂无商品
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { request } from '@/utils/api'
import { logError } from '@/utils/logger'
import config from '@/utils/config'

// 响应式数据
const products = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const hasMore = ref(true)
const loading = ref(false)
const initialLoading = ref(true)
const openid = ref('')

// 生命周期函数：组件挂载时获取 openid 并加载第一页
onMounted(async () => {
  try {
    const userInfo = uni.getStorageSync('userInfo')
    if (!userInfo || !userInfo.openid) {
      uni.showToast({ title: '未找到用户信息，请先登录', icon: 'none' })
      initialLoading.value = false
      return
    }
    openid.value = userInfo.openid
    await loadProducts()
  } catch (e) {
    console.error('获取 openid 失败:', e)
    initialLoading.value = false
  }
})

// 监听下拉刷新，重置并拉第一页
onPullDownRefresh(async () => {
  resetAndReload()
  uni.stopPullDownRefresh()
})

async function loadProducts() {
  if (!hasMore.value || loading.value) return

  loading.value = true
  try {
    const res = await request({
      url: `${config.baseURL}/userTrades?openid=${openid.value}&pageNum=${pageNum.value}&pageSize=${pageSize.value}`,
      method: 'GET'
    })
    if (Array.isArray(res)) {
      if (res.length < pageSize.value) {
        hasMore.value = false
      }
      products.value.push(...res)
      pageNum.value++
    } else {
      hasMore.value = false
    }
  } catch (err) {
    logError(err)
    uni.showToast({ title: '商品列表加载失败', icon: 'none' })
    hasMore.value = false
  } finally {
    loading.value = false
    initialLoading.value = false
  }
}

// 上拉加载更多
function loadMore() {
  loadProducts()
}

// 删除商品
function deleteProduct(tradeId) {
  uni.showModal({
    title: '删除确认',
    content: '删除后不可恢复，确认要删除这件商品吗？',
    success: async (res) => {
      if (!res.confirm) return
      try {
        await request({
          url: `${config.baseURL}/trades/${tradeId}`,
          method: 'DELETE'
        })
        uni.showToast({ title: '删除成功', icon: 'success' })
        resetAndReload()
      } catch (err) {
        logError(err)
        uni.showToast({ title: '删除失败，请稍后重试', icon: 'none' })
      }
    }
  })
}

// 上/下架切换
async function toggleStatus(tradeId, currentStatus) {
  let newStatus = ''
  if (currentStatus === '可交易') {
    newStatus = '已下架'
  } else if (currentStatus === '已下架') {
    newStatus = '可交易'
  } else {
    uni.showToast({ title: `当前【${currentStatus}】不可切换`, icon: 'none' })
    return
  }

  try {
    await request({
      url: `${config.baseURL}/trades/${tradeId}/status`,
      method: 'PUT',
      data: { status: newStatus }
    })
    uni.showToast({ title: '操作成功', icon: 'success' })
    resetAndReload()
  } catch (err) {
    logError(err)
    uni.showToast({ title: '操作失败，请稍后重试', icon: 'none' })
  }
}

// 编辑商品
function editProduct(tradeId) {
  const item = products.value.find((p) => p.trade_id === tradeId)
	console.log(item,"asdasoijdas");
  if (!item) {
    uni.showToast({ title: '商品不存在', icon: 'none' })
    return
  }
  if (item.status !== '可交易') {
    uni.showToast({ title: `该商品为【${item.status}】，无法编辑`, icon: 'none' })
    return
  }
  uni.navigateTo({
    url: '/pages/mall/post/post',
    success: (res) => {
      uni.$emit('sendProductData', { item })
    }
  })
}

// 重置并重新拉第一页
function resetAndReload() {
  products.value = []
  pageNum.value = 1
  hasMore.value = true
  loading.value = false
  initialLoading.value = true
  loadProducts()
}
</script>

<style>
.manage-container {
  padding: 20rpx;
  background-color: #f7f7f7;
  min-height: 100vh;
}

/* 列表项整体 */
.manage-item {
  background: #fff;
  margin-bottom: 20rpx;
  padding: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 8rpx rgba(0, 0, 0, 0.05);
}

/* 卡片：图片 + 标题 + 价格 */
.product-card {
  flex-direction: row;
  display: flex;
  align-items: center;
}

.manage-image {
  width: 100rpx;
  height: 100rpx;
  border-radius: 12rpx;
  margin-right: 20rpx;
  background-color: #f0f0f0;
}

.manage-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.manage-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.manage-price {
  font-size: 28rpx;
  color: #204dad;
}

/* 操作按钮容器 */
.button-container {
  margin-top: 20rpx;
  display: flex;
  flex-direction: row;
  gap: 20rpx;
}

/* 各类按钮 */
.sold-btn,
.edit-btn,
.delete-btn {
  flex: 1;
  border-radius: 12rpx;
  font-size: 28rpx;
  text-align: center;
  border: 1rpx solid #ddd;
  color: #204dad;
  background-color: #fff;
  transition: background 0.3s;
}

.sold-btn {
  border-color: #ffa64d;
  color: #ffa64d;
}

.edit-btn {
  border-color: #4da6ff;
  color: #4da6ff;
}

.delete-btn {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.sold-btn:active,
.edit-btn:active,
.delete-btn:active {
  background-color: rgba(0, 0, 0, 0.03);
}

/* 加载中 / 空状态 / 无更多 */
.loading,
.no-more,
.empty {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  padding: 30rpx 0;
}
</style>
